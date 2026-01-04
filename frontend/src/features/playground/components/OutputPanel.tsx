import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import * as monaco from "monaco-editor";

interface OutputPanelProps {
  output: string;
  error: string;
  isCompiling: boolean;
  theme: string;
}

export default function OutputPanel({ output, error, isCompiling, theme }: OutputPanelProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    const langs = monaco.languages.getLanguages();
    if (!langs.some((l) => l.id === "move")) {
      monaco.languages.register({ id: "move" });

      monaco.languages.setMonarchTokensProvider("move", {
        tokenizer: {
          root: [
            // Keywords
            [
              /\b(module|struct|resource|public|fun|has|key|store|drop|copy|acquires|script|use|const|let|move|abort|return|if|else|while|loop|break|continue|address|signer|u8|u64|u128|u256|bool|vector)\b/,
              "keyword",
            ],

            // Type annotations
            [/:\s*([a-zA-Z_]\w*)/, "type"],

            // Function names
            [/\b([a-zA-Z_]\w*)\s*\(/, "function"],

            // Numbers
            [/\b\d+\b/, "number"],

            // Strings
            [/".*?"/, "string"],
            [/'.*?'/, "string"],

            // Comments
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],

            // Operators
            [/[{}()\[\]]/, "delimiter.bracket"],
            [/[;,.]/, "delimiter"],
            [/[<>]=?|[!=]=|&&|\|\||[+\-*/%&|^]/, "operator"],
          ],

          comment: [[/\*\//, "comment", "@pop"], [/./, "comment"]],
        },
      });
    }

  };

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-white/60 dark:bg-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Compiled Move Code</h3>
        
        {isCompiling && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Compiling...</span>
          </div>
        )}

        {!isCompiling && output && !error && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Success</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs">Error</span>
          </div>
        )}
      </div>

      {/* Output Content */}
      <div className="h-[calc(100%-52px)]">
        {error ? (
          <div className="p-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-600 dark:text-red-400 text-sm font-mono">{error}</p>
            </div>
          </div>
        ) : output ? (
          <Editor
            height="100%"
            defaultLanguage="move"
            language="move"
            value={output}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            onMount={handleEditorDidMount}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace",
              fontLigatures: true,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "all",
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p className="text-sm">Click "Compile" to see the output</p>
          </div>
        )}
      </div>
    </div>
  );
}