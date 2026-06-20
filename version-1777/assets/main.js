(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', carousel);
    var dots = selectAll('[data-hero-dot]', carousel);
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    if (!slides.length) {
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
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function buildSearchItem(movie) {
    var link = document.createElement('a');
    link.href = movie.url;
    var title = document.createElement('strong');
    title.textContent = movie.title;
    var meta = document.createElement('small');
    meta.textContent = [movie.year, movie.region, movie.type].filter(Boolean).join(' · ');
    link.appendChild(title);
    link.appendChild(meta);
    return link;
  }

  function setupSiteSearch() {
    var inputs = selectAll('[data-site-search]');
    if (!inputs.length || !window.MOVIE_INDEX) {
      return;
    }

    inputs.forEach(function (input) {
      var container = input.closest('.header-search') || input.closest('.hero-search-panel') || input.parentElement;
      var box = container ? container.querySelector('[data-search-results]') : null;
      if (!box) {
        return;
      }

      function render() {
        var query = input.value.trim().toLowerCase();
        box.innerHTML = '';
        if (!query) {
          box.classList.remove('is-open');
          return;
        }
        var results = window.MOVIE_INDEX.filter(function (movie) {
          return movie.title.toLowerCase().indexOf(query) > -1 ||
            String(movie.year).indexOf(query) > -1 ||
            movie.region.toLowerCase().indexOf(query) > -1 ||
            movie.type.toLowerCase().indexOf(query) > -1;
        }).slice(0, 9);
        results.forEach(function (movie) {
          box.appendChild(buildSearchItem(movie));
        });
        box.classList.toggle('is-open', results.length > 0);
      }

      input.addEventListener('input', render);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          var first = box.querySelector('a');
          if (first) {
            window.location.href = first.href;
          }
        }
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.header-search') && !event.target.closest('.hero-search-panel')) {
        selectAll('[data-search-results]').forEach(function (box) {
          box.classList.remove('is-open');
        });
      }
    });
  }

  function setupCardFilters() {
    var grids = selectAll('[data-card-grid]');
    if (!grids.length) {
      return;
    }
    var search = document.querySelector('[data-card-search]');
    var year = document.querySelector('[data-year-filter]');
    var type = document.querySelector('[data-type-filter]');

    function apply() {
      var query = search ? search.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';
      selectAll('[data-movie-card]').forEach(function (card) {
        var haystack = [card.dataset.title, card.dataset.year, card.dataset.type, card.dataset.region].join(' ').toLowerCase();
        var matchQuery = !query || haystack.indexOf(query) > -1;
        var matchYear = !selectedYear || card.dataset.year === selectedYear;
        var matchType = !selectedType || card.dataset.type === selectedType;
        card.classList.toggle('is-hidden', !(matchQuery && matchYear && matchType));
      });
    }

    if (search) {
      search.addEventListener('input', apply);
    }
    if (year) {
      year.addEventListener('change', apply);
    }
    if (type) {
      type.addEventListener('change', apply);
    }
  }

  function setupPlayer() {
    var player = document.querySelector('[data-player]');
    if (!player) {
      return;
    }
    var video = player.querySelector('[data-video-player]');
    var button = player.querySelector('[data-play-button]');
    if (!video) {
      return;
    }
    var videoUrl = video.getAttribute('data-video-url');
    var started = false;
    var hls = null;

    function startPlayback() {
      if (!videoUrl) {
        return;
      }
      player.classList.add('is-playing');
      if (!started) {
        started = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
        } else {
          video.src = videoUrl;
        }
      }
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupCarousel();
    setupSiteSearch();
    setupCardFilters();
    setupPlayer();
  });
})();
