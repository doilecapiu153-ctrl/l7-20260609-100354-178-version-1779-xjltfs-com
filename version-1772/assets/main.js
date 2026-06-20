(function () {
  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      button.classList.toggle('is-open');
    });
  }

  function setupHeroSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length || !dots.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  function setupBackTop() {
    var button = document.querySelector('[data-back-top]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupFilterGrid() {
    var input = document.querySelector('[data-filter-input]');
    var grid = document.querySelector('[data-filter-grid]');
    var empty = document.querySelector('[data-filter-empty]');
    if (!input || !grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var query = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var match = !query || haystack.indexOf(query) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    });
  }

  function setupSearchPage() {
    var form = document.querySelector('[data-search-form]');
    var input = document.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var empty = document.querySelector('[data-search-empty]');
    if (!form || !input || !results || !window.SiteSearchData) {
      return;
    }

    function card(movie) {
      return [
        '<article class="search-card">',
        '  <a href="' + movie.url + '"><img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '"></a>',
        '  <div>',
        '    <h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>',
        '    <div class="movie-meta">' + escapeHtml(movie.year + ' · ' + movie.region + ' · ' + movie.genre) + '</div>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <a class="btn-soft" href="' + movie.url + '">查看详情</a>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function runSearch(value) {
      var query = String(value || '').trim().toLowerCase();
      var matched = window.SiteSearchData.filter(function (movie) {
        var text = [movie.title, movie.region, movie.year, movie.genre, movie.type, movie.tags, movie.oneLine].join(' ').toLowerCase();
        return !query || text.indexOf(query) !== -1;
      }).slice(0, 80);
      results.innerHTML = matched.map(card).join('');
      if (empty) {
        empty.classList.toggle('is-visible', matched.length === 0);
      }
    }

    var params = new URLSearchParams(window.location.search);
    var current = params.get('q') || '';
    input.value = current;
    runSearch(current);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var url = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
      window.history.replaceState(null, '', url);
      runSearch(value);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHeroSlider();
    setupBackTop();
    setupFilterGrid();
    setupSearchPage();
  });
})();
