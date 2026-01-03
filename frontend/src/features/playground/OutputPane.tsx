import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme/ThemeProvider";

type OutputPaneProps = {
    value: string;
};

export function OutputPane({ value }: OutputPaneProps) {
    const { theme } = useTheme();

    return (
        <div className="h-full">
            <div className="p-3 border-b border-border/50 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-semibold">Output</h3>
                    <span className="text-xs text-muted-foreground font-mono">generated.move</span>
                </div>
            </div>
            <Editor
                height="calc(100% - 40px)"
                language="rust"
                theme={theme === "dark" ? "vs-dark" : "vs-light"}
                value={value}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </div>
    );
}
