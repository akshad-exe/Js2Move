import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Info, AlertTriangle, Lightbulb, ChevronRight, Sparkles } from 'lucide-react';

type BlogColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';

const colorMap: Record<BlogColor, { text: string, bg: string, border: string, icon: string, glow: string }> = {
    purple: { 
        text: 'text-purple-400', 
        bg: 'bg-purple-500/10', 
        border: 'border-purple-500/20', 
        icon: 'text-purple-400',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]'
    },
    blue: { 
        text: 'text-blue-400', 
        bg: 'bg-blue-500/10', 
        border: 'border-blue-500/20', 
        icon: 'text-blue-400',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]'
    },
    emerald: { 
        text: 'text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        border: 'border-emerald-500/20', 
        icon: 'text-emerald-400',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
    },
    amber: { 
        text: 'text-amber-400', 
        bg: 'bg-amber-500/10', 
        border: 'border-amber-500/20', 
        icon: 'text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'
    },
    rose: { 
        text: 'text-rose-400', 
        bg: 'bg-rose-500/10', 
        border: 'border-rose-500/20', 
        icon: 'text-rose-400',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]'
    },
    indigo: { 
        text: 'text-indigo-400', 
        bg: 'bg-indigo-500/10', 
        border: 'border-indigo-500/20', 
        icon: 'text-indigo-400',
        glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]'
    }
};

export const BlogSection = ({ title, icon: Icon, children, color = 'purple' }: { title: string, icon?: any, children: React.ReactNode, color?: BlogColor }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
    >
        <div className="flex items-center gap-4 mb-6">
            {Icon && (
                <div className={`p-2.5 rounded-xl ${colorMap[color].bg} border ${colorMap[color].border} ${colorMap[color].icon} ${colorMap[color].glow}`}>
                    <Icon size={22} />
                </div>
            )}
            <h2 className="text-3xl font-bold text-white tracking-tight m-0">{title}</h2>
        </div>
        <div className="space-y-6 text-gray-300 leading-relaxed">
            {children}
        </div>
    </motion.section>
);

export const BlogSubSection = ({ title, children, color = 'purple' }: { title: string, children: React.ReactNode, color?: BlogColor }) => (
    <div className="mb-8">
        <h3 className={`text-xl font-semibold ${colorMap[color].text} mb-4 flex items-center gap-2`}>
            <ChevronRight size={18} className={colorMap[color].text} />
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const highlightCode = (code: string, language: string) => {
    if (language === 'bash' || language === 'text') return code;

    const patterns = [
        { cls: 'text-gray-500 italic', reg: /\/\/.*/ }, // Comments
        { cls: 'text-emerald-400', reg: /"[^"]*"|'[^']*'|`[^`]*`/ }, // Strings
        { cls: 'text-purple-400 font-bold', reg: /\b(contract|resource|struct|module|public|fun|let|mut|has|init|assert|exists|move|borrow_global|borrow_global_mut|return|if|else|while|for|loop|break|continue|const|type|interface|export|import|from|async|await|try|catch|throw|new|class|extends|super|this|signer)\b/ }, // Keywords
        { cls: 'text-blue-400', reg: /\b(u8|u64|u128|bool|address|string|vector|table|Proposal|VotingRight|NFT|Balance|u256)\b/ }, // Types
        { cls: 'text-amber-400', reg: /\b(true|false|null|undefined)\b/ }, // Literals
        { cls: 'text-orange-400', reg: /\b\d+\b/ }, // Numbers
        { cls: 'text-indigo-400', reg: /\b(console|log|expect|toBe|describe|test|beforeAll|it|require|module|exports)\b/ } // Built-ins
    ];

    // Escape HTML first
    let html = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const combinedRegex = new RegExp(patterns.map(p => `(${p.reg.source})`).join('|'), 'g');

    return html.replace(combinedRegex, (match, ...groups) => {
        for (let i = 0; i < patterns.length; i++) {
            if (groups[i] !== undefined) {
                return `<span class="${patterns[i].cls}">${match}</span>`;
            }
        }
        return match;
    });
};

export const BlogCode = ({ code, language, title }: { code: string, language: string, title?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlighted = highlightCode(code, language);

    return (
        <div className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-[#050505] shadow-2xl group relative">
            <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    {title && <span className="ml-4 text-xs font-mono text-gray-500">{title}</span>}
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-purple-500/50">{language}</span>
                </div>
                <button 
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
            </div>
            <div className="p-6 overflow-x-auto font-mono text-sm leading-relaxed">
                <pre><code 
                    className={`language-${language}`}
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                /></pre>
            </div>
            {/* Ambient Glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-purple-500/5 blur-[100px] pointer-events-none" />
        </div>
    );
};

export const BlogCallout = ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip' | 'success', children: React.ReactNode }) => {
    const icons = {
        info: Info,
        warning: AlertTriangle,
        tip: Lightbulb,
        success: Sparkles
    };
    const colors = {
        info: 'bg-blue-500/5 border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.05)]',
        warning: 'bg-amber-500/5 border-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.05)]',
        tip: 'bg-purple-500/5 border-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.05)]',
        success: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
    };
    const Icon = icons[type];

    return (
        <div className={`my-8 p-6 rounded-2xl border ${colors[type]} flex gap-4 items-start relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <div className="mt-1 relative z-10">
                <Icon size={20} />
            </div>
            <div className="text-sm leading-relaxed opacity-90 relative z-10">
                {children}
            </div>
        </div>
    );
};

export const BlogList = ({ items, icon: Icon = ChevronRight, color = 'purple' }: { items: string[], icon?: any, color?: BlogColor }) => (
    <ul className="space-y-4 my-6 list-none p-0">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-gray-300 group">
                <div className={`mt-1 p-1 rounded-md ${colorMap[color].bg} border ${colorMap[color].border} ${colorMap[color].text} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={14} className="shrink-0" />
                </div>
                <span className="group-hover:text-white transition-colors duration-300">{item}</span>
            </li>
        ))}
    </ul>
);

export const BlogStep = ({ number, title, children, color = 'purple' }: { number: number, title: string, children: React.ReactNode, color?: BlogColor }) => (
    <div className="relative pl-16 mb-16 group">
        <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl ${colorMap[color].bg} border ${colorMap[color].border} flex items-center justify-center ${colorMap[color].text} font-bold text-lg ${colorMap[color].glow} group-hover:rotate-6 transition-transform duration-500`}>
            {number}
        </div>
        <div className={`absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b ${colorMap[color].text.replace('text-', 'from-')}/50 to-transparent -mb-8`} />
        <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{title}</h3>
        <div className="space-y-4 text-gray-300">
            {children}
        </div>
    </div>
);
