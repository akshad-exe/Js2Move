import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/shared/Navbar";
import { useTheme } from "@/lib/theme/ThemeProvider";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import Toolbar from "./components/Toolbar";
import GasPanel from "./components/GasPanel";
import ValidationPanel from "./components/ValidationPanel";
import DeploymentPanel from "./components/DeploymentPanel";
import { Sidebar } from "./Sidebar";
import { DEFAULT_MOVEJS_CODE } from "./utils/defaultCode";
import { useCompiler, useDeployment } from "@/hooks";
import { useWallet } from "@/lib/wallet/useWallet";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import { compileCode, submitSignedTransaction } from "@/lib/api/deploymentClient";

type OutputTab = "compile" | "validation" | "gas" | "deploy";

export function PlaygroundPage() {
  const { theme } = useTheme();
  const [code, setCode] = useState(DEFAULT_MOVEJS_CODE);
  const [outputTab, setOutputTab] = useState<OutputTab>("compile");
  const { compile, isCompiling, output, error, setOutput, setError, validate, isValidating, analyze, isAnalyzing } = useCompiler();
  const { isDeploying, fetchDeployments } = useDeployment();
  const { isConnected, address } = useWallet();
  const { signTransaction, signAndSubmitTransaction, wallet, connected: adapterConnected } = useAptosWallet();
  const [validationOutput, setValidationOutput] = useState("");

  // Check wallet balance when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      // Balance is now checked automatically in useWallet hook
    }
  }, [isConnected, address]);

  const handleCompile = async () => {
    const result = await compile(code);
    if (result?.success) {
      setOutputTab("compile");
      toast.success('Compilation successful!');
    }
  };

  const handleValidate = async () => {
    try {
      const result = await validate(code);
      if (result) {
        setValidationOutput(JSON.stringify(result, null, 2));
        setOutputTab("validation");
        toast.success('Validation complete!');
      }
    } catch (err) {
      toast.error('Validation failed');
    }
  };

  const handleAnalyze = async () => {
    try {
      const result = await analyze(code);
      if (result) {
        setValidationOutput(JSON.stringify(result, null, 2));
        setOutputTab("validation");
        toast.success('Analysis complete!');
      }
    } catch (err) {
      toast.error('Analysis failed');
    }
  };

  const handleEstimateGas = async () => {
    setOutputTab("gas");
    // Gas estimation will be handled in GasPanel component
  };

  const handleReset = () => {
    setCode(DEFAULT_MOVEJS_CODE);
    setOutput("");
    setError("");
    setValidationOutput("");
    toast.success('Reset to default code');
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([output || code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "code.move";
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Code downloaded!');
    } catch (err) {
      toast.error('Failed to download file');
    }
  };

  // Extract contract name from MoveJS code
  const extractContractName = (code: string): string => {
    // Look for contract declaration: contract ContractName {
    const contractMatch = code.match(/contract\s+(\w+)\s*{/);
    if (contractMatch) {
      return contractMatch[1];
    }
    
    // Fallback: look for class declaration
    const classMatch = code.match(/class\s+(\w+)\s*{/);
    if (classMatch) {
      return classMatch[1];
    }
    
    // Final fallback
    return 'Contract';
  };

  const handleDeploy = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!address) {
      toast.error('Wallet address not available');
      return;
    }

    if (!output || !output.trim()) {
      toast.error('Please compile your code first');
      return;
    }

    // Extract contract name from the source code
    const contractName = extractContractName(code);

    // Step 1: Compile code and get unsigned transaction
    toast.loading('Compiling code...', { id: 'deploy' });
    const compileResult = await compileCode({
      source: code,
        moduleName: contractName,
        senderAddress: address.toString()
      });

      if (!compileResult.success) {
        toast.error(compileResult.error || 'Compilation failed', { id: 'deploy' });
        return;
      }

      // Step 2: Sign the transaction with wallet
      toast.loading('Please sign the transaction in your wallet...', { id: 'deploy' });
      
      let signedTransaction: any;
      let usedSignAndSubmit = false;
      
      try {
        console.log('Raw compile result:', compileResult);
        console.log('Compile result success:', compileResult.success);
        console.log('Unsigned transaction exists:', !!compileResult.unsignedTransaction);
        console.log('Unsigned transaction type:', typeof compileResult.unsignedTransaction);
        
        if (!compileResult.unsignedTransaction) {
          throw new Error('No unsigned transaction received from server');
        }
        
        // Validate wallet connection and methods BEFORE attempting to sign
        if (!adapterConnected) {
          throw new Error('Wallet not connected. Please connect your wallet first.');
        }
        if (!wallet?.name) {
          throw new Error('No wallet detected. Please install and connect a wallet.');
        }
        if (!signTransaction && !signAndSubmitTransaction) {
          throw new Error('Wallet signing not available. Please reconnect your wallet.');
        }
        
        console.log('Available signing methods:', {
          signTransaction: !!signTransaction,
          signAndSubmitTransaction: !!signAndSubmitTransaction,
          wallet: wallet?.name,
          connected: adapterConnected
        });
        
        // Reconstruct and normalize unsigned transaction for wallet signing
        function hexToUint8Array(hex: string) {
          if (typeof hex !== 'string') return hex;
          if (hex.startsWith('0x')) hex = hex.slice(2);
          if (hex === '') return new Uint8Array();
          if (hex.length % 2 === 1) hex = '0' + hex;
          const len = hex.length / 2;
          const arr = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            arr[i] = parseInt(hex.substr(i * 2, 2), 16);
          }
          return arr;
        }

        function normalizeFunctionAddress(fn: string) {
          // Convert long zero-padded addresses to canonical form: 0x<no-leading-zeros>
          if (!fn || typeof fn !== 'string') return fn;
          const parts = fn.split('::');
          if (parts.length < 3) return fn;
          const addr = parts[0];
          if (addr.startsWith('0x')) {
            // remove 0x and leading zeros
            const raw = addr.slice(2).replace(/^0+/, '') || '0';
            return `0x${raw}::${parts[1]}::${parts[2]}`;
          }
          return fn;
        }

        const unsignedTxnOrig = compileResult.unsignedTransaction;
        const preparedUnsignedTxn: any = {
          ...unsignedTxnOrig,
          sender: typeof unsignedTxnOrig.sender === 'string' ? unsignedTxnOrig.sender : unsignedTxnOrig.sender?.toString?.() ?? unsignedTxnOrig.sender,
          sequence_number: Number(unsignedTxnOrig.sequence_number),
          max_gas_amount: Number(unsignedTxnOrig.max_gas_amount),
          gas_unit_price: Number(unsignedTxnOrig.gas_unit_price),
          expiration_timestamp_secs: Number(unsignedTxnOrig.expiration_timestamp_secs),
          chain_id: Number(unsignedTxnOrig.chain_id ?? unsignedTxnOrig.chainId ?? 0),
          payload: ((): any => {
            const p = unsignedTxnOrig.payload || {};
            if (p.type === 'entry_function_payload' || p?.value) {
              const fn = p.function || (p.value && p.value.module_name && p.value.function_name ? ((): string | undefined => {
                const moduleName = p.value.module_name.name?.value || '';
                const funcName = p.value.function_name.value || '';
                const addrObj = p.value.module_name.address?.address;
                let addrHex = '';
                if (addrObj) {
                  try {
                    addrHex = '0x' + Object.values(addrObj).map((b: any) => (Number(b)).toString(16).padStart(2, '0')).join('');
                  } catch {
                    addrHex = '';
                  }
                }
                return addrHex ? `${addrHex}::${moduleName}::${funcName}` : `${moduleName}::${funcName}`;
              })() : undefined);
              const normalizedFn = normalizeFunctionAddress(fn);
              const args = (p.arguments || p.value?.args || []).map((a: any) => {
                // If argument looks like a hex string (0x...), convert to Uint8Array
                if (typeof a === 'string' && /^0x[0-9a-fA-F]+$/.test(a)) return hexToUint8Array(a);
                // If it's an object map of bytes, convert to Uint8Array
                if (a && typeof a === 'object' && Object.keys(a).every(k => /^\d+$/.test(k))) {
                  const bytesArr = Object.values(a).map((n: any) => Number(n));
                  const hex = bytesArr.map((b: number) => b.toString(16).padStart(2, '0')).join('');
                  return hexToUint8Array('0x' + hex);
                }
                return a;
              });
              return {
                type: 'entry_function_payload',
                function: normalizedFn,
                type_arguments: p.type_arguments || p.ty_args || p.value?.ty_args || [],
                arguments: args,
                value: p.value || undefined
              };
            }
            return p;
          })()
        };

        console.log('Prepared unsigned transaction for wallet:', preparedUnsignedTxn);
        
        // Try signing the raw transaction from the server
        console.log('Attempting to sign transaction...');
        console.log('Transaction to sign:', compileResult.unsignedTransaction);
        console.log('Transaction type:', typeof compileResult.unsignedTransaction);
        
        if (!compileResult.unsignedTransaction) {
          throw new Error('No transaction to sign');
        }
        
        // Prefer signTransaction (returns signed txn) to avoid adapter submit quirks
        usedSignAndSubmit = false;
        const unsignedTxn = preparedUnsignedTxn;

        // Guard to prevent duplicate parallel signing attempts (avoid duplicate logs/requests)
        if ((window as any).__js2move_signing_in_progress) {
          throw new Error('Signing already in progress');
        }
        (window as any).__js2move_signing_in_progress = true;

        // Validate payload structure exists
          if (!unsignedTxn || !unsignedTxn.payload) {
            throw new Error('Invalid transaction: missing payload');
          }
          
          const payload = unsignedTxn.payload;
          
          if (!payload.function) {
            throw new Error('Invalid transaction: missing function in payload');
          }
          
          const minimalPayload = {
            function: payload.function,
            type_arguments: payload.type_arguments || [],
            arguments: (payload.arguments || []).map((a: any) => {
              if (a instanceof Uint8Array) {
                return '0x' + Array.from(a).map(b => b.toString(16).padStart(2, '0')).join('');
              }
              if (typeof a === 'number' || typeof a === 'bigint') return String(a);
              return a;
            })
          } as any;

          console.log('Minimal payload prepared:', JSON.stringify(minimalPayload, null, 2));

          // TEMPORARY WORKAROUND: Try backend signing first, fall back to wallet if not configured
          console.warn('⚠️ Attempting backend signing (requires DEPLOYER_PRIVATE_KEY in backend .env)');
          toast.loading('Submitting transaction...', { id: 'deploy' });
          
          try {
            // Try backend server-side signing first
            const submitResult = await submitSignedTransaction({
              unsignedTransaction: compileResult.unsignedTransaction,
              moduleName: contractName,
              network: 'testnet'
            });

            if (submitResult.txHash) {
              toast.success(`Deployment successful! Transaction: ${submitResult.txHash}`, { id: 'deploy' });
              setOutputTab("deploy");
              await fetchDeployments();
              return;
            } else if (submitResult.error?.includes('Server-side signing not configured')) {
              // Backend doesn't have private key configured, show helpful message
              toast.error('Backend DEPLOYER_PRIVATE_KEY not configured. Please add your private key to packages/backend/.env', { id: 'deploy', duration: 8000 });
              throw new Error('DEPLOYER_PRIVATE_KEY not configured in backend. Add your wallet private key to packages/backend/.env file and restart the backend server.');
            } else {
              throw new Error(submitResult.error || 'Transaction submission failed - no hash returned');
            }
          } catch (backendErr: any) {
            console.error('Backend signing failed:', backendErr);
            throw backendErr;
          }

          // ORIGINAL WALLET SIGNING CODE - DISABLED DUE TO ADAPTER ISSUES
          // Use signAndSubmitTransaction directly with minimal payload
          // if (signAndSubmitTransaction) {
          //   console.log('Calling signAndSubmitTransaction with minimal payload');
          //   try_ {
          //     signPromise = signAndSubmitTransaction(minimalPayload);
          //     const res = await Promise.race([signPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Wallet signing timeout')), 30000))]);
          //     signedTransaction = res;
          //     usedSignAndSubmit = true;
          //     console.log('signAndSubmitTransaction result:', res);
          //   } catch_ (walletErr: any) {
          //     console.error('Wallet signAndSubmitTransaction error:', walletErr);
          //     // Provide user-friendly error message
          //     const errMsg = walletErr?.message || String(walletErr);
          //     if (errMsg.includes('bytecode') || errMsg.includes('undefined')) {
          //       throw new Error('Wallet rejected transaction. This may be due to an unsupported transaction type. Please try reconnecting your wallet or use a different wallet.');
          //     }
          //     throw_ walletErr;
          //   }
          // }

          if (!signedTransaction) {
            throw new Error('Signing failed');
          }
        (window as any).__js2move_signing_in_progress = false;

        // At this point signing has been attempted (via signTransaction or signAndSubmitTransaction)
        console.log('Transaction result:', signedTransaction);
        
        // If using signAndSubmitTransaction, the transaction is already submitted
        if (usedSignAndSubmit) {
          console.log('Transaction submitted via wallet, checking result...');
          // The result should contain the transaction hash
          if (signedTransaction?.hash) {
            toast.success(`Deployment successful! Transaction: ${signedTransaction.hash}`, { id: 'deploy' });
            setOutputTab("deploy");
            await fetchDeployments();
            return;
          } else {
            throw new Error('Transaction submission failed - no hash returned');
          }
        }

      // Step 3: Submit the signed transaction (only if we used signTransaction)
      toast.loading('Submitting transaction...', { id: 'deploy' });
      const submitResult = await submitSignedTransaction({
        signedTransaction,
        moduleName: contractName,
        network: 'testnet'
      });

      if (submitResult.success) {
        toast.success(`Deployment successful! Transaction: ${submitResult.txHash}`, { id: 'deploy' });
        setOutputTab("deploy");
        // Refresh deployments list
        await fetchDeployments();
      } else {
        toast.error(submitResult.error || 'Transaction submission failed', { id: 'deploy' });
      }
    } catch (error: any) {
      console.error('Deployment error:', error);
      toast.error(`Deployment failed: ${error?.message || 'Unknown error'}`, { id: 'deploy' });
    }
  };
  
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <>

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <div className="h-screen flex flex-col" style={{ paddingTop: "4rem" }}>
          {/* Toolbar - Now with Validate & Analyze buttons */}
          <Toolbar
            onCompile={handleCompile}
            onValidate={handleValidate}
            onAnalyze={handleAnalyze}
            onEstimateGas={handleEstimateGas}
            onDeploy={handleDeploy}
            onReset={handleReset}
            onDownload={handleDownload}
            isCompiling={isCompiling}
            isValidating={isValidating}
            isAnalyzing={isAnalyzing}
            isDeploying={isDeploying}
            isWalletConnected={isConnected}
            onToggleSidebar={() => setSidebarOpen((s) => !s)}
          />

          {/* Editor Area */}
          <div className="flex-1 overflow-hidden flex gap-6">
            {/* Sidebar */}
            {sidebarOpen && (
              <div className="hidden md:block md:w-72">
                <Sidebar
                  tab="files"
                  onClose={() => setSidebarOpen(false)}
                  onOpenExample={(exampleCode) => {
                    setCode(exampleCode);
                    setOutput("");
                    setValidationOutput("");
                  }}
                />
              </div>
            )}

            {/* Main editor */}
            <div className="flex-1 min-h-[60vh] flex flex-col rounded-2xl border border-border/50 overflow-hidden">
              {/* Editor / Output Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
                <div className="h-full p-4">
                  <div className="h-full rounded-lg overflow-hidden border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm flex flex-col transition-opacity duration-300">
                    <div className="px-4 py-3 border-b border-border/50 bg-white/60 dark:bg-white/10">
                      <h3 className="font-semibold text-sm">MoveJS Code</h3>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        language="movejs"
                        theme={theme === "dark" ? "vs-dark" : "light"}
                      />
                    </div>
                  </div>
                </div>

                <div className="h-full p-4">
                  <div className="h-full flex flex-col transition-opacity duration-300" style={{ transitionDelay: "0.1s" }}>
                    {/* Tab Headers */}
                    <div className="flex gap-2 mb-2 border-b border-border/50">
                      <TabButton
                        active={outputTab === "compile"}
                        onClick={() => setOutputTab("compile")}
                        label="Output"
                      />
                      <TabButton
                        active={outputTab === "validation"}
                        onClick={() => setOutputTab("validation")}
                        label="Validation"
                      />
                      <TabButton
                        active={outputTab === "gas"}
                        onClick={() => setOutputTab("gas")}
                        label="Gas"
                      />
                      <TabButton
                        active={outputTab === "deploy"}
                        onClick={() => setOutputTab("deploy")}
                        label="Deploy"
                      />
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-hidden">
                      {outputTab === "compile" && (
                        <OutputPanel
                          output={output}
                          error={error}
                          isCompiling={isCompiling}
                          theme={theme}
                        />
                      )}
                      {outputTab === "validation" && (
                        <ValidationPanel
                          content={validationOutput}
                          isLoading={isValidating || isAnalyzing}
                          theme={theme}
                        />
                      )}
                      {outputTab === "gas" && (
                        <GasPanel
                          code={code}
                          theme={theme}
                        />
                      )}
                      {outputTab === "deploy" && (
                        <DeploymentPanel
                          isActive={outputTab === "deploy"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div>
                {/* use StatusBar if needed; kept simple for now */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "text-purple-500 border-b-2 border-purple-500"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}