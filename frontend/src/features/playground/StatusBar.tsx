import { CheckCircle2, Loader2, Code, FileCode } from "lucide-react";

type StatusBarProps = {
    isCompiling: boolean;
    linesOfCode: number;
};

export function StatusBar({ isCompiling, linesOfCode }: StatusBarProps) {
    return (
        <div className="h-8 border-t border-border/50 backdrop-blur-xl bg-muted/30 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    {isCompiling ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-yellow-500" />
                            <span className="text-yellow-500 font-medium">Compiling...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-green-500 font-medium">Ready</span>
                        </>
                    )}
                </div>

                {/* Lines of Code */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Code className="h-3.5 w-3.5" />
                    <span>{linesOfCode} lines</span>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileCode className="h-3.5 w-3.5" />
                    <span>MoveJS</span>
                </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
                <span>UTF-8</span>
                <span>LF</span>
                <span>Spaces: 2</span>
            </div>
        </div>
    );
}
