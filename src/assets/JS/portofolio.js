(function () {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const icon = toggleBtn.querySelector("i");
  const span = toggleBtn.querySelector("span");

  // check localStorage or prefer system? we will just toggle .dark-mode on body
  // optional: remember preference
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      icon.className = "bi bi-moon-stars-fill";
    } else {
      document.body.classList.remove("dark-mode");
      icon.className = "bi bi-sun-fill";
    }
  }

  // init: check local storage or prefers-color-scheme? we default light
  // but you can uncomment to respect OS:
  /*
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
    */

  toggleBtn.addEventListener("click", () => {
    const nowDark = document.body.classList.contains("dark-mode");
    setTheme(!nowDark);
  });
})();
