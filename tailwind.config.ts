import type { Config } from "tailwindcss";

export default {
	darkMode: "media",
	content: [
		"./components/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist Sans', 'sans-serif'],
				mono: ['Geist Mono', 'monospace'],
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},
				popover: {
					DEFAULT: 'var(--popover)',
					foreground: 'var(--popover-foreground)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},
				secondary: {
					DEFAULT: 'var(--secondary)',
					foreground: 'var(--secondary-foreground)'
				},
				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				border: 'var(--border)',
				input: 'var(--input)',
				ring: 'var(--ring)',
				chart: {
					'1': 'var(--chart-1)',
					'2': 'var(--chart-2)',
					'3': 'var(--chart-3)',
					'4': 'var(--chart-4)',
					'5': 'var(--chart-5)'
				}
			},
			typography: {
				DEFAULT: {
					css: {
						color: 'var(--foreground)',
						a: {
							color: 'var(--foreground)',
							'&:hover': {
								color: 'var(--foreground)'
							}
						},
						h1: {
							color: 'var(--foreground)'
						},
						h2: {
							color: 'var(--foreground)'
						},
						h3: {
							color: 'var(--foreground)'
						},
						h4: {
							color: 'var(--foreground)'
						},
						strong: {
							color: 'var(--foreground)'
						},
						code: {
							color: 'var(--foreground)'
						},
						blockquote: {
							color: 'var(--foreground)',
							borderLeftColor: 'var(--foreground)'
						}
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")], // eslint-disable-line @typescript-eslint/no-require-imports
} satisfies Config;
