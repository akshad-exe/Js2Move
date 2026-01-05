import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useRef } from "react";

interface ValidationPanelProps {
  content: string;
  isLoading: boolean;
  theme: string;
}

export default function ValidationPanel({ content, isLoading, theme }: ValidationPanelProps) {
  const editorRef = useRef<any>(undefined);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const hasErrors = content.includes("error") || content.includes("Error");

  return (
    <div className="h-full rounded-lg overflow-hidden border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 bg-white/60 dark:bg-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Validation & Analysis Results</h3>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Processing...</span>
          </div>
        )}

        {!isLoading && content && !hasErrors && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs">Valid</span>
          </div>
        )}

        {!isLoading && hasErrors && (
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">Issues Found</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
              <p className="text-sm text-muted-foreground">Processing your code...</p>
            </div>
          </div>
        ) : content ? (
          <Editor
            onMount={handleEditorDidMount}
            value={content}
            language="json"
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Run validation or analysis to see results</p>
          </div>
        )}
      </div>
    </div>
  );
}
