import { motion, AnimatePresence } from "framer-motion";
import {
    Github,
    Coins,
    Image as ImageIcon,
    Gamepad2,
    Code2,
    Rocket,
    ExternalLink,
    Layers,
    BookOpen,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import LightRays from "@/components/effects/LightRays";
import { TemplatesPanel } from "../../components/TemplatesPanel";
import { ExamplesPanel } from "../../components/ExamplesPanel";

// Thumbnails (using generated assets)
const defiThumb = "/defi_starter_thumbnail_1767290305629.png";
const nftThumb = "/nft_starter_thumbnail_1767290326947.png";
const gameThumb = "/gaming_starter_thumbnail_1767290342897.png";

const starters = [
    {
        icon: Coins,
        name: "DeFi Protocol",
        desc: "Professional-grade fungible token implementation with Advanced vaults, staking logic, and liquidity pools.",
        tech: ["MoveJS", "Movement SDK", "Tailwind"],
        github: "https://github.com/movejs/starter-defi",
        image: defiThumb,
        difficulty: "Advanced"
    },
    {
        icon: ImageIcon,
        name: "NFT Ecosystem",
        desc: "Complete digital assets suite with dynamic metadata, collection management, and royalty enforcement.",
        tech: ["MoveJS", "IPFS Storage", "Next.js"],
        github: "https://github.com/movejs/starter-nft",
        image: nftThumb,
        difficulty: "Intermediate"
    },
    {
        icon: Gamepad2,
        name: "Gaming Engine",
        desc: "High-performance on-chain game state engine with character progression and inventory systems.",
        tech: ["MoveJS", "Movement", "Unity/Web"],
        github: "https://github.com/movejs/starter-game",
        image: gameThumb,
        difficulty: "Pro"
    }
];

export function ResourcesPage() {
    const [activeTab, setActiveTab] = useState<'starters' | 'templates' | 'examples'>('starters');

    return (
        <div className="min-h-screen text-foreground overflow-x-hidden relative">
            {/* Background Layering */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                <div className="absolute inset-0 bg-black" />
                <GravityStars starsCount={120} starsSize={5} movementSpeed={10} mouseInfluence={100} gravityStrength={90} />
                <div className="absolute inset-0" style={{ zIndex: 1 }}>
                    <LightRays raysOrigin="top-center" raysColor="#e0e7ff" raysSpeed={1.5} lightSpread={0.8} rayLength={1.5} followMouse={true} mouseInfluence={0.2} noiseAmount={0.01} fadeDistance={2} saturation={0.8} />
                </div>
                <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" style={{ zIndex: 3 }} />
            </div>

            <Navbar />

            <div className="min-h-screen text-white pt-40 pb-32 relative z-10">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Cinematic Hero Section */}
                    <div className="relative mb-32 text-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 space-y-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl"
                            >
                                <Layers className="w-3.5 h-3.5" />
                                Official Ecosystem Library
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                                Developer <br />
                                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent italic pr-4">Library</span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                                Accelerate your MoveJS development with production-ready starter kits, audited smart contract Templates, and modular blueprints.
                            </p>
                        </motion.div>
                    </div>

                    {/* Floating Navigation Tabs */}
                    <div className="flex justify-center mb-24 sticky top-28 z-50">
                        <div className="bg-gray-950/80 backdrop-blur-2xl p-1.5 rounded-[24px] border border-white/10 flex gap-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                            <button
                                onClick={() => setActiveTab('starters')}
                                className={`px-8 py-3.5 rounded-[20px] flex items-center gap-3 font-bold transition-all duration-300 relative ${activeTab === 'starters'
                                    ? 'text-white shadow-lg bg-gradient-to-br from-purple-600 to-indigo-600'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <Rocket className={`w-4 h-4 ${activeTab === 'starters' ? 'text-white' : 'text-gray-500'}`} />
                                <span className="text-xs uppercase tracking-widest">Starter Kits</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`px-8 py-3.5 rounded-[20px] flex items-center gap-3 font-bold transition-all duration-300 relative ${activeTab === 'templates'
                                    ? 'text-white shadow-lg bg-gradient-to-br from-blue-600 to-cyan-600'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <Code2 className={`w-4 h-4 ${activeTab === 'templates' ? 'text-white' : 'text-gray-500'}`} />
                                <span className="text-xs uppercase tracking-widest">Templates</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('examples')}
                                className={`px-8 py-3.5 rounded-[20px] flex items-center gap-3 font-bold transition-all duration-300 relative ${activeTab === 'examples'
                                    ? 'text-white shadow-lg bg-gradient-to-br from-emerald-600 to-teal-600'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <BookOpen className={`w-4 h-4 ${activeTab === 'examples' ? 'text-white' : 'text-gray-500'}`} />
                                <span className="text-xs uppercase tracking-widest">Examples</span>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'starters' ? (
                            <motion.div
                                key="starters"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                {starters.map((kit, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group h-full bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden hover:border-purple-500/30 transition-all duration-500 flex flex-col shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)] hover:shadow-purple-500/10"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 opacity-60" />
                                            <img
                                                src={kit.image}
                                                alt={kit.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />

                                            {/* Floating Badge */}
                                            <div className="absolute top-6 left-6 z-20">
                                                <span className={`px-4 py-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2 text-[9px] font-black tracking-[0.2em] uppercase shadow-lg ${kit.difficulty === 'Pro'
                                                    ? 'bg-red-500/20 border-red-500/30 text-red-400'
                                                    : kit.difficulty === 'Advanced'
                                                        ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                                                        : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${kit.difficulty === 'Pro' ? 'bg-red-500' : kit.difficulty === 'Advanced' ? 'bg-orange-500' : 'bg-emerald-500'
                                                        }`} />
                                                    {kit.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 lg:p-10 flex-1 flex flex-col relative">
                                            {/* Icon Floating overlap */}
                                            <div className="absolute -top-10 right-10 z-20">
                                                <div className="w-20 h-20 rounded-3xl bg-gray-900 border border-white/10 flex items-center justify-center shadow-xl group-hover:-translate-y-2 transition-transform duration-300">
                                                    <kit.icon className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                                                </div>
                                            </div>

                                            <div className="mt-4 mb-6">
                                                <h3 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-purple-400 transition-colors">{kit.name}</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed font-light">{kit.desc}</p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                                {kit.tech.map(t => (
                                                    <span key={t} className="px-3 py-1.5 bg-white/[0.03] text-[9px] font-bold text-gray-500 rounded-lg border border-white/5 uppercase tracking-wide group-hover:border-white/10 transition-colors">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                <a
                                                    href={kit.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em] group/link hover:text-purple-400 transition-colors"
                                                >
                                                    <Github className="w-4 h-4" />
                                                    Get Code
                                                </a>
                                                <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-purple-600 transition-all flex items-center justify-center text-white/50 hover:text-white">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : activeTab === 'templates' ? (
                            <motion.div
                                key="templates"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                            >
                                <TemplatesPanel 
                                    onCopyCode={(code) => {
                                        navigator.clipboard.writeText(code);
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="examples"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <ExamplesPanel 
                                    onCopyCode={(code) => {
                                        navigator.clipboard.writeText(code);
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}
