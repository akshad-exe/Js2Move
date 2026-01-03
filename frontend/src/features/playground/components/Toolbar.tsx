import { Play, RotateCcw, Download, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface ToolbarProps {
  onCompile: () => void;
  onReset: () => void;
  onDownload: () => void;
  isCompiling: boolean;
  onToggleSidebar?: () => void;
}

export default function Toolbar({ onCompile, onReset, onDownload, isCompiling, onToggleSidebar }: ToolbarProps) {
  return (
    <div className="border-b border-border/50 bg-white/60 dark:bg-white/10 backdrop-blur-sm px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>

          <h2 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              MoveJS
            </span>{" "}
            Playground
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <ToolbarButton
            onClick={onCompile}
            disabled={isCompiling}
            icon={<Play className="w-4 h-4" />}
            label={isCompiling ? "Compiling..." : "Compile"}
            variant="primary"
          />

          <ToolbarButton
            onClick={onReset}
            icon={<RotateCcw className="w-4 h-4" />}
            label="Reset"
          />

          <ToolbarButton
            onClick={onDownload}
            icon={<Download className="w-4 h-4" />}
            label="Download"
          />

          <div className="h-6 w-px bg-border/50 mx-2" />

          <ToolbarButton
            onClick={() => {}}
            icon={<Settings className="w-4 h-4" />}
            label=""
          />
        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary";
}

function ToolbarButton({ onClick, disabled, icon, label, variant = "secondary" }: ToolbarButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
        ${isPrimary
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
          : "bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-border/50"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {icon}
      {label && <span>{label}</span>}
    </motion.button>
  );
}