import { useParams, Navigate, Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { useRef, useState } from "react";

export function BlogPostPage() {
    const { slug } = useParams();
    const post = blogPosts.find((p) => p.slug === slug);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const [copied, setCopied] = useState(false);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={containerRef} className="min-h-screen text-foreground overflow-x-hidden relative bg-black selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <GravityStars starsCount={60} starsSize={2} movementSpeed={3} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,28,135,0.15),transparent_70%)]" />
            </div>

            <Navbar />

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 origin-left z-50"
                style={{ scaleX: scrollYProgress }}
            />

            <main className="relative z-10 pt-32 pb-24 px-4">
                <article className="max-w-4xl mx-auto">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group mb-8"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest">Back to Blog</span>
                        </Link>

                        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                            <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                {post.category}
                            </span>
                            <span className="text-gray-500 text-xs font-medium flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" /> {post.date}
                            </span>
                            <span className="text-gray-500 text-xs font-medium flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl md:leading-[1.1] font-bold text-white tracking-tight mb-8 drop-shadow-2xl">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-center gap-4">
                            <div className="pl-1 flex items-center gap-3 bg-white/5 pr-4 py-1.5 rounded-full border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white text-xs font-bold">{post.author}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-16 group"
                    >
                        <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-60" />
                    </motion.div>

                    {/* Content Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="relative"
                    >
                        {/* Side Decorations */}
                        <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-transparent to-transparent hidden md:block" />

                        <div className="prose prose-lg prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-purple-500 prose-h2:pl-6
                            prose-h3:text-2xl prose-h3:text-purple-200 prose-h3:mt-12
                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6
                            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300 hover:prose-a:underline hover:prose-a:decoration-2
                            prose-strong:text-white prose-strong:font-bold
                            prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-2
                            prose-li:text-gray-300 prose-li:flex prose-li:items-start prose-li:before:content-['•'] prose-li:before:text-purple-500 prose-li:before:mr-3 prose-li:before:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-white/[0.03] prose-blockquote:rounded-r-2xl prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:text-white prose-blockquote:not-italic prose-blockquote:shadow-lg prose-blockquote:my-10
                            prose-code:text-purple-300 prose-code:bg-[#0F0F11] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-white/10 prose-code:font-mono prose-code:text-sm
                            prose-pre:bg-[#050505] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-2xl prose-pre:p-6 prose-pre:my-8
                            prose-img:rounded-3xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:my-10"
                        >
                            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                        </div>

                        {/* Share Footer */}
                        <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 font-medium">Share article</span>
                                <div className="h-px w-12 bg-white/10" />
                            </div>
                            <button onClick={handleShare} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all group border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-purple-500/10">
                                {copied ? <span className="text-green-400 text-xs font-bold animate-pulse">Copied!</span> : <span className="text-xs font-bold tracking-widest uppercase">Copy Link</span>}
                                <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </motion.div>

                </article>

                {/* Read Next Section */}
                <div className="max-w-4xl mx-auto mt-32 pt-16 border-t border-white/10">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-2 h-8 bg-purple-500 rounded-full" />
                        <h3 className="text-3xl font-bold text-white tracking-tight">Read Next</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map((related) => (
                            <Link
                                key={related.id}
                                to={`/blog/${related.slug}`}
                                className="group block h-full"
                            >
                                <div className="relative aspect-[16/9] rounded-[24px] overflow-hidden mb-6 border border-white/5 bg-white/5">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black tracking-widest uppercase">
                                            {related.category}
                                        </span>
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-tight mb-3">
                                    {related.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <span>{related.readTime}</span>
                                    <span>•</span>
                                    <span>{related.author}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}

