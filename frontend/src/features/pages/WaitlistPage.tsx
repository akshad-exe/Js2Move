import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GravityStars } from "@/components/effects/GravityStars";
import LightRays from "@/components/effects/LightRays";
import { Mail, Shield, Zap, ArrowRight, Lock } from "lucide-react";
import { submitWaitlist } from "@/lib/api/waitlistClient";

export function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed) {
            toast.error('Please enter your email');
            return;
        }

        setStatus("loading");
        try {
            const res = await submitWaitlist(trimmed);

            if (res && res.alreadySubmitted) {
                // Treat 'already submitted' as success so users see the confirmation UI
                setStatus("success");
                toast.success("You're already on the waitlist! 🎉");
                setEmail("");
                setTimeout(() => setStatus("idle"), 3000);
                return;
            }

            setStatus("success");
            toast.success("You're on the waitlist! 🎉");
            setEmail("");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err: any) {
            // Show a helpful message if available
            const message = err?.message || 'Failed to join waitlist. Please try again.';
            toast.error(message);
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen text-foreground relative overflow-hidden bg-black">
            {/* Cinematic Background Layer */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-black" />
                <GravityStars starsCount={200} starsSize={2} movementSpeed={20} mouseInfluence={200} gravityStrength={300} />
                <div className="absolute inset-0 z-0">
                    <LightRays raysOrigin="center" raysColor="#ffffff" raysSpeed={0.5} lightSpread={1} rayLength={2} fadeDistance={4} />
                </div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
            </div>

            <Navbar />

            <main className="container mx-auto px-4 py-32 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-8"
                    >
                        {/* Status Badge */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl">
                                <Lock className="w-4 h-4 text-purple-400" />
                                <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">
                                    Private Beta Access
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Join the{" "}
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                MoveJS
                            </span>{" "}
                            Elite
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed">
                            Be the first to build on the Movement Network with JavaScript syntax.
                            Limited slots available for early contributors.
                        </p>

                        {/* Form Card */}
                        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />

                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8 space-y-4"
                                >
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                                        <Zap className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold">You're on the list!</h3>
                                    <p className="text-zinc-400">Keep an eye on your inbox for your invitation.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="space-y-2 text-left">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
                                        <div className="relative group/input">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="vitalik@ethereum.org"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all text-white placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {status === "loading" ? "Securing your spot..." : "Request Access"}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Social Proof/Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                            {[
                                { icon: Shield, text: "Early Access" },
                                { icon: Zap, text: "Dev Rewards" },
                                { icon: Mail, text: "Weekly Updates" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-center gap-2 text-sm text-zinc-500 font-medium">
                                    <item.icon className="w-4 h-4 text-purple-400/50" />
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
