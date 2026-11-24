// Apply the saved theme before first paint. A separate file, not an inline script, so the
// Content-Security-Policy can allow scripts from this site only.
(function () {
  try {
    var saved = localStorage.getItem('omni_theme') || localStorage.getItem('antigravity_theme');
    // Same rule as useTheme: a saved choice wins, otherwise dark (the app's default).
    if (saved !== 'light') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
