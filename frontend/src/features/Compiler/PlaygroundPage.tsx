import { useState } from "react";
import { motion } from "framer-motion";
import { GravityStars } from "@/components/effects/GravityStars";
import { Navbar } from "@/components/shared/Navbar";
import { useTheme } from "@/lib/theme/ThemeProvider";
import CodeEditor from "./components/CodeEditor";
import OutputPanel from "./components/OutputPanel";
import Toolbar from "./components/Toolbar";
import { Sidebar } from "./Sidebar";
import { DEFAULT_MOVEJS_CODE } from "./utils/defaultCode";

export function PlaygroundPage() {
  const { theme } = useTheme();
  const [code, setCode] = useState(DEFAULT_MOVEJS_CODE);
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState("");

  const handleCompile = async () => {
    setIsCompiling(true);
    setError("");

    try {
      // TODO: Replace with actual MoveJS compiler API call
      setTimeout(() => {
        setOutput(`// Compiled Move Code\nmodule counter {\n  struct Counter has key {\n    value: u64\n  }\n}`);
        setIsCompiling(false);
      }, 1000);
    } catch (err) {
      setError("Compilation failed");
      setIsCompiling(false);
    }
  };

  const handleReset = () => {
    setCode(DEFAULT_MOVEJS_CODE);
    setOutput("");
    setError("");
  };

  const handleDownload = () => {
    const blob = new Blob([output || code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.move";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <>
      <GravityStars
        starsCount={80}
        starsSize={2.5}
        movementSpeed={0.8}
        mouseInfluence={120}
        gravityStrength={85}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <div className="h-screen flex flex-col" style={{ paddingTop: "4rem" }}>
          {/* Toolbar */}
          <Toolbar
            onCompile={handleCompile}
            onReset={handleReset}
            onDownload={handleDownload}
            isCompiling={isCompiling}
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
                  }}
                />
              </div>
            )}

            {/* Main editor */}
            <div className="flex-1 min-h-[60vh] flex flex-col rounded-2xl border border-border/50 overflow-hidden">
              {/* Editor / Output Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
                <div className="h-full p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full rounded-lg overflow-hidden border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm"
                  >
                    <div className="px-4 py-3 border-b border-border/50 bg-white/60 dark:bg-white/10">
                      <h3 className="font-semibold text-sm">MoveJS Code</h3>
                    </div>
                    <CodeEditor
                      value={code}
                      onChange={(value) => setCode(value || "")}
                      language="movejs"
                      theme={theme === "dark" ? "vs-dark" : "light"}
                    />
                  </motion.div>
                </div>

                <div className="h-full p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="h-full"
                  >
                    <OutputPanel
                      output={output}
                      error={error}
                      isCompiling={isCompiling}
                      theme={theme}
                    />
                  </motion.div>
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

