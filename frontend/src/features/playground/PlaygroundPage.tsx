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
  const { signTransaction } = useAptosWallet();
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

    try {
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
      
      try {
        console.log('Raw compile result:', compileResult);
        console.log('Compile result success:', compileResult.success);
        console.log('Unsigned transaction exists:', !!compileResult.unsignedTransaction);
        console.log('Unsigned transaction type:', typeof compileResult.unsignedTransaction);
        
        if (!compileResult.unsignedTransaction) {
          throw new Error('No unsigned transaction received from server');
        }
        
        // Check if wallet is available and connected
        if (!signTransaction) {
          throw new Error('Wallet signing not available. Please connect your wallet.');
        }
        
        if (!isConnected) {
          throw new Error('Wallet is not connected. Please connect your wallet first.');
        }
        
        console.log('Wallet connected:', isConnected);
        console.log('Sign function available:', !!signTransaction);
        
        // Reconstruct BigInts from strings if needed
        const reconstructedTransaction = JSON.parse(JSON.stringify(compileResult.unsignedTransaction, (key, value) => {
          // Convert string numbers that look like BigInts back to BigInts
          if (typeof value === 'string') {
            // Check if it's a numeric string that should be a BigInt
            if (/^\d+$/.test(value)) {
              // If it's longer than 15 digits, it's likely a BigInt
              if (value.length > 15) {
                try {
                  return BigInt(value);
                } catch (e) {
                  console.warn('Failed to convert to BigInt:', value, e);
                  return value;
                }
              }
              // If it's a reasonable number, convert to number
              else if (value.length <= 15) {
                return parseInt(value);
              }
            }
          }
          return value;
        }));
        
        // Try signing the raw transaction from the server (no reconstruction)
        console.log('Attempting to sign raw transaction from server...');
        
        // Try signing with timeout
        const signPromise = signTransaction(compileResult.unsignedTransaction);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Wallet signing timeout')), 30000)
        );
        
        signedTransaction = await Promise.race([signPromise, timeoutPromise]);
        console.log('Signed transaction:', signedTransaction);
      } catch (signError) {
        console.error('Wallet signing error:', signError);
        toast.error(`Wallet signing failed: ${signError?.message || 'Please check your wallet connection'}`, { id: 'deploy' });
        return;
      }

      // Step 3: Submit the signed transaction
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
    } catch (err) {
      console.error('Deployment error:', err);
      toast.error(`Deployment failed: ${err.message || 'Unknown error'}`, { id: 'deploy' });
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

