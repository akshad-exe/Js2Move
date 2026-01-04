import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Github, Twitter, Linkedin, Globe, Sparkles, Cpu, Users, MapPin, Briefcase } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import LightRays from "@/components/effects/LightRays";
import { GlowingEffect } from "@/components/ui/glowing-effect";

type TeamMember = {
    name: string;
    role: string;
    handle: string;
    location: string;
    bio: string;
    gradient: string;
    image?: string;
    imageScale?: string;
    imagePosition?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    skills: string[];
    social: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        email?: string;
    };
};

const teamMembers: TeamMember[] = [
    {
        name: "Gourav Mishra",
        role: "Fullstack Lead",
        handle: "@manofexistence",
        location: "India",
        bio: "Designing the bridge between Web2 simplicity and Web3 power. Obsessed with developer experience and pixel-perfect UIs.",
        gradient: "from-purple-500 via-pink-500 to-red-500",
        image: "/assets/team/gourav.png",
        imageScale: "scale-[1]",
        imagePosition: "object-[center_18%]",
        icon: Globe,
        skills: ["React", "Move", "System Design", "UI/UX"],
        social: {
            twitter: "https://x.com/Gorvmishra",
            github: "https://github.com/gmishrax5",
            linkedin: "https://linkedin.com/in/gmishr56",
            email: "gmishr56@gmail.com"
        }
    },
    {
        name: "Akshad Jogi",
        role: "Fullstack Lead",
        handle: "@Akshad_exe",
        location: "India",
        bio: "Architecting the core transpiler pipeline. Turning JavaScript ASTs into secure Move bytecode with zero runtime overhead.",
        gradient: "from-cyan-400 via-blue-500 to-indigo-600",
        image: "/assets/team/akshad.jpg",
        imageScale: "scale-[1.5]",
        imagePosition: "object-[center_10%]",
        icon: Cpu,
        skills: ["Rust", "Compilers", "AST", "Optimization"],
        social: {
            twitter: "https://x.com/Akshad_exe",
            github: "https://github.com/akshad-exe",
            linkedin: "https://www.linkedin.com/in/akshad-jogi/",
            email: "akshadhjogi@gmail.com"
        }
    },
    {
        name: "Harsh Jain",
        role: "DevRel Lead",
        handle: "@iamharxh",
        location: "India",
        bio: "Building the MoveJS nation. Creating world-class documentation, tutorials, and fostering a global developer community.",
        gradient: "from-orange-400 via-red-500 to-pink-600",
        image: "/assets/team/harsh.jpg",
        imageScale: "scale-[2.4]",
        imagePosition: "object-[center_12%]",
        icon: Users,
        skills: ["Community", "Content", "Strategy", "Events"],
        social: {
            twitter: "https://x.com/iamharxh",
            github: "https://github.com/HarshHp15s",
            linkedin: "https://www.linkedin.com/in/harshjainrs/",
            email: "harshjain@gmail.com"
        }
    }
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

export function TeamPage() {
    return (
        <div className="min-h-screen text-foreground relative overflow-hidden bg-black selection:bg-purple-500/30">
            {/* Cinematic Background Layer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black" />
                <GravityStars starsCount={200} starsSize={2} movementSpeed={20} mouseInfluence={200} gravityStrength={300} />
                <div className="absolute inset-0 z-0">
                    {/* Fixed prop passing error by removing opacity */}
                    <LightRays raysOrigin="center" raysColor="#ffffff" raysSpeed={0.5} lightSpread={1} rayLength={2} fadeDistance={4} />
                </div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
            </div>

            <Navbar />

            <main className="relative z-20 pt-40 pb-32 container mx-auto px-4">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center max-w-5xl mx-auto mb-40"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-black uppercase tracking-[0.3em] mb-12 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md"
                    >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        MoveJS Core Team
                    </motion.div>

                    <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-10 leading-[0.9]">
                        THE <br />
                        <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">BUILDERS</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Architecting the future of blockchain development with <span className="text-white font-medium">precision</span> and <span className="text-white font-medium">passion</span>.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-8 lg:gap-12"
                >
                    {teamMembers.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={item}
                            className="group relative h-full"
                        >
                            <div className="relative h-full rounded-[32px] border-[0.75px] border-white/10 p-2 bg-black/40 backdrop-blur-md">
                                {/* Using the GlowingEffect for that premium feel */}
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                />

                                <div className="relative h-full bg-[#0a0a0a] rounded-[24px] overflow-hidden p-8 flex flex-col items-start gap-6 group-hover:bg-[#0f0f0f] transition-colors duration-500">

                                    {/* Tech Pattern Background */}
                                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                                    {/* Avatar / Icon Header */}
                                    <div className="w-full flex items-start justify-between">
                                        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white shadow-2xl overflow-hidden ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500`}>
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className={`w-full h-full object-cover ${member.imagePosition ?? 'object-top'} ${member.imageScale ?? ''} transition-transform duration-500`}
                                                />
                                            ) : (
                                                <member.icon className="w-12 h-12" strokeWidth={1.5} />
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-2 pt-2">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                                <MapPin className="w-3 h-3 text-purple-400" />
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{member.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-2 leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                                            {member.name.split(' ')[0]}
                                            <br />
                                            <span className="text-gray-500 group-hover:text-white/60 transition-colors">{member.name.split(' ')[1]}</span>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className={`h-px w-8 bg-gradient-to-r ${member.gradient}`} />
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/80">{member.role}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed font-light mb-8 border-l-2 border-white/5 pl-4">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {/* Skills Tags */}
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {member.skills.map((skill, idx) => (
                                            <span key={idx} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-gray-400 font-mono hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Social Links Footer */}
                                    <div className="w-full pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <a href={member.social.github} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                                            <a href={member.social.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-cyan-400 transition-colors"><Twitter className="w-4 h-4" /></a>
                                            <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors"><Linkedin className="w-4 h-4" /></a>
                                        </div>
                                        <a href={`mailto:${member.social.email}`} className="p-2 rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white transition-all">
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA / Join Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-40 relative max-w-4xl mx-auto text-center p-12 overflow-hidden"
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Revolution</span>
                    </h2>
                    <p className="text-lg text-gray-400 font-light mb-10 max-w-xl mx-auto">
                        We are looking for extraordinary engineers to help us rewrite the rules of blockchain development.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:careers@movejs.dev" className="px-8 py-4 rounded-xl bg-white text-black font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center justify-center gap-2 group">
                            <Briefcase className="w-4 h-4" />
                            View Openings
                            <Briefcase className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -ml-4 group-hover:ml-0" />
                        </a>
                        <Link to="/waitlist" className="px-8 py-4 rounded-xl bg-black/50 border border-white/20 text-white font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-colors backdrop-blur-md flex items-center justify-center gap-2">
                            <Users className="w-4 h-4" />
                            Join Community
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div >
    );
}
