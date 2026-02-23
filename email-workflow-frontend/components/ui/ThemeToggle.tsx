"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [currentTheme, setCurrentTheme] = useState("dark");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "dark";

        setCurrentTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);

        setIsReady(true);
    }, []);

    const handleToggle = () => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        setCurrentTheme(nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);
    };

    if (!isReady) return null;

    return (
        <button onClick={handleToggle} className="theme-toggle">
            {/* soft glow */}
            <motion.div
                animate={{
                    opacity: currentTheme === "dark" ? 0.2 : 0.4,
                }}
                className="absolute inset-0 rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, #6366f1, transparent 70%)",
                    filter: "blur(10px)",
                }}
            />

            {/* toggle knob */}
            <motion.div
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                }}
                className="absolute top-[4px] w-[26px] h-[26px] rounded-full flex items-center justify-center text-xs"
                style={{
                    left: currentTheme === "dark" ? "4px" : "34px",
                    background:
                        "linear-gradient(135deg, var(--bg), var(--card))",
                    boxShadow:
                        currentTheme === "dark"
                            ? "0 4px 10px rgba(0,0,0,.6)"
                            : "0 4px 10px rgba(0,0,0,.2)",
                }}
            >
                {currentTheme === "dark" ? "🌙" : "☀️"}
            </motion.div>
        </button>
    );
}