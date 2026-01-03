import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    Search,
    User,
    Zap,
    ArrowRight
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import LightRays from "@/components/effects/LightRays";
import { blogPosts } from "@/data/blogPosts";

export function BlogPage() {
    const [email, setEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Get featured post and regular posts
    const featuredPost = blogPosts.find(p => p.id === 'featured'); // Use the 'featured' ID we set in data
    const regularPosts = blogPosts.filter(p => p.id !== 'featured');

    // Filter posts based on search
    const filteredPosts = regularPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            setEmail('');
        }
    };

    return (
        <div className="min-h-screen text-foreground overflow-x-hidden relative">
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

            <div className="min-h-screen text-white pt-32 pb-24 relative z-10">
                <div className="container mx-auto px-4 max-w-7xl">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black tracking-widest uppercase mb-6"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Insights, Tutorials & Updates
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
                            MoveJS <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent italic">Blog</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Explore the future of JavaScript development on Move blockchains. Deep dives, best practices, and ecosystem updates.
                        </p>
                    </motion.div>

                    {/* Featured post Spotlight (Cinematic Hero Style) */}
                    {featuredPost && (
                        <motion.article
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative w-full aspect-[21/9] md:aspect-[2.4/1] rounded-[32px] overflow-hidden mb-24 group shadow-2xl border border-white/10"
                        >
                            <Link to={`/blog/${featuredPost.slug}`} className="block h-full w-full relative">
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                                </div>

                                <div className="absolute bottom-0 left-0 p-8 md:p-16 z-10 max-w-3xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-black tracking-widest text-white uppercase shadow-lg">Featured</span>
                                        <div className="flex items-center gap-2 text-gray-300 text-xs font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {featuredPost.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300 text-xs font-medium">
                                            <Clock className="w-3.5 h-3.5" />
                                            {featuredPost.readTime}
                                        </div>
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-xl group-hover:text-purple-100 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-lg text-gray-200 mb-8 max-w-2xl line-clamp-3 font-light leading-relaxed drop-shadow-md">
                                        {featuredPost.excerpt}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white text-xs font-bold">{featuredPost.author}</p>
                                                <p className="text-gray-400 text-[10px] uppercase tracking-wider">Author</p>
                                            </div>
                                        </div>

                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="ml-auto px-6 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-2"
                                        >
                                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.article>
                    )}

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <h3 className="text-3xl font-bold text-white tracking-tight">Latest Articles</h3>
                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all hover:bg-white/[0.05]"
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                        <AnimatePresence>
                            {filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/blog/${post.slug}`} className="group block h-full">
                                        <div className="relative h-full bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-[32px] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col">

                                            {/* Image Container */}
                                            <div className="aspect-[4/3] relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/5" /> {/* Placeholder while loading */}
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-black tracking-widest text-white uppercase shadow-lg">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex flex-col flex-grow relative">
                                                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                                                    {post.title}
                                                </h3>

                                                <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-3 mb-6 flex-grow">
                                                    {post.excerpt}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-[8px] text-white font-bold">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">{post.author}</span>
                                                    </div>

                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Newsletter Section */}
                    <div className="relative rounded-[32px] overflow-hidden max-w-4xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/80 via-black/20 to-black/90 backdrop-blur-xl border border-white/10" />
                        <div className="relative z-10 p-8 md:p-10 text-center">
                            <Zap className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                                Join 25,000+ Developers
                            </h2>
                            <p className="text-sm text-gray-400 mb-6 max-w-xl mx-auto font-light">
                                Get the latest MoveJS tutorials, security alerts, and ecosystem news delivered to your inbox.
                            </p>
                            <form onSubmit={handleNewsletterSubmit} className="max-w-sm mx-auto flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                                <button type="submit" className="px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-widest text-[10px]">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
