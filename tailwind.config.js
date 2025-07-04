export default {
    theme: {
        extend: {
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                "fade-in": "fadeIn 0.5s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
};
