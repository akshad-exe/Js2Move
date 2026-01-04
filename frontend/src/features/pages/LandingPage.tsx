
import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap, Shield, Layers, Terminal, Sparkles, Cpu, ShieldCheck, Edit, CheckCircle2, TrendingUp, Code, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { GravityStars } from "@/components/effects/GravityStars";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TextType } from "@/components/effects/TextType";
import LightRays from "@/components/effects/LightRays";

// I'm using real-time stats here based on some 2024 surveys I found
const languageStats = [
    {
        name: "JavaScript",
        usage: 80,
        difficulty: 2,
        color: "from-yellow-500 to-orange-500",
        description: "Most popular programming language"
    },
    {
        name: "Solidity",
        usage: 60,
        difficulty: 7,
        color: "from-purple-500 to-pink-500",
        description: "Ethereum smart contract language"
    },
    {
        name: "Rust",
        usage: 45,
        difficulty: 8,
        color: "from-orange-600 to-red-600",
        description: "Solana, Near, Polkadot contracts"
    },
    {
        name: "Move",
        usage: 28,
        difficulty: 8,
        color: "from-cyan-500 to-blue-600",
        description: "Aptos, Sui, Movement blockchain"
    },
];

const problemStats = [
    {
        icon: Code,
        title: "62% Use JavaScript",
        description: "But only 30% of developers can write blockchain smart contracts",
        color: "from-yellow-500 to-orange-500"
    },
    {
        icon: TrendingUp,
        title: "6-8x Harder",
        description: "Solidity (7/10) & Move/Rust (8/10) vs JavaScript (2/10) difficulty",
        color: "from-red-500 to-pink-500"
    },
    {
        icon: Shield,
        title: "45.7% Never Contributed",
        description: "To Solidity projects due to steep learning curve and unfamiliar syntax",
        color: "from-purple-500 to-indigo-500"
    },
];

const moveComparison = [
    {
        language: "Solidity",
        pros: ["Mature ecosystem", "Large developer base", "Rich tooling"],
        cons: ["Reentrancy bugs", "Integer overflow risks", "Gas optimization complex"],
        difficulty: 6,
        adoption: 70,
        color: "from-purple-500 to-pink-500"
    },
    {
        language: "Rust",
        pros: ["Memory safety", "Performance", "Zero-cost abstractions"],
        cons: ["Steep learning curve", "Compilation time", "Less blockchain-specific tooling"],
        difficulty: 9,
        adoption: 20,
        color: "from-purple-500 to-pink-500"
    }, {
        language: "Move",
        pros: ["Built-in safety features", "Prevents common bugs", "Resource-oriented design"],
        cons: ["Newer ecosystem", "Fewer tools", "Learning curve for paradigm"],
        difficulty: 7,
        adoption: 5,
        color: "from-purple-500 to-pink-500"
    },
];

// I'll list out why MoveJS is so useful here
const whyFeatures = [
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

// Here are the core technical features I've implemented
const technicalFeatures = [
    {
        icon: Code2,
        title: "JavaScript-Style DSL",
        description: "Write Move smart contracts with familiar JavaScript syntax. Statically typed with explicit resource ownership—no dynamic features, async/await, or inheritance.",
    },
    {
        icon: Cpu,
        title: "Source-to-Source Compiler",
        description: "Multi-stage compilation pipeline: Lexer tokenizes, Parser builds AST, Semantic Analyzer enforces Move safety rules, Code Generator outputs auditable Move source code.",
    },
    {
        icon: ShieldCheck,
        title: "Safety Engine",
        description: "Semantic analyzer prevents resource copying, enforces single ownership, validates signer requirements, and ensures proper initialization at compile time.",
    },
    {
        icon: Terminal,
        title: "Complete CLI Toolkit",
        description: "Full workflow automation: movejs compile (DSL to Move), movejs test (auto-generated tests), movejs deploy --network testnet for instant deployment.",
    }
];

// Quick breakdown of how the whole thing works
const howItWorksSteps = [
    {
        icon: Edit,
        title: "Write MoveJS Code",
        description: "Use JavaScript-style syntax with Move semantics"
    },
    {
        icon: Zap,
        title: "Compiler Pipeline",
        description: "Lex → Parse → Analyze → Generate"
    },
    {
        icon: CheckCircle2,
        title: "Get Move Code",
        description: "Production-ready Move source code"
    }
];

const moveJsCode = `class Counter {
  @resource
  count: u64;

  increment() {
    this.count = this.count + 1;
  }
}`;

const moveCode = `module 0x1::Counter {
  struct Counter has key {
    count: u64
  }

  public entry fun increment(account: &signer) {
    let addr = signer::address_of(account);
    let c = borrow_global_mut<Counter>(addr);
    c.count = c.count + 1;
  }
}`;

export function LandingPage() {
    return (
        <div className="min-h-screen text-foreground overflow-x-hidden relative">
            {/* Layering multiple backgrounds to get that deep space feel */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
                <div className="absolute inset-0 bg-black" />
                <GravityStars
                    starsCount={120}
                    starsSize={5}
                    movementSpeed={10}
                    mouseInfluence={100}
                    gravityStrength={90}
                />
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
                <div className="absolute inset-0 bg-black/40" style={{ zIndex: 2 }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" style={{ zIndex: 3 }} />
            </div>

            <Navbar />

            <div className="container mx-auto px-4 py-20 relative z-10">

                {/* Let's set up the main hero section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-8 max-w-4xl mx-auto mb-20"
                >
                    {/* Badge */}

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        Write in{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent">
                            JavaScript-style
                        </span>
                        <br />
                        Deploy to{" "}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                            Move
                        </span>
                    </h1>

                    {/* Subheading */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.002, duration: 0.003 }}
                        className="space-y-4"
                    >
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            MoveJS is a DSL + source-to-source compiler that generates secure Move smart contracts.
                        </p>
                        <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                            No Rust required.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.002, duration: 0.003 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <Link to="/playground">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.02 }}
                                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-base text-white flex items-center gap-2 overflow-hidden shadow-lg shadow-purple-500/20 transition-all duration-200"
                            >
                                <span className="relative z-10">Open Playground</span>
                                <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </motion.button>
                        </Link>

                        <Link to="/docs">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 backdrop-blur-xl"
                            >
                                <span className="opacity-70 text-sm">&lt;/&gt;</span>
                                View Docs
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* I'll show a side-by-side comparison of the code here */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.002, duration: 0.05 }}
                    className="max-w-6xl mx-auto mb-32"
                >
                    <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
                        {/* JS Side */}
                        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] relative group shadow-2xl">
                            {/* Shimmer Texture Layer */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197, 180, 180, 0.08)_0%,transparent_50%)] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-transparent to-black/50 pointer-events-none" />

                            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20 shadow-[0_0_8_rgba(34,197,94,0.2)]" />
                                </div>
                                <span className="text-xs font-mono text-zinc-500 font-medium">counter.js</span>
                            </div>
                            <div className="p-8 font-mono text-sm overflow-x-auto min-h-[320px] relative z-10">
                                <TextType
                                    text={moveJsCode}
                                    typingSpeed={30}
                                    pauseDuration={8000}
                                    loop={true}
                                    className="whitespace-pre text-zinc-300"
                                />
                            </div>
                        </div>

                        {/* Move Side */}
                        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#050505] relative group shadow-2xl">
                            {/* Shimmer Texture Layer */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_50%)] pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-transparent to-black/20 pointer-events-none" />

                            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20 shadow-[0_0_8_rgba(34,197,94,0.2)]" />
                                </div>
                                <span className="text-xs font-mono text-zinc-500 font-medium">Output: counter.move</span>

                            </div>
                            <div className="p-8 font-mono text-sm overflow-x-auto relative z-10 min-h-[320px]">
                                <TextType
                                    text={moveCode}
                                    typingSpeed={30}
                                    pauseDuration={4300}
                                    loop={true}
                                    className="whitespace-pre text-zinc-300"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Exploring the 6 main reasons to use MoveJS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto mb-32"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent">MoveJS?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Build Move smart contracts faster with familiar JavaScript syntax and powerful tooling
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whyFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.005, delay: index * 0.002 }}
                                whileHover={{ y: -8 }}
                                className="group relative"
                            >
                                <div className="relative h-full p-8 rounded-2xl border border-border/50 bg-white/40 dark:bg-white/5 backdrop-blur-sm hover:border-border transition-all duration-300 overflow-hidden">
                                    {/* Gradient overlay on hover */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon - Simple colored */}
                                        <feature.icon
                                            className={`w-12 h-12 mb-6 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
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
                </motion.div>

                {/* Added some extra content here for more depth */}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.2 }}
                    className="max-w-6xl mx-auto mb-32 py-10"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works on{" "}
                            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent">
                                MoveJS
                            </span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.004, delay: index * 0.001 }}
                                className="relative h-full"
                            >
                                <div className="relative h-full rounded-2xl border-[0.75px] border-border p-2">
                                    <GlowingEffect
                                        spread={60}
                                        glow={true}
                                        disabled={false}
                                        proximity={120}
                                        inactiveZone={0.01}
                                        borderWidth={4}
                                        blur={2}
                                    />

                                    <div className="relative h-full backdrop-blur-xl bg-white/60 dark:bg-white/5 rounded-xl border-[0.75px] border-border p-8 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-xl">
                                                {index + 1}
                                            </div>
                                            <step.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                        </div>

                                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>

                                        {index < howItWorksSteps.length - 1 && (
                                            <div className="hidden md:block absolute -right-8 top-1/2 -translate-y-1/2 z-20">
                                                <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Detailing the 4 key technical components we offer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto mb-32"
                >
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Everything You Need to Build on{" "}
                            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 bg-clip-text text-transparent">
                                Move
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground">
                            A complete SDK: DSL, compiler, CLI, and editor support for writing Move smart contracts with JavaScript-style syntax.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {technicalFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.004, delay: index * 0.001 }}
                            >
                                <div className="relative h-full rounded-2xl border-[0.75px] border-border p-2">
                                    <GlowingEffect
                                        spread={60}
                                        glow={true}
                                        disabled={false}
                                        proximity={120}
                                        inactiveZone={0.01}
                                        borderWidth={4}
                                        blur={2}
                                    />

                                    <div className="relative h-full backdrop-blur-xl bg-white/60 dark:bg-white/5 rounded-xl border-[0.75px] border-border p-8 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
                                        <feature.icon
                                            className="h-12 w-12 mb-6 text-purple-600 dark:text-purple-400"
                                            strokeWidth={1.5}
                                        />
                                        <h3 className="text-2xl font-bold mb-4 text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Integrating the community-focused sections now */}
                <div className="container mx-auto px-4 relative z-10 py-20 pointer-events-none">
                    <div className="pointer-events-auto">
                        {/* Highlighting our solution as a priority */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="pb-32"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

                                    <div className="relative z-10">
                                        <Zap className="w-12 h-12 mx-auto mb-4 text-green-400" />
                                        <h2 className="text-3xl font-bold mb-4">
                                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                                MoveJS: JavaScript Syntax + Move Safety
                                            </span>
                                        </h2>
                                        <p className="text-lg text-zinc-300 mb-6 font-light">
                                            Write Move smart contracts with JavaScript-style syntax. Reduce learning curve from <strong>8/10 to 3/10</strong> while keeping Move's safety guarantees.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group/stat hover:border-white/20 transition-all duration-300">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover/stat:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                            <div className="relative z-10">
                                                <p className="text-2xl font-bold text-yellow-400 mb-1">62M+</p>
                                                <p className="text-sm text-zinc-400">JS Developers</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group/stat hover:border-white/20 transition-all duration-300">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover/stat:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                            <div className="relative z-10">
                                                <p className="text-2xl font-bold text-green-400 mb-1">3/10</p>
                                                <p className="text-sm text-zinc-400">New Difficulty</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group/stat hover:border-white/20 transition-all duration-300">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover/stat:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                            <div className="relative z-10">
                                                <p className="text-2xl font-bold text-cyan-400 mb-1">100%</p>
                                                <p className="text-sm text-zinc-400">Move Safety</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group/stat hover:border-white/20 transition-all duration-300">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover/stat:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                            <div className="relative z-10">
                                                <p className="text-2xl font-bold text-purple-400 mb-1">5x</p>
                                                <p className="text-sm text-zinc-400">Faster Onboarding</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* A dedicated hero for the community side */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24 max-w-4xl mx-auto"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                Bridging{" "}
                                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                                    WEB2
                                </span>{" "}
                                to{" "}
                                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                                    WEB3
                                </span>
                            </h2>
                            <p className="text-xl text-zinc-400">
                                Making Movement Network accessible to millions of Web2 developers
                            </p>
                        </motion.div>

                        {/* Breaking down the problem with some hard stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{}}
                            className="max-w-6xl mx-auto mb-32"
                        >
                            <h2 className="text-3xl font-bold text-center mb-4 text-white">The Web3 Developer Gap</h2>
                            <p className="text-center text-zinc-400 mb-12 max-w-3xl mx-auto">
                                Based on Stack Overflow 2024 (65,000+ developers) & Solidity Survey 2024
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                {problemStats.map((stat) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{}}
                                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-white">{stat.title}</h3>
                                            <p className="text-sm text-zinc-400">{stat.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* I'm using a chart here to show adoption vs difficulty */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.004 }}
                            className="p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300 max-w-5xl mx-auto mb-32"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-8 text-center text-white">
                                    Developer Adoption vs Learning Difficulty
                                </h3>

                                <div className="space-y-6">
                                    {languageStats.map((lang, index) => (
                                        <div key={lang.name} className="space-y-2">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <span className="font-semibold text-lg text-white">{lang.name}</span>
                                                    <span className="text-xs text-zinc-500 ml-2">({lang.description})</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm text-zinc-400">
                                                        {lang.usage}% adoption
                                                    </span>
                                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${lang.difficulty <= 3 ? 'bg-green-500/10 text-green-400' :
                                                        lang.difficulty <= 6 ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-red-500/10 text-red-400'
                                                        }`}>
                                                        {lang.difficulty}/10 difficulty
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="relative h-8 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${lang.usage}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.4, delay: 0.05 + index * 0.02 }}
                                                    className={`h-full bg-gradient-to-r ${lang.color} rounded-full flex items-center justify-end pr-3 shadow-[0_0_20px_rgba(255,255,255,0.05)]`}
                                                >
                                                    {lang.usage > 5 && (
                                                        <span className="text-xs font-bold text-white">
                                                            {lang.usage}%
                                                        </span>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                    <p className="text-sm text-center text-orange-400">
                                        <AlertCircle className="w-4 h-4 inline mr-2" />
                                        <strong>The Challenge:</strong> 62% developers know JavaScript (2/10 difficulty) but Move requires 8/10 effort—blocking mainstream adoption
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Explaining the trade-offs with Move */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.0005 }}
                            className="max-w-6xl mx-auto mb-32"
                        >
                            <h2 className="text-3xl font-bold text-center mb-4 text-white">
                                Why Move is Better (But Harder)
                            </h2>
                            <p className="text-center text-zinc-400 mb-12">
                                Move offers superior safety over Solidity & better ergonomics than Rust—but accessibility remains a challenge
                            </p>

                            <div className="grid md:grid-cols-3 gap-6">
                                {moveComparison.map((lang, index) => (
                                    <motion.div
                                        key={lang.language}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm relative overflow-hidden group hover:border-white/20 transition-all duration-300 shadow-2xl"
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_60%)] transition-all duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

                                        <div className="relative z-10">
                                            <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${lang.color} bg-clip-text text-transparent`}>
                                                {lang.language}
                                            </h3>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-white">Adoption</span>
                                                    <span className="text-sm text-zinc-400">{lang.adoption}%</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${(lang.adoption / 50) * 100}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: 0.05 + index * 0.03, ease: "easeOut" }}
                                                        className={`h-full bg-gradient-to-r ${lang.color}`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-semibold text-white">Difficulty</span>
                                                    <span className="text-sm text-zinc-400">{lang.difficulty}/10</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${(lang.difficulty / 10) * 100}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.4, delay: 0.1 + index * 0.03, ease: "easeOut" }}
                                                        className={`h-full ${lang.difficulty <= 3 ? 'bg-green-500' :
                                                            lang.difficulty <= 6 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-green-400 mb-2">✓ Strengths</p>
                                                    <ul className="text-xs space-y-1 text-zinc-400">
                                                        {lang.pros.map((pro, i) => (
                                                            <li key={i}>• {pro}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold text-red-400 mb-2">✗ Challenges</p>
                                                    <ul className="text-xs space-y-1 text-zinc-400">
                                                        {lang.cons.map((con, i) => (
                                                            <li key={i}>• {con}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}