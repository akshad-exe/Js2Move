import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import './ProfileCard.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    ENTER_TRANSITION_MS: 180
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
    name: string;
    title: string;
    handle: string;
    status: string;
    bio: string;
    social: {
        twitter?: string;
        github?: string;
        linkedin?: string;
        email?: string;
    };
    onContactClick?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    title,
    handle,
    status,
    bio,
    social,
    onContactClick
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const enterTimerRef = useRef<number | null>(null);
    const leaveRafRef = useRef<number | null>(null);

    const tiltEngine = useMemo(() => {
        let rafId: number | null = null;
        let running = false;
        let lastTs = 0;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x: number, y: number) => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;
            if (!shell || !wrap) return;

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);

            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties: Record<string, string> = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`
            };

            for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
        };

        const step = (ts: number) => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;

            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x: number, y: number) {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x: number, y: number) {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter() {
                const shell = shellRef.current;
                if (!shell) return;
                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs: number) {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent() {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel() {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                running = false;
                lastTs = 0;
            }
        };
    }, []);

    const getOffsets = (evt: React.PointerEvent, el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        (event: React.PointerEvent) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;
            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerEnter = useCallback(
        (event: React.PointerEvent) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;

            setIsHovered(true);
            shell.classList.add('active');
            shell.classList.add('entering');
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove('entering');
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerLeave = useCallback(() => {
        const shell = shellRef.current;
        if (!shell || !tiltEngine) return;

        setIsHovered(false);
        tiltEngine.toCenter();

        const checkSettle = () => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;
            if (settled) {
                shell.classList.remove('active');
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    useEffect(() => {
        if (!tiltEngine) return;

        const shell = shellRef.current;
        if (!shell) return;

        const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            shell.classList.remove('entering');
        };
    }, [tiltEngine]);

    const cardStyle = useMemo(
        () => ({
            '--inner-gradient': DEFAULT_INNER_GRADIENT,
            '--behind-glow-color': 'rgba(125, 190, 255, 0.67)',
            '--behind-glow-size': '50%'
        } as React.CSSProperties),
        []
    );

    return (
        <div className="pc-card-container">
            <div
                ref={wrapRef}
                className="pc-card-wrapper"
                style={cardStyle}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
            >
                <div className="pc-behind" />
                <div ref={shellRef} className="pc-card-shell">
                    <section className="pc-card">
                        <div className="pc-inside">
                            <div className="pc-shine" />
                            <div className="pc-glare" />
                            <div className="pc-content pc-avatar-content">
                                <div className="pc-avatar-placeholder">
                                    <span className="pc-avatar-initial">{name.charAt(0)}</span>
                                </div>
                                <div className="pc-user-info">
                                    <div className="pc-user-details">
                                        <div className="pc-mini-avatar">
                                            <span>{name.charAt(0)}</span>
                                        </div>
                                        <div className="pc-user-text">
                                            <div className="pc-handle">@{handle}</div>
                                            <div className="pc-status">{status}</div>
                                        </div>
                                    </div>
                                    <button
                                        className="pc-contact-btn"
                                        onClick={onContactClick}
                                        type="button"
                                    >
                                        Contact
                                    </button>
                                </div>
                            </div>
                            <div className="pc-content">
                                <div className="pc-details">
                                    <h3>{name}</h3>
                                    <p>{title}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* This box pops up when you hover over the card */}
            <div className={`pc-hover-info ${isHovered ? 'visible' : ''}`}>
                <p className="pc-bio">{bio}</p>
                <div className="pc-social-links">
                    {social.twitter && (
                        <a href={social.twitter} target="_blank" rel="noreferrer" className="pc-social-icon">
                            <Twitter className="w-4 h-4" />
                        </a>
                    )}
                    {social.github && (
                        <a href={social.github} target="_blank" rel="noreferrer" className="pc-social-icon">
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                    {social.linkedin && (
                        <a href={social.linkedin} target="_blank" rel="noreferrer" className="pc-social-icon">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    )}
                    {social.email && (
                        <a href={`mailto:${social.email}`} className="pc-social-icon">
                            <Mail className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
