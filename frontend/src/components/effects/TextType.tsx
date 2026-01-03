import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TextTypeProps {
    text: string;
    typingSpeed?: number;
    pauseDuration?: number;
    deletingSpeed?: number;
    loop?: boolean;
    className?: string;
    cursorCharacter?: string;
    showCursor?: boolean;
}

export function TextType({
    text,
    typingSpeed = 50,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = false,
    className = '',
    cursorCharacter = '|',
    showCursor = true,
}: TextTypeProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopCount, setLoopCount] = useState(0);

    useEffect(() => {
        if (!loop && loopCount > 0) return;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing phase
                if (displayedText.length < text.length) {
                    setDisplayedText(text.slice(0, displayedText.length + 1));
                } else {
                    // Finished typing, wait then restart (loop mode)
                    if (loop) {
                        setTimeout(() => {
                            setDisplayedText('');
                            setLoopCount(prev => prev + 1);
                        }, pauseDuration);
                    }
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, text, typingSpeed, pauseDuration, deletingSpeed, loop, loopCount]);

    return (
        <span className={className}>
            {displayedText}
            {showCursor && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-block"
                >
                    {cursorCharacter}
                </motion.span>
            )}
        </span>
    );
}
