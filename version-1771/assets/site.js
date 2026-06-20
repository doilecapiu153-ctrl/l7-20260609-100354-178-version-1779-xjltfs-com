(function () {
  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  function qsa(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  var menuButton = qs('[data-menu-button]');
  var menuPanel = qs('[data-mobile-panel]');

  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', function () {
      menuPanel.classList.toggle('is-open');
    });
  }

  qsa('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = qs('input[name="q"]', form);
      var query = input ? input.value.trim() : '';
      var target = query ? 'search.html?q=' + encodeURIComponent(query) : 'search.html';
      window.location.href = target;
    });
  });

  var slider = qs('[data-slider]');
  if (slider) {
    var slides = qsa('[data-slide]', slider);
    var dots = qsa('[data-slide-dot]', slider);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('is-active', itemIndex === current);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('is-active', itemIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    qsa('[data-slide-prev]', slider).forEach(function (button) {
      button.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    });

    qsa('[data-slide-next]', slider).forEach(function (button) {
      button.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    });

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var filterRoot = qs('[data-filter-root]');
  if (filterRoot) {
    var cards = qsa('[data-movie-card]', filterRoot);
    var input = qs('[data-filter-input]', filterRoot);
    var chips = qsa('[data-filter-chip]', filterRoot);
    var empty = qs('[data-empty-state]', filterRoot);
    var params = new URLSearchParams(window.location.search);
    var active = {
      type: '',
      region: '',
      year: ''
    };

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function matchText(card, query) {
      if (!query) {
        return true;
      }
      var text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags,
        card.dataset.year
      ].join(' ').toLowerCase();
      return text.indexOf(query.toLowerCase()) !== -1;
    }

    function matchField(card, field, value) {
      if (!value) {
        return true;
      }
      return String(card.dataset[field] || '').indexOf(value) !== -1;
    }

    function applyFilter() {
      var query = input ? input.value.trim() : '';
      var visible = 0;
      cards.forEach(function (card) {
        var ok = matchText(card, query) && matchField(card, 'type', active.type) && matchField(card, 'region', active.region) && matchField(card, 'year', active.year);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var field = chip.dataset.filterField;
        var value = chip.dataset.filterValue;
        if (active[field] === value) {
          active[field] = '';
          chip.classList.remove('is-active');
        } else {
          qsa('[data-filter-chip][data-filter-field="' + field + '"]', filterRoot).forEach(function (other) {
            other.classList.remove('is-active');
          });
          active[field] = value;
          chip.classList.add('is-active');
        }
        applyFilter();
      });
    });

    applyFilter();
  }
})();
