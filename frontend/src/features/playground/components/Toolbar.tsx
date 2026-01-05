import { Play, RotateCcw, Download, CheckSquare, Zap, Fuel } from "lucide-react";
import { motion } from "framer-motion";

interface ToolbarProps {
  onCompile: () => void;
  onValidate: () => void;
  onAnalyze: () => void;
  onEstimateGas: () => void;
  onReset: () => void;
  onDownload: () => void;
  isCompiling: boolean;
  isValidating: boolean;
  isAnalyzing: boolean;
  onToggleSidebar?: () => void;
}

export default function Toolbar({ 
  onCompile, 
  onValidate, 
  onAnalyze, 
  onEstimateGas, 
  onReset, 
  onDownload, 
  isCompiling, 
  isValidating, 
  isAnalyzing, 
  onToggleSidebar 
}: ToolbarProps) {
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

        <div className="flex items-center gap-2 flex-wrap">
          <ToolbarButton
            onClick={onCompile}
            disabled={isCompiling}
            icon={<Play className="w-4 h-4" />}
            label={isCompiling ? "Compiling..." : "Compile"}
            variant="primary"
            title="Compile MoveJS code"
          />

          <ToolbarButton
            onClick={onValidate}
            disabled={isValidating}
            icon={<CheckSquare className="w-4 h-4" />}
            label={isValidating ? "Validating..." : "Validate"}
            title="Validate code syntax"
          />

          <ToolbarButton
            onClick={onAnalyze}
            disabled={isAnalyzing}
            icon={<Zap className="w-4 h-4" />}
            label={isAnalyzing ? "Analyzing..." : "Analyze"}
            title="Analyze code structure"
          />

          <ToolbarButton
            onClick={onEstimateGas}
            icon={<Fuel className="w-4 h-4" />}
            label="Gas"
            title="Estimate gas costs"
          />

          <div className="h-6 w-px bg-border/50 mx-1" />

          <ToolbarButton
            onClick={onReset}
            icon={<RotateCcw className="w-4 h-4" />}
            label="Reset"
            title="Reset to default code"
          />

          <ToolbarButton
            onClick={onDownload}
            icon={<Download className="w-4 h-4" />}
            label="Download"
            title="Download compiled code"
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
  title?: string;
}

function ToolbarButton({ onClick, disabled, icon, label, variant = "secondary", title }: ToolbarButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap
        ${isPrimary
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
          : "bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-border/50"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {icon}
      {label && <span className="text-xs md:text-sm">{label}</span>}
    </motion.button>
  );
}