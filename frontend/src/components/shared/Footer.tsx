import { Link } from "react-router-dom";
import { Github, Twitter, Disc, ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md pt-8 pb-4 relative z-10 overflow-hidden">
            {/* Background Shimmer Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(197,180,180,0.04)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Main Grid Section: 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                    {/* Column 1: Brand & Socials */}
                    <div className="space-y-8">
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="flex items-center gap-2 group relative w-fit">
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
                                    MoveJS
                                </span>
                                <span className="relative text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 text-zinc-500 tracking-widest bg-white/5">
                                    BETA
                                </span>
                            </Link>
                            <p className="text-zinc-500 font-medium italic tracking-tight">
                                "Bridging WEB2 to WEB 3"
                            </p>
                        </div>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <SocialIcon href="https://twitter.com" icon={Twitter} label="Twitter" />
                            <SocialIcon href="https://github.com" icon={Github} label="GitHub" />
                            <SocialIcon href="https://discord.com" icon={Disc} label="Discord" />
                        </div>
                    </div>

                    {/* Column 2: Product */}
                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs opacity-50">Product</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <FooterLink to="/playground">Playground</FooterLink>
                            <FooterLink to="/docs">Documentation</FooterLink>
                            <FooterLink to="/extensions">VS Code Ext.</FooterLink>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs opacity-50">Resources</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <FooterLink to="/resources">Developer Library</FooterLink>
                            <FooterLink to="/blog">Blog</FooterLink>
                        </ul>
                    </div>

                    {/* Column 4: Community */}
                    <div>
                        <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs opacity-50">Community</h4>
                        <ul className="space-y-4 text-zinc-400">
                            <FooterLink to="/team">Our Team</FooterLink>
                            <li>
                                <Link
                                    to="/waitlist"
                                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold hover:opacity-80 transition-opacity"
                                >
                                    Join Waitlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar Section */}
                <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <div className="flex items-center gap-2">
                        <span>© 2025 MoveJS.</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800" />
                        <span>Open Source</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span>Built for</span>
                        <a
                            href="https://movementlabs.xyz"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white/5 border border-white/10 px-3 py-1.5 rounded text-zinc-400 font-semibold hover:border-white/20 transition-colors"
                        >
                            Movement Network
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Helper for Links with Animation
function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <li className="relative group w-fit">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Link to={to} className="relative hover:text-purple-400 transition-colors flex items-center gap-2">
                {children}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </Link>
        </li>
    );
}

// Helper for Social Icons
function SocialIcon({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="group relative p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-purple-400 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-300"
        >
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/45 to-pink-500/45 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Icon className="relative w-5 h-5" />
        </a>
    );
}

