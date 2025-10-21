/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        strict: {
          "primary": "#2563EB",        // blue-600
          "primary-content": "#FFFFFF", // White text on primary
          "secondary": "#4B5563",      // gray-600
          "secondary-content": "#FFFFFF", // White text on secondary
          "accent": "#1D4ED8",         // blue-800
          "accent-content": "#FFFFFF",
          "neutral": "#F3F4F6",        // gray-100
          "neutral-content": "#1F2937",  // gray-800 text on neutral
          "base-100": "#FFFFFF",       // white
          "base-200": "#F9FAFB",       // gray-50
          "base-300": "#F3F4F6",       // gray-100
          "base-content": "#1F2937",    // Default text color (gray-800)
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#EF4444",          // red-500
        },
      },
      "light",
      "dark",
    ],
  },
};
