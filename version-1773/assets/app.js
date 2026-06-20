(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function applyQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var input = qs("[data-filter-input]");
    if (input && query) {
      input.value = query;
    }
  }

  function setupMobileMenu() {
    var button = qs("[data-menu-toggle]");
    var panel = qs("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", panel.classList.contains("is-open") ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = qs("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = qsa(".hero-slide", hero);
    var dots = qsa(".hero-dot", hero);
    var prev = qs("[data-hero-prev]", hero);
    var next = qs("[data-hero-next]", hero);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var cards = qsa(".searchable-card");
    if (!cards.length) {
      return;
    }
    var input = qs("[data-filter-input]");
    var typeSelect = qs("[data-filter-type]");
    var regionSelect = qs("[data-filter-region]");
    var yearSelect = qs("[data-filter-year]");
    var empty = qs("[data-empty-state]");

    function readValue(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function update() {
      var keyword = readValue(input);
      var type = readValue(typeSelect);
      var region = readValue(regionSelect);
      var year = readValue(yearSelect);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year
        ].join(" ").toLowerCase();
        var ok = true;
        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }
        if (type && String(card.dataset.type || "").toLowerCase().indexOf(type) === -1) {
          ok = false;
        }
        if (region && String(card.dataset.region || "").toLowerCase().indexOf(region) === -1) {
          ok = false;
        }
        if (year && String(card.dataset.year || "").toLowerCase() !== year) {
          ok = false;
        }
        card.style.display = ok ? "" : "none";
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, typeSelect, regionSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener("input", update);
        element.addEventListener("change", update);
      }
    });
    update();
  }

  ready(function () {
    applyQueryFromUrl();
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
