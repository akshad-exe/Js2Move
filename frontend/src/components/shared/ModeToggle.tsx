import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { motion } from "framer-motion";

export function ModeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="relative p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                    <Moon className="h-4 w-4 text-blue-400" />
                )}
            </motion.div>
        </motion.button>
    );
}
