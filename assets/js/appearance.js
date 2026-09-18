// North7: kunci dark mode (Catppuccin Mocha).
// Menghapus preferensi light yang mungkin tersimpan dari toggle lama.
try {
  localStorage.removeItem("appearance");
} catch (e) {}
document.documentElement.classList.add("dark");
window.addEventListener("DOMContentLoaded", function () {
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", "#1E1E2E");
});
