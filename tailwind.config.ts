
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Storybook Warmth palette
				// Legacy aliases → mapped to storybook tokens (migrate components gradually)
				ios: {
					blue: 'hsl(var(--primary))',
					green: 'hsl(var(--success))',
					orange: 'hsl(var(--warning))',
					red: 'hsl(var(--destructive))',
					purple: 'hsl(var(--accent))',
					pink: 'hsl(var(--accent))',
					gray: 'hsl(var(--muted-foreground))',
					'gray-light': 'hsl(var(--muted))',
					'gray-medium': 'hsl(var(--border))',
					'system-background': 'hsl(var(--background))',
					'secondary-background': 'hsl(var(--secondary))',
					'tertiary-background': 'hsl(var(--card))',
				},
				manifest: {
					gold: 'hsl(var(--storybook-honey))',
					'warm-gold': 'hsl(var(--storybook-honey))',
					'light-gold': 'hsl(var(--storybook-cream))',
					lavender: 'hsl(var(--storybook-blush))',
					'soft-pink': 'hsl(var(--storybook-coral))',
					'sage-green': 'hsl(var(--storybook-sage))',
					'cosmic-blue': 'hsl(var(--info))',
				},
				storybook: {
					honey: 'hsl(var(--storybook-honey))',
					coral: 'hsl(var(--storybook-coral))',
					sage: 'hsl(var(--storybook-sage))',
					cream: 'hsl(var(--storybook-cream))',
					bark: 'hsl(var(--storybook-bark))',
					blush: 'hsl(var(--storybook-blush))',
				},
				// Section and badge colors
				section: {
					alt: 'hsl(var(--section-alt))',
					highlight: 'hsl(var(--section-highlight))'
				},
				badge: {
					trust: 'hsl(var(--badge-trust))',
					'trust-text': 'hsl(var(--badge-trust-text))',
					'trust-border': 'hsl(var(--badge-trust-border))',
					highlight: 'hsl(var(--badge-highlight))',
					'highlight-text': 'hsl(var(--badge-highlight-text))',
					'highlight-border': 'hsl(var(--badge-highlight-border))',
					success: 'hsl(var(--badge-success))',
					'success-text': 'hsl(var(--badge-success-text))',
					'success-border': 'hsl(var(--badge-success-border))',
					urgent: 'hsl(var(--badge-urgent))',
					'urgent-text': 'hsl(var(--badge-urgent-text))',
					'urgent-border': 'hsl(var(--badge-urgent-border))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				info: {
					DEFAULT: 'hsl(var(--info))',
					foreground: 'hsl(var(--info-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'ios': '12px',
				'ios-small': '8px',
				'storybook': '1.25rem',
				'storybook-lg': '1.75rem',
				'blob': '40% 60% 55% 45% / 60% 40% 65% 35%',
			},
			fontFamily: {
				'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
				'storybook': ['Lora', 'Georgia', 'serif'],
				'handwritten': ['"Nothing You Could Do"', 'cursive'],
				'body': ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
			},
			boxShadow: {
				'ios': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
				'ios-elevated': '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
				'storybook': 'var(--shadow-storybook)',
				'storybook-hover': 'var(--shadow-storybook-hover)',
				'elegant': 'var(--shadow-elegant)',
			},
			backdropBlur: {
				'ios': '20px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(-2%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
					'50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
				},
				'float-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' }
				},
				'sprout': {
					'0%': { transform: 'scaleY(0) translateY(20px)', opacity: '0' },
					'60%': { transform: 'scaleY(1.05) translateY(-2px)', opacity: '1' },
					'100%': { transform: 'scaleY(1) translateY(0)', opacity: '1' }
				},
				'page-turn': {
					'0%': { transform: 'perspective(800px) rotateY(0deg)' },
					'100%': { transform: 'perspective(800px) rotateY(-15deg)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'float-gentle': 'float-gentle 3s ease-in-out infinite',
				'sprout': 'sprout 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
				'page-turn': 'page-turn 0.4s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
