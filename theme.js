(() => {
  const root = document.documentElement;
  const storageKey = "portfolio-theme";

  try {
    if (localStorage.getItem(storageKey) === "light") {
      root.dataset.theme = "light";
    }
  } catch {
    // The default theme is available when browser storage is blocked.
  }

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".theme-toggle");
    const label = toggle.querySelector(".theme-label");
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function updateControls() {
      label.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode";
      toggle.title = label.textContent;
      themeColor.content = getComputedStyle(root).getPropertyValue("--paper").trim();
    }

    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      updateControls();
      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {
        // Visitors can still switch themes for the current page.
      }
    });

    updateControls();
    toggle.hidden = false;
  });
})();
