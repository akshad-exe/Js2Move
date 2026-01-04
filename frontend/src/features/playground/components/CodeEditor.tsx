import { useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme: string;
}

export default function CodeEditor({ value, onChange, language, theme }: CodeEditorProps) {
  const editorRef = useRef<any>(undefined);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    if (!monaco) return;

    // Only register language if it's not already registered
    const langs = monaco.languages.getLanguages();
    if (!langs.some((l: { id?: string }) => l.id === "movejs")) {
      monaco.languages.register({ id: "movejs" });

      monaco.languages.setMonarchTokensProvider("movejs", {
        tokenizer: {
          root: [
            // Keywords
            [
              /\b(module|resource|public|fun|return|let|mut|move|copy|struct|address|signer|u8|u64|u128|bool)\b/,
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
            [/[<>]=?|[!=]=|&&|\|\||[+\-*/%]/, "operator"],
          ],

          comment: [[/\*\//, "comment", "@pop"], [/./, "comment"]],
        },
      });
    }

  };

  // Map incoming theme string to default Monaco themes (keep background consistent)
  const mappedTheme = (theme || "").toString().toLowerCase().includes("dark")
    ? "vs-dark"
    : "vs";

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={onChange}
      theme={mappedTheme}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily:
          "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace",
        fontLigatures: true,
        lineNumbers: "on",
        roundedSelection: true,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        padding: { top: 16, bottom: 16 },
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: "on",
        smoothScrolling: true,
        renderLineHighlight: "all",
        bracketPairColorization: {
          enabled: true,
        },
      }}
    />
  );
}