import { motion } from "framer-motion";
import { Code2, Zap, Shield, Layers, Terminal, Sparkles } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "JavaScript-Style Syntax",
    description: "Write Move smart contracts with familiar JS syntax. No need to learn Rust or complex Move semantics.",
    iconColor: "text-purple-500 dark:text-purple-400",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    bottomGradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Compile in Seconds",
    description: "Lightning-fast source-to-source compilation. Get production-ready Move code instantly.",
    iconColor: "text-blue-500 dark:text-blue-400",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    bottomGradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Built-in Safety",
    description: "Semantic analyzer enforces Move's ownership model, prevents resource copying at compile-time.",
    iconColor: "text-green-500 dark:text-green-400",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    bottomGradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Layers,
    title: "Resource-Oriented",
    description: "First-class support for Move resources. Linear types and ownership without the complexity.",
    iconColor: "text-orange-500 dark:text-orange-400",
    bgGradient: "from-orange-500/10 to-red-500/10",
    bottomGradient: "from-orange-500 to-red-500",
  },
  {
    icon: Terminal,
    title: "Complete CLI Toolkit",
    description: "Full workflow: compile, test, deploy. Integrated with Movement Network for seamless deployment.",
    iconColor: "text-indigo-500 dark:text-indigo-400",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    bottomGradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Sparkles,
    title: "Editor Support",
    description: "Syntax highlighting, auto-completion, and inline error checking for VS Code and popular editors.",
    iconColor: "text-pink-500 dark:text-pink-400",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    bottomGradient: "from-pink-500 to-rose-500",
  },
];

export function FeatureGrid() {
  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            MoveJS
          </span>
          ?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Build Move smart contracts faster with familiar JavaScript syntax and powerful tooling
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="relative h-full p-6 rounded-2xl border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-border transition-all duration-300 overflow-hidden">
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon - Simple colored */}
                <feature.icon 
                  className={`w-10 h-10 mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  strokeWidth={1.5}
                />

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Bottom gradient line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.bottomGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
