import { AptosClient, TxnBuilderTypes, AptosAccount, BCS } from "aptos";
import { compile } from "@js2move/compiler";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

export class GasEstimationService {
  private testnetClient: AptosClient;
  private mainnetClient: AptosClient;

  constructor() {
    // Default to Movement RPC endpoints if env not provided
    this.testnetClient = new AptosClient(
      process.env.RPC_TESTNET ?? "https://testnet.movementnetwork.xyz/v1"
    );
    this.mainnetClient = new AptosClient(
      process.env.RPC_MAINNET ?? "https://mainnet.movementnetwork.xyz/v1"
    );
  }

  async getGasPrice(network: "testnet" | "mainnet") {
    const client =
      network === "testnet" ? this.testnetClient : this.mainnetClient;

    const maxRetries = 3;
    let lastErr: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const estimate = await (client as any).estimateGasPrice();
        // aptos SDK returns { gas_estimate }
        const value = estimate?.gas_estimate ?? estimate;
        if (typeof value !== "number")
          throw new Error("Invalid gas price from RPC");
        return value;
      } catch (err) {
        lastErr = err;
        // exponential backoff before retrying
        const backoffMs = 100 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }

    // All retries failed — surface an explicit error for callers to handle
    const err = new Error("RPC failed");
    (err as any).original = lastErr;
    throw err;
  }

  /**
   * Try to compile source into a temporary Move package and return the package directory.
   * Requires the 'movement' or 'aptos' CLI or docker fallback via APTOS_DOCKER_IMAGE env.
   */
  private async compileToPackageDir(moveSource: string, moveTomlContent?: string): Promise<string> {
    // Create temp package
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "js2move-"));
    const pkgDir = path.join(tmpDir, "package");
    fs.mkdirSync(pkgDir, { recursive: true });
    const srcDir = path.join(pkgDir, "sources");
    fs.mkdirSync(srcDir, { recursive: true });

    // Move.toml: use provided content when available, otherwise a minimal default
    const moveToml = moveTomlContent
      ? moveTomlContent
      : `[package]
name = "js2move_tmp"
version = "0.0.1"
`;

    fs.writeFileSync(path.join(pkgDir, "Move.toml"), moveToml, {
      encoding: "utf8",
    });

    // Use the compiler to produce Move source code
    const moveCode =
      typeof moveSource === "string" ? compile(moveSource) : moveSource;
    const modulePath = path.join(srcDir, "js2move_main.move");
    fs.writeFileSync(
      modulePath,
      typeof moveCode === "string" ? moveCode : moveCode.code,
      { encoding: "utf8" }
    );

    // Run movement or aptos CLI or docker fallback to compile
    const hasMovement = (() => {
      try {
        const r = spawnSync("movement", ["--version"], { encoding: "utf8" });
        return !r.error && r.status === 0;
      } catch {
        return false;
      }
    })();

    const hasAptos = (() => {
      try {
        const r = spawnSync("aptos", ["--version"], { encoding: "utf8" });
        return !r.error && r.status === 0;
      } catch {
        return false;
      }
    })();

    const dockerImage = process.env.APTOS_DOCKER_IMAGE; // optional
    const dockerAvailable = (() => {
      try {
        const r = spawnSync("docker", ["--version"], { encoding: "utf8" });
        return !r.error && r.status === 0;
      } catch {
        return false;
      }
    })();

    if (hasMovement) {
      const res = spawnSync("movement", ["move", "compile"], {
        cwd: pkgDir,
        encoding: "utf8",
      });
      if (res.status !== 0)
        throw new Error(`movement compile failed: ${res.stderr || res.stdout}`);
      return pkgDir;
    }

    if (hasAptos) {
      const res = spawnSync("aptos", ["move", "compile"], {
        cwd: pkgDir,
        encoding: "utf8",
      });
      if (res.status !== 0)
        throw new Error(`aptos compile failed: ${res.stderr || res.stdout}`);
      return pkgDir;
    }

    if (dockerAvailable && dockerImage) {
      const mountPath = pkgDir.replace(/\\/g, "/");
      const args = [
        "run",
        "--rm",
        "-v",
        `${mountPath}:/workspace`,
        "-w",
        "/workspace",
        dockerImage,
        "aptos",
        "move",
        "compile",
        "--skip-fetch-latest-git-deps",
      ];
      const res = spawnSync("docker", args, { encoding: "utf8" });
      if (res.status !== 0)
        throw new Error(
          `Docker aptos compile failed: ${res.stderr || res.stdout}`
        );
      return pkgDir;
    }

    throw new Error(
      "Compilation toolchain not available: install 'movement' or 'aptos' CLI, or provide APTOS_DOCKER_IMAGE for docker fallback"
    );
  }

  /**
   * Read compiled module bytes from a package dir (searches build directory)
   */
  private readCompiledModuleBytes(pkgDir: string): Buffer[] {
    const buildDir = path.join(pkgDir, "build");
    if (!fs.existsSync(buildDir)) {
      // Some toolchains output to 'build' or 'out' or 'bytecode' - try a few
      const altPaths = [
        path.join(pkgDir, "out"),
        path.join(pkgDir, "bytecode"),
        path.join(pkgDir, "build"),
      ];
      const found = altPaths.find((p) => fs.existsSync(p));
      if (!found)
        throw new Error("Compiled artifacts not found after compilation");
      return this.readCompiledModuleBytes(found);
    }

    // collect files that look like module bytecode
    const files = fs.readdirSync(buildDir).map((f) => path.join(buildDir, f));
    const buffers: Buffer[] = [];
    files.forEach((fpath) => {
      const stat = fs.statSync(fpath);
      if (stat.isFile()) {
        const b = fs.readFileSync(fpath);
        buffers.push(Buffer.from(b));
      }
    });

    if (buffers.length === 0)
      throw new Error("No compiled module bytes found in build directory");
    return buffers;
  }

  
  async estimateFromSource(
    moveSource: string,
    network: "testnet" | "mainnet",
    options?: { mode?: "fast" | "accurate"; moveToml?: string }
  ) {
    // Default to fast synthetic simulation to avoid compiler invocations unless explicitly requested
    const mode = options?.mode ?? "fast";

    if (mode === "accurate") {
      // Accurate mode (full compile + simulate) — only run when explicitly requested
      // Keep the existing full compile flow
      const pkgDir = await this.compileToPackageDir(moveSource, options?.moveToml);
      const moduleBytes = this.readCompiledModuleBytes(pkgDir);
      const combined = Buffer.concat(moduleBytes);
      // Build a plain entry function payload object (avoid SDK class instance mismatch)
      const payloadAcc = {
        type: 'entry_function_payload',
        function: '0x1::code::publish_package_txn',
        type_arguments: [],
        arguments: [BCS.bcsSerializeBytes(combined), BCS.bcsSerializeBytes(Buffer.from('{}'))],
      } as any;

      const clientAcc =
        network === "testnet" ? this.testnetClient : this.mainnetClient;
      const accountAcc = new AptosAccount();
      const senderAddressAcc = typeof accountAcc.address === 'function' ? accountAcc.address().toString() : String((accountAcc as any).address);
      let generatedAcc;
      try {
        generatedAcc = await clientAcc.generateTransaction(senderAddressAcc, payloadAcc, { max_gas_amount: "400000" });
      } catch (err: any) {
        const e = new Error('RPC/GenerateTransaction failed');
        (e as any).original = err;
        throw e;
      }
      const signedAcc = await clientAcc.signTransaction(accountAcc, generatedAcc);
      let simulationAcc: any;
      try {
        simulationAcc = await (clientAcc as any).simulateTransaction(signedAcc);
      } catch (err: any) {
        const e = new Error("RPC failed");
        (e as any).original = err;
        throw e;
      }

      const gasUsedAcc =
        Array.isArray(simulationAcc) && simulationAcc[0]?.gas_used
          ? Number(simulationAcc[0].gas_used)
          : Number(simulationAcc?.gas_used ?? 0);
      if (!gasUsedAcc || gasUsedAcc <= 0)
        throw new Error("Simulation did not return gas usage");
      const gasPriceAtomicAcc = await this.getGasPrice(network);
      const totalAtomicAcc = BigInt(gasUsedAcc) * BigInt(gasPriceAtomicAcc);
      const totalAPtAcc = Number(totalAtomicAcc) / 100_000_000;

      return {
        estimatedGas: gasUsedAcc,
        maxGas: Math.ceil(gasUsedAcc * 1.25),
        gasPrice: gasPriceAtomicAcc,
        totalCost: Number(totalAtomicAcc),
        currency: "APT",
        totalCostAPT: totalAPtAcc,
        source: "full-simulation",
        approximate: false,
        raw: { simulation: simulationAcc },
      };
    }

    // Fast path: create a synthetic publish payload (based on source size) and simulate it
    // This avoids running the full Move compilation pipeline for a quick estimate
    const client =
      network === "testnet" ? this.testnetClient : this.mainnetClient;

    const originalSize = Buffer.from(moveSource).length;

    // Create a synthetic byte vector to approximate module bytecode size and complexity
    // Cap the synthetic size to avoid huge transactions during estimation
    const MIN_BYTES = 256;
    const MAX_BYTES = 200_000; // ~200KB cap
    const syntheticSize = Math.min(
      MAX_BYTES,
      Math.max(MIN_BYTES, originalSize)
    );
    const syntheticBytes = Buffer.alloc(syntheticSize, 0);

    // Build a plain entry function payload (avoid SDK class instance mismatch)
    const payload = {
      type: 'entry_function_payload',
      function: '0x1::code::publish_package_txn',
      type_arguments: [],
      arguments: [BCS.bcsSerializeBytes(syntheticBytes), BCS.bcsSerializeBytes(Buffer.from('{}'))]
    } as any;

    // Use ephemeral account for simulation
    const account = new AptosAccount();

    // Generate and sign (ensure sender is a hex string)
    const senderAddress = typeof account.address === 'function' ? account.address().toString() : String((account as any).address);
    let generated;
    try {
      generated = await client.generateTransaction(senderAddress, payload, { max_gas_amount: "200000" });
    } catch (err: any) {
      const e = new Error('RPC/GenerateTransaction failed');
      (e as any).original = err;
      throw e;
    }
    const signed = await client.signTransaction(account, generated);

    // Simulate and surface RPC failures explicitly
    let simulation: any;
    try {
      simulation = await (client as any).simulateTransaction(signed);
    } catch (err: any) {
      const e = new Error("RPC failed");
      (e as any).original = err;
      throw e;
    }

    const gasUsed =
      Array.isArray(simulation) && simulation[0]?.gas_used
        ? Number(simulation[0].gas_used)
        : Number(simulation?.gas_used ?? 0);
    if (!gasUsed || gasUsed <= 0) {
      throw new Error("Simulation did not return gas usage");
    }

    // Fetch current gas price (atomic units)
    const gasPriceAtomic = await this.getGasPrice(network);

    const totalAtomic = BigInt(gasUsed) * BigInt(gasPriceAtomic);
    const totalAPT = Number(totalAtomic) / 100_000_000;

    return {
      estimatedGas: gasUsed,
      maxGas: Math.ceil(gasUsed * 1.25),
      gasPrice: gasPriceAtomic,
      totalCost: Number(totalAtomic),
      currency: "APT",
      totalCostAPT: totalAPT,
      source: "synthetic-simulation",
      originalSize,
      syntheticSize,
      approximate: true,
      raw: { simulation },
    };
  }
}
