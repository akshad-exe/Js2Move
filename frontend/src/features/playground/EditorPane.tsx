import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { movejsLanguageConfig } from "./monaco/movejsLanguage";
import { useEffect, useRef } from "react";

type EditorPaneProps = {
    value: string;
    onChange: (value: string) => void;
};

export function EditorPane({ value, onChange }: EditorPaneProps) {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);

    useEffect(() => {
        // Register custom language when Monaco loads
        if (editorRef.current) {
            const monaco = editorRef.current;
            monaco.languages.register({ id: 'movejs' });
            monaco.languages.setMonarchTokensProvider('movejs', movejsLanguageConfig);
        }
    }, []);

    return (
        <div className="h-full border-r border-border">
            <div className="p-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <h3 className="text-sm font-semibold">Input</h3>
                    <span className="text-xs text-muted-foreground font-mono">main.movejs</span>
                </div>
            </div>
            <Editor
                height="calc(100% - 40px)"
                language="movejs"
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
                value={value}
                onChange={(val) => onChange(val || "")}
                options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                }}
                onMount={(_editor, monaco) => {
                    editorRef.current = monaco;
                }}
            />
        </div>
    );
}
