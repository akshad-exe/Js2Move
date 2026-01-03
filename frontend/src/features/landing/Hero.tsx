import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import LightRays from "@/components/effects/LightRays";
import { GravityStars } from "@/components/effects/GravityStars";
import { CodePreview } from "./CodePreview";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex items-center">
      {/* Layer 0: GravityStars (behind everything) */}
      <GravityStars
        starsCount={80}
        starsSize={2.5}
        movementSpeed={0.8}
        mouseInfluence={120}
        gravityStrength={85}
      />

      {/* Layer 1: LightRays */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#e0e7ff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.01}
          fadeDistance={2}
          saturation={0.8}
        />
      </div>

      {/* Layer 2: Overlay */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />

      {/* Layer 3: Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent dark:to-black/40"
        style={{ zIndex: 3 }}
      />

      {/* Layer 4: Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background"
        style={{ zIndex: 4 }}
      />

      {/* Layer 10: Content (on top) */}
      <div className="container mx-auto px-4 py-20 relative" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 dark:bg-white/5 backdrop-blur-xl border border-purple-500/20 dark:border-white/10">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-foreground">
                Powered by Movement Network
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Write in{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent">
              JavaScript-style
            </span>
            <br />
            Deploy to{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              Move
            </span>

          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed"
          >
            MoveJS is a DSL + source-to-source compiler that generates secure Move smart contracts.
            <br />
            <span className="font-semibold text-purple-600 dark:text-purple-400">No Rust required</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link to="/playground">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-base text-white flex items-center gap-3 overflow-hidden shadow-xl shadow-purple-500/30"
              >
                <span className="relative z-10">Open Playground</span>
                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-3 border-2 border-purple-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 transition-colors backdrop-blur-xl"
            >
              <Code2 className="h-4 w-4" />
              View Docs
            </motion.button>
          </motion.div>

          {/* Code Preview */}
          <CodePreview />
        </motion.div>
      </div>
    </section>
  );
}
