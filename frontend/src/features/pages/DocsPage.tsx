import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GravityStars } from "@/components/effects/GravityStars";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
    Book,
    Rocket,
    Brain,
    Layout,
    FileCode,
    Ship,
    Star,
    Zap,
    Shield,
    Terminal,
    Copy,
    Check,
    Code2,
    Cpu,
    ArrowRight,
    Lock,
    Layers
} from "lucide-react";
import { useState, useEffect } from "react";
import LightRays from "@/components/effects/LightRays";

const sections = [
    { id: "overview", title: "Project Overview", icon: Book },
    { id: "pipeline", title: "Compiler Architecture", icon: Cpu },
    { id: "quickstart", title: "Quick Start", icon: Rocket },
    { id: "dsl-syntax", title: "MoveJS DSL Syntax", icon: Code2 },
    { id: "types", title: "Type Mapping", icon: Brain },
    { id: "cli", title: "CLI Tooling", icon: Terminal },
    { id: "deployment", title: "One-Click Deploy", icon: Ship },
    { id: "roadmap", title: "Future Roadmap", icon: Star },
];

export function DocsPage() {
    const [activeSection, setActiveSection] = useState("overview");
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.3 }
        );
        sections.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
        <div className="relative group my-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-xs font-mono text-gray-500 uppercase tracking-widest">{language}</span>
                    </div>
                    <button
                        onClick={() => handleCopy(code, id)}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                    >
                        {copied === id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-xs font-bold uppercase tracking-widest">{copied === id ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
                <pre className="p-7 overflow-x-auto custom-scrollbar">
                    <code className="text-[13px] leading-relaxed font-mono whitespace-pre text-gray-300">{code}</code>
                </pre>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen text-foreground relative">
            {/* Background Effects */}
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

            <div className="container mx-auto px-4 pt-40 pb-24 relative z-10">
                <div className="max-w-7xl mx-auto">

                    {/* Cinematic Header */}
                    <header className="mb-32 relative text-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-purple-400 text-xs font-black tracking-[0.2em] uppercase shadow-xl mb-8"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Hardhat for Movement
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 leading-[0.9]"
                        >
                            MoveJS <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent italic">SDK</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative z-10 text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
                        >
                            The complete development platform to write, compile, test, and deploy Move smart contracts using JavaScript-like syntax.
                        </motion.p>
                    </header>

                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Sidebar Navigation */}
                        <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
                            <div className="sticky top-32 space-y-8">
                                <div className="bg-gray-950/40 backdrop-blur-xl rounded-[32px] border border-white/5 p-4 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                    <div className="px-4 py-3 border-b border-white/5 mb-2 flex items-center justify-between">
                                        <span className="text-xs font-black text-gray-500 tracking-[0.2em] uppercase">Manual</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    </div>
                                    <nav className="space-y-1 relative z-10">
                                        {sections.map((section) => (
                                            <a
                                                key={section.id}
                                                href={`#${section.id}`}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${activeSection === section.id
                                                    ? "text-white shadow-lg"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                    }`}
                                            >
                                                {activeSection === section.id && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80"
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <section.icon className={`w-4 h-4 relative z-10 ${activeSection === section.id ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`} />
                                                <span className="text-sm font-bold tracking-tight relative z-10">{section.title}</span>
                                            </a>
                                        ))}
                                    </nav>
                                </div>

                                {/* Support Card */}
                                <div className="p-8 rounded-[32px] bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-transparent border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
                                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                                        <Cpu className="w-24 h-24 text-purple-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2 relative z-10">Need Architects?</h4>
                                    <Link to="/waitlist" className="relative z-10 w-full py-3 bg-white text-black text-[10px] font-black rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest shadow-lg flex items-center justify-center">Join Waitlist</Link>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 space-y-40">

                            {/* 1. Overview */}
                            <section id="overview" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]">
                                        <Book className="w-7 h-7 text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Project Overview</h2>
                                </div>
                                <div className="prose prose-invert max-w-none space-y-12">
                                    <p className="text-xl text-gray-400 leading-relaxed font-light border-l-4 border-purple-500 pl-8">
                                        MoveJS is <strong>not</strong> a JavaScript runtime on blockchain. It is a <span className="text-white font-medium">high-performance DSL compiler</span> that transforms
                                        JavaScript-style source code into secure, auditable Move smart contracts for the Movement ecosystem.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: "DSL Compiler", icon: Code2, desc: "MoveJS → Move Source", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                                            { title: "Dev Toolkit", icon: Terminal, desc: "CLI + API + SDK", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
                                            { title: "One-Click", icon: Ship, desc: "Instant Deployment", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" }
                                        ].map((f, i) => (
                                            <div key={i} className={`p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group hover:-translate-y-1 duration-300`}>
                                                <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                                    <f.icon className={`w-6 h-6 ${f.color}`} />
                                                </div>
                                                <h4 className="text-xl text-white font-bold mb-2">{f.title}</h4>
                                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">{f.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 2. Architecture */}
                            <section id="pipeline" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
                                        <Cpu className="w-7 h-7 text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Compiler Pipeline</h2>
                                </div>
                                <div className="relative p-12 rounded-[40px] bg-gray-950/60 border border-white/10 overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                        <Cpu className="w-64 h-64" />
                                    </div>

                                    {/* Visual Pipeline */}
                                    <div className="space-y-4 relative z-10">
                                        {[
                                            { step: "Lexer", desc: "Tokenizes .movejs source into lexical units", icon: FileCode },
                                            { step: "Parser", desc: "Builds a structured Abstract Syntax Tree (AST)", icon: Layout },
                                            { step: "Semantic Analyzer", desc: "Enforces Move safety rules & resource ownership", icon: Shield },
                                            { step: "IR Generator", desc: "Creates platform-independent Intermediate Representation", icon: Layers },
                                            { step: "Code Generator", desc: "Outputs valid Move source via Handlebars templates", icon: Code2 }
                                        ].map((s, i) => (
                                            <div key={i} className="group relative pl-8 border-l border-white/10 last:border-0 pb-10 last:pb-0">
                                                <div className="absolute left-[-20px] top-0 w-10 h-10 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:scale-110 transition-all shadow-xl z-10">
                                                    <span className="text-xs font-black text-gray-500 group-hover:text-blue-400">{i + 1}</span>
                                                </div>

                                                <div className="flex items-start gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors -mt-2 ml-4">
                                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                                        <s.icon className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{s.step}</h4>
                                                        <p className="text-sm text-gray-500 font-light">{s.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* 3. Quick Start */}
                            <section id="quickstart" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]">
                                        <Rocket className="w-7 h-7 text-green-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Quick Start</h2>
                                </div>
                                <div className="space-y-12">
                                    <div className="max-w-3xl">
                                        <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black">01</span>
                                            Install Toolchain
                                        </h4>

                                        {/* Terminal Window */}
                                        <div className="rounded-2xl bg-[#0A0A0B] border border-white/10 overflow-hidden shadow-2xl">
                                            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                                </div>
                                                <span className="ml-2 text-xs font-mono text-gray-500">bash</span>
                                            </div>
                                            <div className="p-6 font-mono text-sm">
                                                <div className="flex gap-3 mb-2">
                                                    <span className="text-green-400 font-bold">➜</span>
                                                    <span className="text-cyan-300">~</span>
                                                    <span className="text-white">npx @MoveJS/cli init</span>
                                                </div>
                                                <div className="text-gray-500 text-xs mb-4 pl-4 pt-1">
                                                    Initializing new MoveJS project... <br />
                                                    Created ./movejs.config.ts <br />
                                                    Created ./src/main.movejs
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="text-green-400 font-bold">➜</span>
                                                    <span className="text-cyan-300">~/my-project</span>
                                                    <div className="relative group">
                                                        <span className="text-white">movejs compile ./src/main.movejs</span>
                                                        <span className="absolute -right-4 top-0 w-2 h-4 bg-gray-500 animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-transparent border-l-4 border-purple-500">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Zap className="w-4 h-4 text-purple-400" />
                                            <span className="text-xs font-black text-white uppercase tracking-widest">Pro Tip</span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-light">Run <code className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">pnpm build</code> to compile the entire monorepo workspace with caching enabled.</p>
                                    </div>
                                </div>
                            </section>

                            {/* 4. DSL Syntax */}
                            <section id="dsl-syntax" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]">
                                        <Code2 className="w-7 h-7 text-pink-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">MoveJS DSL Syntax</h2>
                                </div>
                                <div className="space-y-8">
                                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                                        MoveJS follows a restricted subset of JavaScript/TypeScript syntax designed to map 1:1 with Move's resource-oriented logic.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-green-500/30 transition-all group">
                                            <h5 className="text-xl text-white font-bold mb-4 flex items-center gap-3">
                                                <div className="p-2 bg-green-500/10 rounded-lg">
                                                    <Shield className="w-5 h-5 text-green-400" />
                                                </div>
                                                Resource Storage
                                            </h5>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Use the <code className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">resource</code> keyword to define linear assets that can't be copied or dropped. These map directly to Move structs with key/store abilities.
                                            </p>
                                        </div>
                                        <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group">
                                            <h5 className="text-xl text-white font-bold mb-4 flex items-center gap-3">
                                                <div className="p-2 bg-red-500/10 rounded-lg">
                                                    <Lock className="w-5 h-5 text-red-400" />
                                                </div>
                                                Access Control
                                            </h5>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Functions automatically infer ownership requirements based on resource access patterns. No explicit <code className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">signer</code> arguments needed.
                                            </p>
                                        </div>
                                    </div>
                                    <CodeBlock id="syntax-demo" language="movejs" code={`// Complex Token Logic\ncontract Vault {\n  resource Balance;\n  resource AdminCap;\n\n  init(signer: signer) {\n    AdminCap[signer] = true;\n  }\n\n  deposit(user: signer, val: u64) {\n    Balance[user] += val;\n    emit DepositEvent { user, val };\n  }\n}`} />
                                </div>
                            </section>

                            {/* 5. Types */}
                            <section id="types" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]">
                                        <Brain className="w-7 h-7 text-orange-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Type Mapping</h2>
                                </div>
                                <div className="overflow-hidden bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-[32px] shadow-2xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-widest w-1/2">JavaScript Type</th>
                                                <th className="px-10 py-6 text-xs font-black text-gray-500 uppercase tracking-widest w-1/2">Move Equivalent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {[
                                                { js: "number", m: "u64, u128", icon: "🔢" },
                                                { js: "string", m: "vector<u8> (UTF-8)", icon: "abc" },
                                                { js: "boolean", m: "bool", icon: "⊨" },
                                                { js: "Object", m: "struct / resource", icon: "{}" },
                                                { js: "address", m: "address", icon: "@" }
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-white/[0.04] transition-colors group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs font-mono text-orange-400">
                                                                {row.icon}
                                                            </div>
                                                            <span className="font-mono text-white font-bold text-sm">{row.js}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-gray-400 text-sm group-hover:text-white transition-colors">{row.m}</span>
                                                            <ArrowRight className="w-3.5 h-3.5 text-orange-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* 6. CLI & Tooling */}
                            <section id="cli" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                                        <Terminal className="w-7 h-7 text-cyan-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">CLI Tooling</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { cmd: "movejs init", desc: "Initialize a new MoveJS project with recommended structure." },
                                        { cmd: "movejs compile <file>", desc: "Compile a single .movejs file to standard Move source." },
                                        { cmd: "movejs build", desc: "Batch compile all contracts and run semantic validation." },
                                        { cmd: "movejs deploy", desc: "One-step compilation and deployment to Movement testnet." }
                                    ].map((c, i) => (
                                        <div key={i} className="flex flex-col p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-all group hover:bg-white/[0.04]">
                                            <div className="mb-4">
                                                <code className="text-sm text-cyan-400 font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10">{c.cmd}</code>
                                            </div>
                                            <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{c.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* 7. Deployment */}
                            <section id="deployment" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]">
                                        <Ship className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Deployment Strategy</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-10 rounded-[40px] bg-gray-900/40 border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        <h4 className="text-2xl font-bold text-white mb-4">CLI Deployment</h4>
                                        <p className="text-base text-gray-500 mb-8 font-light">Deploy directly from terminal for CI/CD integration. Supports multiple networks.</p>
                                        <code className="block p-5 rounded-2xl bg-black/60 text-xs text-purple-400 font-mono border border-white/5">
                                            movejs deploy Token.movejs --network testnet
                                        </code>
                                    </div>
                                    <div className="p-10 rounded-[40px] bg-gray-900/40 border border-white/5 relative overflow-hidden group hover:border-pink-500/30 transition-all">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                        <h4 className="text-2xl font-bold text-white mb-4">Web Explorer</h4>
                                        <p className="text-base text-gray-500 mb-8 font-light">One-click deployment from the MoveJS Playground UI with transaction history.</p>
                                        <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                                            🚀 Open Playground
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* 8. Roadmap */}
                            <section id="roadmap" className="scroll-mt-32">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-14 h-14 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]">
                                        <Star className="w-7 h-7 text-yellow-500" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Ecosystem Map</h2>
                                </div>
                                <div className="grid md:grid-cols-1 gap-4">
                                    {[
                                        "VS Code Extension (Syntax highlighting & IntelliSense)",
                                        "Advanced DSL features (Generics, Imports, Namespacing)",
                                        "Optimization passes for gas efficiency in IR",
                                        "Source maps for Move debugger integration",
                                        "Unified Package Registry for MoveJS modules"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-6 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors hover:translate-x-2 duration-300">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                                            </div>
                                            <span className="text-gray-400 text-lg font-light group-hover:text-white transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </main>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
