(function () {
  var STORAGE_KEY = "universo3d-theme";
  var root = document.documentElement;
  var path = window.location.pathname;
  var pageMatch = path.match(/clase([123])(?:\.html)?$/i);

  root.setAttribute("data-page", pageMatch ? "clase" + pageMatch[1] : "hub");

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      return;
    }
  }

  function updateToggle(theme) {
    var button = document.getElementById("themeToggle");
    if (!button) return;
    var isLight = theme === "light";
    var label = isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", isLight ? "true" : "false");
  }

  function applyTheme(theme, persist) {
    var next = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    root.style.colorScheme = next;
    if (persist) persistTheme(next);
    updateToggle(next);
  }

  applyTheme(readStoredTheme() || "dark", false);

  function initToggle() {
    if (document.getElementById("themeToggle")) return;

    if (document.querySelector(".deck-nav")) {
      root.classList.add("has-deck-nav");
    }

    var button = document.createElement("button");
    button.id = "themeToggle";
    button.className = "theme-toggle";
    button.type = "button";
    button.innerHTML =
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    button.addEventListener("click", function () {
      applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
    });

    document.body.appendChild(button);
    updateToggle(root.getAttribute("data-theme"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    if (event.newValue !== "light" && event.newValue !== "dark") return;
    applyTheme(event.newValue, false);
  });
})();
