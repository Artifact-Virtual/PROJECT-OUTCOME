import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "wasteland-orange": "var(--wasteland-orange)",
        "rust-red": "var(--rust-red)",
        "burnt-amber": "var(--burnt-amber)",
        "ash-gray": "var(--ash-gray)",
        "blood-maroon": "var(--blood-maroon)",
        "toxic-yellow": "var(--toxic-yellow)",
        "radiation-green": "var(--radiation-green)",
        "steel-blue": "var(--steel-blue)",
        "dark-wasteland": "var(--dark-wasteland)",
        "deeper-void": "var(--deeper-void)",
        "rusted-metal": "var(--rusted-metal)",
        "corroded-steel": "var(--corroded-steel)",
        "charred-earth": "var(--charred-earth)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        display: ["var(--font-display)"],
        title: ["var(--font-title)"],
        body: ["var(--font-body)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "wasteland-glitch": {
          "0%": { transform: "translate(0)" },
          "10%": { transform: "translate(-3px, 1px) skew(1deg)" },
          "20%": { transform: "translate(2px, -2px) skew(-1deg)" },
          "30%": { transform: "translate(-1px, 3px) skew(0.5deg)" },
          "40%": { transform: "translate(3px, -1px) skew(-0.5deg)" },
          "50%": { transform: "translate(-2px, 2px) skew(1deg)" },
          "60%": { transform: "translate(1px, -3px) skew(-1deg)" },
          "70%": { transform: "translate(-3px, 1px) skew(0.5deg)" },
          "80%": { transform: "translate(2px, -2px) skew(-0.5deg)" },
          "90%": { transform: "translate(-1px, 1px) skew(1deg)" },
          "100%": { transform: "translate(0)" },
        },
        "radiation-pulse": {
          "0%, 100%": { 
            opacity: "0.7", 
            transform: "scale(1)",
            filter: "hue-rotate(0deg) brightness(1)"
          },
          "25%": { 
            opacity: "1", 
            transform: "scale(1.05)",
            filter: "hue-rotate(20deg) brightness(1.2)"
          },
          "50%": { 
            opacity: "0.8", 
            transform: "scale(0.98)",
            filter: "hue-rotate(40deg) brightness(0.9)"
          },
          "75%": { 
            opacity: "1", 
            transform: "scale(1.02)",
            filter: "hue-rotate(-10deg) brightness(1.1)"
          }
        },
        drift: {
          "0%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(-10px) translateY(-5px)" },
          "50%": { transform: "translateX(0) translateY(-10px)" },
          "75%": { transform: "translateX(10px) translateY(-5px)" },
          "100%": { transform: "translateX(0) translateY(0)" }
        },
        "atmospheric-drift": {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "25%": { transform: "translateX(-20px) translateY(-10px) rotate(1deg)" },
          "50%": { transform: "translateX(10px) translateY(-20px) rotate(-0.5deg)" },
          "75%": { transform: "translateX(20px) translateY(-10px) rotate(1deg)" },
          "100%": { transform: "translateX(0) translateY(0) rotate(0deg)" }
        },
        "hologram-flicker": {
          "0%, 100%": { 
            opacity: "1", 
            filter: "brightness(1) contrast(1)"
          },
          "10%": { 
            opacity: "0.9", 
            filter: "brightness(1.1) contrast(1.2)"
          },
          "20%": { 
            opacity: "1", 
            filter: "brightness(0.9) contrast(0.8)"
          },
          "30%": { 
            opacity: "0.95", 
            filter: "brightness(1.2) contrast(1.1)"
          },
          "50%": { 
            opacity: "0.85", 
            filter: "brightness(1.3) contrast(0.9)"
          },
          "70%": { 
            opacity: "1", 
            filter: "brightness(0.8) contrast(1.3)"
          },
          "85%": { 
            opacity: "0.9", 
            filter: "brightness(1.1) contrast(1)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wasteland-glitch": "wasteland-glitch 0.4s infinite",
        "radiation-pulse": "radiation-pulse 3s ease-in-out infinite",
        "drift": "drift 60s linear infinite",
        "atmospheric-drift": "atmospheric-drift 90s ease-in-out infinite",
        "hologram-flicker": "hologram-flicker 2s ease-in-out infinite alternate",
      },
      boxShadow: {
        wasteland: "0 0 30px hsl(28 85% 55% / 0.6)",
        rust: "0 0 25px hsl(15 85% 45% / 0.5)",
        amber: "0 0 20px hsl(35 75% 45% / 0.4)",
        toxic: "0 0 35px hsl(45 95% 55% / 0.7)",
        radiation: "0 0 40px hsl(85 65% 45% / 0.6)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
