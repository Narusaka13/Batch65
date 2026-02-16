(function () {
  const toggleBtn = document.getElementById("themeToggleBtn");
  const icon = toggleBtn.querySelector("i");
  const span = toggleBtn.querySelector("span");

  // function to set theme and update icon/text (span stays "Theme", but icon changes)
  function setTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      icon.className = "bi bi-moon-stars-fill";
    } else {
      document.body.classList.remove("dark-mode");
      icon.className = "bi bi-sun-fill";
    }
    // optional: save preference
    localStorage.setItem("suryaTheme", isDark ? "dark" : "light");
  }

  // init: check localStorage first, otherwise fallback to light (or system)
  const savedTheme = localStorage.getItem("suryaTheme");
  if (savedTheme === "dark") {
    setTheme(true);
  } else if (savedTheme === "light") {
    setTheme(false);
  } else {
    // (optional system preference)
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // setTheme(prefersDark);   // uncomment if you want OS sync
    setTheme(false); // default light as original design
  }

  // toggle event
  toggleBtn.addEventListener("click", () => {
    const nowDark = document.body.classList.contains("dark-mode");
    setTheme(!nowDark);
  });
  const picWrapper = document.querySelector(".profile-pic-wrapper");
  if (picWrapper) {
    picWrapper.style.cursor = "default";
  }
})();
