import { Link } from "react-router-dom";
import { Github, Twitter, ArrowRight } from "lucide-react";

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z" />
    </svg>
);

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
                            <SocialIcon 
                                href="https://twitter.com" 
                                icon={Twitter} 
                                label="Twitter" 
                                hoverClass="hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10"
                            />
                            <SocialIcon 
                                href="https://github.com" 
                                icon={Github} 
                                label="GitHub" 
                                hoverClass="hover:text-white hover:border-white/30 hover:bg-white/10"
                            />
                            <SocialIcon 
                                href="https://discord.com" 
                                icon={DiscordIcon} 
                                label="Discord" 
                                hoverClass="hover:text-[#5865F2] hover:border-[#5865F2]/30 hover:bg-[#5865F2]/10"
                            />
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
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                        <span>© 2025 MoveJS.</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-600" />
                        <span>Open Source</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-zinc-500">Built for</span>
                        <a
                            href="https://movementlabs.xyz"
                            target="_blank"
                            rel="noreferrer"
                            className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 px-4 py-2 rounded-lg text-yellow-400 font-semibold hover:bg-gradient-to-r hover:from-yellow-400/20 hover:to-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300 shadow-lg shadow-yellow-400/10"
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
function SocialIcon({ href, icon: Icon, label, hoverClass }: { href: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; hoverClass: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={`group relative p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 transition-all duration-300 ${hoverClass}`}
        >
            <Icon className="relative w-5 h-5 transition-colors duration-300" />
        </a>
    );
}

