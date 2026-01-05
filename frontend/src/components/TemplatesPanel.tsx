import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Search, Filter } from "lucide-react";
import { getTemplates, searchTemplates, groupByCategory, type Template } from "@/lib/api/templatesClient";

interface TemplatesPanelProps {
    onCopyCode?: (code: string) => void;
}

export function TemplatesPanel({ onCopyCode }: TemplatesPanelProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setLoading(true);
        const data = await getTemplates();
        setTemplates(data);
        setLoading(false);
    };

    // Filter templates based on search and category
    let filtered = templates;
    if (searchTerm) {
        filtered = searchTemplates(filtered, searchTerm);
    }
    if (selectedCategory) {
        filtered = filtered.filter(t => t.category === selectedCategory);
    }

    const categorized = groupByCategory(filtered);
    const categories = [...new Set(templates.map(t => t.category))];

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopied(id);
        onCopyCode?.(code);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value || null)}
                        className="px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Templates by Category */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">No templates found matching your criteria</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(categorized).map(([category, items]) => (
                        <div key={category} className="space-y-6">
                            {/* Category Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">{category}</h3>
                                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
                                    {items.length}
                                </span>
                            </div>

                            {/* Template Cards */}
                            <div className="grid gap-6">
                                {items.map((template, idx) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-gray-950/40 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.8)]"
                                    >
                                        <div className="flex flex-col md:flex-row h-full">
                                            {/* Info Side */}
                                            <div className="md:w-[350px] p-10 flex flex-col justify-between bg-black/20 border-b md:border-b-0 md:border-r border-white/5 relative">
                                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg">
                                                        <div className="w-7 h-7 text-blue-400 flex items-center justify-center">
                                                            <div className="text-lg">📋</div>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{template.title}</h3>
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{template.description}</p>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-[9px] font-black text-blue-400 tracking-widest uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                        {template.difficulty}
                                                    </span>

                                                    {template.tags && (
                                                        <div className="flex flex-wrap gap-2 mt-6">
                                                            {template.tags.map(tag => (
                                                                <span key={tag} className="px-2 py-1 text-[8px] bg-white/5 text-gray-400 rounded border border-white/5 uppercase tracking-wide">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(template.code, template.id)}
                                                    className="relative mt-12 w-full py-4 rounded-xl bg-white/[0.03] hover:bg-blue-600 border border-white/5 hover:border-transparent transition-all overflow-hidden group/btn z-10"
                                                >
                                                    <span className="flex items-center justify-center gap-3 relative z-10">
                                                        {copied === template.id ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-blue-400 group-hover/btn:text-white" />}
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover/btn:text-white">
                                                            {copied === template.id ? "Copied" : "Copy Template"}
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>

                                            {/* Code Side */}
                                            <div className="flex-1 min-w-0 bg-[#0A0A0B] flex flex-col">
                                                {/* Mac-style Window Header */}
                                                <div className="flex items-center gap-4 px-6 py-4 bg-white/[0.02] border-b border-white/5">
                                                    <div className="flex gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                                                    </div>
                                                    <div className="flex-1 text-center pr-16">
                                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{template.title.toLowerCase().replace(/\s/g, '_')}.movejs</span>
                                                    </div>
                                                </div>

                                                <div className="relative flex-1 overflow-hidden group/code">
                                                    <div className="absolute right-4 top-4 opacity-0 group-hover/code:opacity-100 transition-opacity z-10">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">Read-Only</span>
                                                    </div>
                                                    <pre className="p-8 overflow-x-auto custom-scrollbar h-full">
                                                        <code className="text-sm font-mono leading-relaxed whitespace-pre block">
                                                            {template.code.split('\n').map((line, lineIdx) => (
                                                                <div key={lineIdx} className="table-row">
                                                                    <span className="table-cell select-none text-gray-700 text-right w-8 pr-6 text-xs">{lineIdx + 1}</span>
                                                                    <span className="table-cell text-gray-300">{line}</span>
                                                                </div>
                                                            ))}
                                                        </code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
