(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === current);
            });
        }

        function start() {
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

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                stop();
                show(index);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function initFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
        forms.forEach(function (form) {
            var targetSelector = form.getAttribute("data-filter-target");
            var target = targetSelector ? document.querySelector(targetSelector) : null;
            if (!target) {
                return;
            }
            var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
            var textInput = form.querySelector("[data-filter-text]");
            var fields = Array.prototype.slice.call(form.querySelectorAll("[data-filter-field]"));

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function update() {
                var keyword = normalize(textInput ? textInput.value : "");
                var fieldValues = fields.map(function (field) {
                    return {
                        name: field.getAttribute("data-filter-field"),
                        value: normalize(field.value)
                    };
                });

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute("data-search"));
                    var matched = !keyword || haystack.indexOf(keyword) !== -1;
                    fieldValues.forEach(function (item) {
                        if (!item.value) {
                            return;
                        }
                        var cardValue = normalize(card.getAttribute("data-" + item.name));
                        if (item.name === "year" && item.value === "2010") {
                            var numericYear = parseInt(cardValue.replace(/\D/g, ""), 10);
                            matched = matched && numericYear <= 2010;
                        } else {
                            matched = matched && cardValue.indexOf(item.value) !== -1;
                        }
                    });
                    card.classList.toggle("hidden", !matched);
                });
            }

            if (textInput) {
                textInput.addEventListener("input", update);
            }
            fields.forEach(function (field) {
                field.addEventListener("change", update);
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
