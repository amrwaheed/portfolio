(function () {
  "use strict";

  /* Theme toggle */
  var root = document.documentElement;
  var toggle = document.querySelector(".theme-toggle");
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (toggle) {
      var isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to night mode");
    }
  }

  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
  } else {
    applyTheme(systemPrefersDark() ? "dark" : "light");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* Hero waterline underline, fires once on load */
  var heroName = document.querySelector(".hero-name");
  if (heroName) {
    requestAnimationFrame(function () {
      heroName.classList.add("fill");
    });
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Timeline water-fill, tracks scroll progress through the list */
  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;

    function updateFill() {
      ticking = false;
      var rect = timeline.getBoundingClientRect();
      var viewportH = window.innerHeight || document.documentElement.clientHeight;
      var total = rect.height;
      if (total <= 0) return;
      var visibleBottom = viewportH * 0.6;
      var progressPx = visibleBottom - rect.top;
      var pct = Math.max(0, Math.min(1, progressPx / total));
      timeline.style.setProperty("--fill", (pct * 100) + "%");
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateFill);
      }
    }

    if (!reduceMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      updateFill();
    } else {
      timeline.style.setProperty("--fill", "100%");
    }
  }
})();
