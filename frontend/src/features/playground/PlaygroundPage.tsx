import { useState } from "react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/shared/Navbar";
import { useTheme } from "@/lib/theme/ThemeProvider";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import Toolbar from "./components/Toolbar";
import GasPanel from "./components/GasPanel";
import ValidationPanel from "./components/ValidationPanel";
import { Sidebar } from "./Sidebar";
import { DEFAULT_MOVEJS_CODE } from "./utils/defaultCode";
import { useCompiler } from "@/hooks";

type OutputTab = "compile" | "validation" | "gas";

export function PlaygroundPage() {
  const { theme } = useTheme();
  const [code, setCode] = useState(DEFAULT_MOVEJS_CODE);
  const [outputTab, setOutputTab] = useState<OutputTab>("compile");
  const { compile, isCompiling, output, error, setOutput, setError, validate, isValidating, analyze, isAnalyzing } = useCompiler();
  const [validationOutput, setValidationOutput] = useState("");

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
            onReset={handleReset}
            onDownload={handleDownload}
            isCompiling={isCompiling}
            isValidating={isValidating}
            isAnalyzing={isAnalyzing}
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

