import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
    children: React.ReactNode;
};

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({
    theme: "dark",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme] = useState<Theme>("dark");

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add("dark");
        localStorage.setItem("movejs-theme", "dark");
    }, []);

    const toggleTheme = () => {
        // Disabled
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
