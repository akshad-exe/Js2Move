import { motion } from "framer-motion";
import { X, File, Folder, ChevronRight, Settings2, Palette, Code2 } from "lucide-react";
import { EXAMPLES } from "./utils/defaultCode";

type SidebarProps = {
    tab: "files" | "settings";
    onClose: () => void;
    onOpenExample?: (code: string) => void;
};

export function Sidebar({ tab, onClose, onOpenExample }: SidebarProps) {
    return (
        <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-72 border-r border-border/50 bg-muted/30 backdrop-blur-xl flex flex-col"
        >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    {tab === "files" ? "Explorer" : "Settings"}
                </h3>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                    <X className="h-4 w-4" />
                </motion.button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-3">
                {tab === "files" ? <FilesTab onOpenExample={onOpenExample} /> : <SettingsTab />}
            </div>
        </motion.div>
    );
}

function FilesTab({ onOpenExample }: { onOpenExample?: (code: string) => void }) {
    const files = [
        { name: "main.movejs", icon: File, active: true },
        { name: "token.movejs", icon: File },
        { name: "utils.movejs", icon: File },
    ];

    const mapFileToExampleKey = (name: string) => {
        if (name.includes("main")) return "counter";
        if (name.includes("token")) return "token";
        if (name.includes("utils")) return "nft";
        return "counter";
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                <ChevronRight className="h-4 w-4" />
                <Folder className="h-4 w-4 text-yellow-500" />
                <span>src</span>
            </div>

            <div className="ml-6 space-y-1">
                {files.map((file) => (
                    <motion.button
                        key={file.name}
                        whileHover={{ x: 4 }}
                        onClick={() => onOpenExample?.(EXAMPLES[mapFileToExampleKey(file.name) as keyof typeof EXAMPLES])}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${file.active
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                : "hover:bg-muted"
                            }`}
                    >
                        <file.icon className="h-4 w-4" />
                        <span className="text-sm font-mono">{file.name}</span>
                    </motion.button>
                ))}
            </div>

            {/* Examples */}
            <div className="mt-3 px-2">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Examples</div>
                <div className="space-y-2">
                    {Object.keys(EXAMPLES).map((key) => (
                        <button
                            key={key}
                            onClick={() => onOpenExample?.(EXAMPLES[key as keyof typeof EXAMPLES])}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-mono"
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SettingsTab() {
    return (
        <div className="space-y-6">
            {/* Editor Settings */}
            <div>
                <div className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-muted-foreground">
                    <Code2 className="h-4 w-4" />
                    Editor
                </div>
                <div className="space-y-3 mt-2">
                    <SettingItem label="Font Size" value="14px" />
                    <SettingItem label="Tab Size" value="2 spaces" />
                    <SettingItem label="Line Numbers" value="On" />
                </div>
            </div>

            {/* Theme Settings */}
            <div>
                <div className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-muted-foreground">
                    <Palette className="h-4 w-4" />
                    Appearance
                </div>
                <div className="space-y-3 mt-2">
                    <SettingItem label="Theme" value="Dark" />
                    <SettingItem label="Syntax" value="MoveJS" />
                </div>
            </div>

            {/* Compiler Settings */}
            <div>
                <div className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-muted-foreground">
                    <Settings2 className="h-4 w-4" />
                    Compiler
                </div>
                <div className="space-y-3 mt-2">
                    <SettingItem label="Target" value="Movement Testnet" />
                    <SettingItem label="Optimization" value="Enabled" />
                </div>
            </div>
        </div>
    );
}

function SettingItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <span className="text-sm">{label}</span>
            <span className="text-sm text-muted-foreground font-mono">{value}</span>
        </div>
    );
}
