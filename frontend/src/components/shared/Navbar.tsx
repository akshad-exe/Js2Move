import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, Copy, LogOut, ExternalLink, Check, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/lib/wallet/useWallet";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const location = useLocation();
    const { connect, disconnect, address, formattedAddress, isConnected, hasWallet } = useWallet();

    // I'll handle the scroll effect here to update the navbar background
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // I'm closing the mobile menu whenever the route changes
    useEffect(() => setIsMobileMenuOpen(false), [location]);

    // Quick helper I wrote to copy the address to clipboard
    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-transparent py-5`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">

                    {/* The logo and brand name */}
                    <Link to="/" className="flex items-center gap-2 group z-50 relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-purple-500/25 transition-all">
                            M
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            MoveJS
                        </span>
                    </Link>

                    {/* Desktop navigation links in the center */}
                    <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-300 backdrop-blur-md ${isScrolled
                        ? "bg-gray-900/60 dark:bg-gray-950/70 border-gray-700/50 dark:border-gray-800/50 shadow-lg shadow-black/20"
                        : "bg-gray-100/30 dark:bg-white/5 border-gray-200 dark:border-white/10"
                        }`}>
                        <NavLink to="/" current={location.pathname}>
                            <Home className="w-4 h-4" />
                        </NavLink>
                        <NavLink to="/docs" current={location.pathname}>Docs</NavLink>
                        <NavLink to="/playground" current={location.pathname}>Playground</NavLink>
                    </div>

                    {/* Action buttons on the right side for desktop */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* Link to join the waitlist */}
                        <Link
                            to="/waitlist"
                            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            Join Waitlist
                        </Link>

                        {/* I'm using the RazorWalletButton here to handle connections */}
                        <RazorWalletButton
                            isConnected={isConnected}
                            address={address ? address.toString() : undefined}
                            formattedAddress={formattedAddress}
                            hasWallet={hasWallet}
                            onConnect={connect}
                            onDisconnect={disconnect}
                            onCopy={copyAddress}
                            copied={copied}
                        />
                    </div>

                    {/* These are the actions for mobile view */}
                    <div className="flex items-center gap-3 md:hidden">
                        {/* Simple wallet toggle for mobile */}
                        <button
                            onClick={isConnected ? disconnect : connect}
                            className={`p-2 rounded-lg transition-colors ${isConnected
                                ? 'text-green-500 bg-green-500/10 border border-green-500/30'
                                : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10'
                                }`}
                        >
                            <Wallet className="w-5 h-5" />
                        </button>

                        {/* The standard hamburger menu trigger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-900 dark:text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </motion.nav>

            {/* The actual mobile menu overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-x-0 top-[74px] z-40 p-4 md:hidden"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-2">
                            <MobileNavLink to="/">
                                <div className="flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    <span>Home</span>
                                </div>
                            </MobileNavLink>
                            <MobileNavLink to="/docs">Documentation</MobileNavLink>
                            <MobileNavLink to="/playground">Playground</MobileNavLink>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />

                            <Link
                                to="/waitlist"
                                className="w-full py-3 text-center font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                            >
                                Join Waitlist
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// I've split out some helper components here to keep the main Navbar clean

type RazorWalletButtonProps = {
    isConnected: boolean;
    address?: string | undefined;
    formattedAddress?: string | undefined;
    hasWallet: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
    onCopy: () => void;
    copied: boolean;
};

function RazorWalletButton({
    isConnected,
    address,
    formattedAddress,
    hasWallet,
    onConnect,
    onDisconnect,
    onCopy,
    copied
}: RazorWalletButtonProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    // This is what we show when the user is already connected
    if (isConnected && formattedAddress) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:opacity-90 transition-all shadow-lg"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {formattedAddress}
                </button>

                {showDropdown && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowDropdown(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-20 overflow-hidden">

                            {/* Showing the full address in a small info box */}
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected to Movement Network </p>
                                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{address?.toString()}</p>
                            </div>

                            {/* Button to copy the address */}
                            <button
                                onClick={onCopy}
                                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-between text-gray-700 dark:text-gray-300 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "Copied!" : "Copy Address"}
                                </span>
                            </button>

                            {/* Button to disconnect the wallet */}
                            <button
                                onClick={() => {
                                    onDisconnect();
                                    setShowDropdown(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2 transition-colors border-t border-gray-100 dark:border-gray-800"
                            >
                                <LogOut className="w-4 h-4" /> Disconnect Wallet
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // If they don't have the wallet, I'll prompt them to install it
    if (!hasWallet) {
        return (
            <a
                href="https://chromewebstore.google.com/detail/razor-wallet/fdcnegogpncmocked6eias4h4xkpjpdh"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
            >
                <Wallet className="w-4 h-4" />
                Install Razor
                <ExternalLink className="w-3 h-3" />
            </a>
        );
    }

    // They have the extension, so I'll show the connect button
    return (
        <button
            onClick={onConnect}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
        >
            <Wallet className="w-4 h-4" />
            Connect Wallet
        </button>
    );
}

function NavLink({ to, children, current }: { to: string; children: React.ReactNode; current: string }) {
    const isActive = current === to;
    return (
        <Link
            to={to}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                ? "text-gray-900 dark:text-white bg-white dark:bg-white/10 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5"
                }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link
            to={to}
            className="p-3 rounded-xl text-lg font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
            {children}
        </Link>
    );
}
