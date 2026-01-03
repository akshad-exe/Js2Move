import { motion } from "framer-motion";
import { TextType } from "@/components/effects/TextType";

const moveJsCode = `contract Token {
  resource Balance;
  
  transfer(from, to, amt) {
    Balance[from] -= amt;
    Balance[to] += amt;
  }
}`;

const moveCode = `module 0x1::Token {
  struct Balance has key {
    value: u64
  }
  
  public entry fun transfer(...) {
    // Secure Move code
  }
}`;

export function CodePreview() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-16"
        >
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Input Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border-2 border-purple-200 dark:border-white/10 rounded-2xl p-6 text-left shadow-2xl"
                >
                    <div className="text-sm font-mono text-purple-600 dark:text-purple-400 mb-3 font-semibold">
                        Input.movejs
                    </div>
                    <pre className="text-sm font-mono text-foreground/90 leading-relaxed min-h-[180px]">
                        <TextType
                            text={moveJsCode}
                            typingSpeed={30}
                            pauseDuration={3000}
                            loop={true}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                    </pre>
                </motion.div>

                {/* Output Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border-2 border-blue-200 dark:border-white/10 rounded-2xl p-6 text-left shadow-2xl"
                >
                    <div className="text-sm font-mono text-blue-600 dark:text-blue-400 mb-3 font-semibold">
                        Output.move
                    </div>
                    <pre className="text-sm font-mono text-foreground/90 leading-relaxed min-h-[180px]">
                        <TextType
                            text={moveCode}
                            typingSpeed={30}
                            pauseDuration={3000}
                            loop={true}
                            showCursor={true}
                            cursorCharacter="|"
                        />
                    </pre>
                </motion.div>
            </div>
        </motion.div>
    );
}
