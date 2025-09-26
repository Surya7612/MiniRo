const plugins = [];

try {
  // TailwindCSS provides utility classes used throughout the UI.
  // We guard the require so local work without the package still builds,
  // but styling will be minimal until dependencies are installed.
  const tailwindcss = require('tailwindcss');
  plugins.push(tailwindcss);
} catch (error) {
  console.warn('[postcss] tailwindcss not installed – skipping utility generation.');
}

try {
  const autoprefixer = require('autoprefixer');
  plugins.push(autoprefixer);
} catch (error) {
  console.warn('[postcss] autoprefixer not installed – skipping vendor prefixing.');
}

module.exports = { plugins };
