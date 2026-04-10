import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.ts',
    './src/content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
        // Redesign fonts, set via CSS variables in src/app/redesign/layout.tsx
        'redesign-sans': ['var(--font-inter)', 'Inter', 'sans-serif'],
        'redesign-mono': ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        // Greentryst brand palette, unified with LinkedIn carousel brand.
        // All tokens prefixed with `gt-` to avoid collisions with existing
        // Tailwind color utilities used elsewhere in the project.
        //
        // Use the semantic names (pale, deep, forest, etc.) so references
        // stay readable and map 1:1 to the Design Bible.
        gt: {
          // Core brand greens (used for dark sections, cards, accents, CTAs)
          'text-dark': '#081C15', // near-black green, primary text on light, hero bg
          deep: '#0B3D2E',         // dark card bg (signature element)
          dark: '#1B4332',         // dark alt, hover states
          medium: '#2D6A4F',       // primary CTAs, active states
          forest: '#40916C',       // secondary accents, mid-tone
          leaf: '#52B788',         // success / live badges
          mint: '#95D5B2',         // light accents on dark backgrounds

          // Neutral surfaces (light sections use these, NOT saturated greens)
          pale: '#F8FAF9',          // off-white neutral, primary light bg
          'pale-warm': '#F4F7F5',   // very subtle warm tint for alternation
          white: '#FFFFFF',

          // Text (near-black, not green, for readability)
          'text-light': '#F0FFF4',  // off-white, used for text on dark bg

          // Semantic aliases
          bg: '#F8FAF9',           // neutral light section bg
          'bg-alt': '#FFFFFF',     // pure white for alternating sections
          'bg-dark': '#081C15',    // dark hero / footer bg
          card: '#FFFFFF',         // white cards on light sections
          'card-dark': '#0B3D2E',  // dark cards (the signature accent)
          'card-dark-alt': '#1B4332',

          // Text colors
          text: '#0B1F15',           // near-black with warm undertone, primary on light
          'text-muted': '#3D4E45',   // secondary text on light, neutral gray-green
          'text-dim': '#6B7870',     // muted metadata on light
          'text-on-dark': '#F0FFF4',
          'text-on-dark-muted': '#95D5B2',

          // Accents
          success: '#52B788',  // leaf, for LIVE badges
          amber: '#f59e0b',    // coming soon badges

          // Borders
          'border-light': '#E5EAE7', // neutral gray-green border on light bg
          'border-dark': '#40916C',  // green border on dark bg
        },
      },
      borderRadius: {
        'gt-card': '1rem', // 16px, the signature rounded-2xl
      },
      boxShadow: {
        'gt-card': '0 1px 3px rgba(8, 28, 21, 0.08)',
        'gt-card-hover': '0 4px 16px rgba(8, 28, 21, 0.12)',
        'gt-card-lg': '0 10px 40px rgba(11, 61, 46, 0.15)',
        'gt-glow': '0 0 40px rgba(45, 106, 79, 0.18)',
        'gt-glow-strong': '0 0 60px rgba(45, 106, 79, 0.28)',
      },
      letterSpacing: {
        'gt-tight': '-0.03em',
        'gt-tighter': '-0.02em',
        'gt-wide': '0.2em',
        'gt-wider': '0.25em',
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
