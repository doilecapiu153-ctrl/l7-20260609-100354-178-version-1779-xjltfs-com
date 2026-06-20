document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupSearchForms();
    setupLiveSearch();
});

function setupMenu() {
    const button = document.querySelector('[data-menu-button]');
    const nav = document.querySelector('[data-mobile-nav]');

    if (!button || !nav) {
        return;
    }

    button.addEventListener('click', function () {
        button.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });
}

function setupHero() {
    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');

    if (slides.length === 0) {
        return;
    }

    let index = slides.findIndex(function (slide) {
        return slide.classList.contains('is-active');
    });

    if (index < 0) {
        index = 0;
    }

    function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    }

    if (prev) {
        prev.addEventListener('click', function () {
            show(index - 1);
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            show(index + 1);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            show(Number(dot.getAttribute('data-hero-dot')));
        });
    });

    window.setInterval(function () {
        show(index + 1);
    }, 6200);
}

function setupSearchForms() {
    const forms = Array.from(document.querySelectorAll('[data-site-search]'));

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = form.querySelector('input[name="q"]');
            const value = input ? input.value.trim() : '';
            const target = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
            window.location.href = target;
        });
    });
}

function setupLiveSearch() {
    const input = document.querySelector('[data-live-search]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const emptyState = document.querySelector('[data-empty-state]');
    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    const localForms = Array.from(document.querySelectorAll('[data-local-search]'));

    if (!input || cards.length === 0) {
        return;
    }

    let activeFilter = 'all';
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');

    if (initialQuery) {
        input.value = initialQuery;
    }

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function apply() {
        const query = normalize(input.value);
        let visible = 0;

        cards.forEach(function (card) {
            const text = normalize(card.getAttribute('data-search'));
            const category = card.getAttribute('data-category') || '';
            const matchedText = query === '' || text.indexOf(query) !== -1;
            const matchedCategory = activeFilter === 'all' || category === activeFilter;
            const show = matchedText && matchedCategory;

            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    input.addEventListener('input', apply);

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });
            apply();
        });
    });

    localForms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            apply();
        });
    });

    apply();
}
