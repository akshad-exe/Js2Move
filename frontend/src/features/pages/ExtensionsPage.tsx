import { motion } from "framer-motion";
import { Code2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import LightRays from "@/components/effects/LightRays";

export function ExtensionsPage() {
    return (
        <div className="min-h-screen text-foreground overflow-x-hidden relative flex flex-col">
            {/* Cinematic Background Layer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black" />
                <GravityStars starsCount={200} starsSize={2} movementSpeed={20} mouseInfluence={200} gravityStrength={300} />
                <div className="absolute inset-0 z-0">
                    <LightRays raysOrigin="center" raysColor="#ffffff" raysSpeed={0.5} lightSpread={1} rayLength={2} fadeDistance={4} />
                </div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
            </div>

            <Navbar />

            <div className="flex-1 flex items-center justify-center relative z-10 pt-20 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-pink-300 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative p-12 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden">
                            {/* Abstract background blobus */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/10 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-500/10 rounded-full blur-[80px] pointer-events-none -ml-16 -mb-16"></div>

                            {/* Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-500/20 to-gray-500/20 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-white/5">
                                <Code2 className="w-10 h-10 text-white" />
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                MoveJS for VS Code
                            </h1>

                            <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                                We are putting the finishing touches on the official extension. IntelliSense, Syntax Highlighting, and Debugging support are coming your way.
                            </p>

                            <div className="flex justify-center">
                                <Link
                                    to="/waitlist"
                                    className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-all shadow-xl shadow-white/5 flex items-center gap-2 group/btn"
                                >
                                    Join the Waitlist
                                    <Zap className="w-4 h-4 text-purple-600 group-hover:btn:scale-110 transition-transform" />
                                </Link>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                                In Development
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
