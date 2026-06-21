/* =====================================================================
   Javokhir Abdurasulov — Portfolio scripts
   --------------------------------------------------------------------
   >>> EDIT YOUR CONTACT DETAILS IN ONE PLACE: the SITE object below. <<<
   Every page reads from here, so you only change it once.
   ===================================================================== */

window.SITE = {
    // --- Telegram (the "Send Message" form opens this chat) ---
    telegram:      "https://t.me/talktomeniceok",
    telegramLabel: "@talktomeniceok",

    // --- Other contacts ---
    email:    "javokhirdom@gmail.com",
    phone:    "+998 93 599 83 35",
    // Leave "" to hide the icon. Paste your link to show it automatically:
    github:   "",   // e.g. "https://github.com/your-username"
    linkedin: "",   // e.g. "https://www.linkedin.com/in/your-name"
    location: "Tashkent, Uzbekistan"
};

(function ($) {
    "use strict";

    /* ---------- Wire contact links from SITE (single source of truth) ---------- */
    function isSet(v) { return v && v.indexOf('USERNAME') === -1; }

    function wireLinks() {
        var s = window.SITE;
        document.querySelectorAll('.js-tg').forEach(function (a) { a.href = s.telegram; a.target = "_blank"; a.rel = "noopener"; });
        document.querySelectorAll('.js-email').forEach(function (a) { a.href = "mailto:" + s.email; });
        document.querySelectorAll('.js-phone').forEach(function (a) { a.href = "tel:" + s.phone.replace(/[^+\d]/g, ''); });
        // GitHub / LinkedIn: wire if set, otherwise hide the element (no dead links)
        document.querySelectorAll('.js-github').forEach(function (a) {
            if (isSet(s.github)) { a.href = s.github; a.target = "_blank"; a.rel = "noopener"; }
            else { a.style.display = "none"; }
        });
        document.querySelectorAll('.js-linkedin').forEach(function (a) {
            if (isSet(s.linkedin)) { a.href = s.linkedin; a.target = "_blank"; a.rel = "noopener"; }
            else { a.style.display = "none"; }
        });

        document.querySelectorAll('.js-tg-text').forEach(function (e) { e.textContent = s.telegramLabel; });
        document.querySelectorAll('.js-email-text').forEach(function (e) { e.textContent = s.email; });
        document.querySelectorAll('.js-phone-text').forEach(function (e) { e.textContent = s.phone; });
        document.querySelectorAll('.js-location-text').forEach(function (e) { e.textContent = s.location; });
    }

    /* ---------- Toast ---------- */
    function toast(msg) {
        var t = document.getElementById('kf-toast');
        if (!t) { t = document.createElement('div'); t.id = 'kf-toast'; document.body.appendChild(t); }
        t.innerHTML = '<i class="fa fa-circle-check"></i>' + msg;
        t.classList.add('show');
        clearTimeout(window.__kfToast);
        window.__kfToast = setTimeout(function () { t.classList.remove('show'); }, 3200);
    }

    /* ---------- Contact form -> Telegram ---------- */
    function wireContactForm() {
        var form = document.getElementById('kf-contact-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = (form.querySelector('#name') || {}).value || '';
            var email = (form.querySelector('#email') || {}).value || '';
            var subject = (form.querySelector('#subject') || {}).value || '';
            var message = (form.querySelector('#message') || {}).value || '';
            var text = 'Assalomu alaykum Javokhir!\n\n' +
                       'Ism: ' + name + '\n' +
                       (email ? 'Email: ' + email + '\n' : '') +
                       (subject ? 'Mavzu: ' + subject + '\n' : '') +
                       '\n' + message;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(function () {
                    toast('Xabar nusxalandi — Telegramda joylashtiring (Ctrl+V)');
                }).catch(function () {});
            }
            window.open(window.SITE.telegram, '_blank', 'noopener');
            form.reset();
        });
    }

    /* ---------- Typing effect (hero role) ---------- */
    function typing() {
        var el = document.querySelector('[data-typing]');
        if (!el) return;
        var words = (el.getAttribute('data-typing') || '').split('|').filter(Boolean);
        if (!words.length) return;
        var w = 0, c = 0, deleting = false;
        function tick() {
            var word = words[w];
            el.textContent = word.substring(0, c);
            if (!deleting && c < word.length) { c++; setTimeout(tick, 90); }
            else if (!deleting && c === word.length) { deleting = true; setTimeout(tick, 1600); }
            else if (deleting && c > 0) { c--; setTimeout(tick, 45); }
            else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 350); }
        }
        tick();
    }

    /* ---------- Count-up stats + skill bars (on view) ---------- */
    function observeOnView() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.progress-bar[data-w]').forEach(function (b) { b.style.width = b.getAttribute('data-w'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var el = en.target;
                if (el.classList.contains('progress-bar')) {
                    el.style.width = el.getAttribute('data-w');
                } else if (el.classList.contains('num')) {
                    var target = parseFloat(el.getAttribute('data-count')) || 0;
                    var suffix = el.getAttribute('data-suffix') || '';
                    var start = 0, dur = 1400, t0 = performance.now();
                    (function step(now) {
                        var p = Math.min((now - t0) / dur, 1);
                        var val = Math.floor(start + (target - start) * (0.5 - Math.cos(p * Math.PI) / 2));
                        el.textContent = val + suffix;
                        if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
                    })(t0);
                }
                io.unobserve(el);
            });
        }, { threshold: 0.35 });
        document.querySelectorAll('.progress-bar[data-w], .num[data-count]').forEach(function (el) { io.observe(el); });
    }

    /* ---------- Spinner ---------- */
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) { $('#spinner').removeClass('show'); }
        }, 1);
    };
    spinner();

    // WOW animations
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) { $('.back-to-top').fadeIn('slow'); }
        else { $('.back-to-top').fadeOut('slow'); }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Smooth scroll for same-page anchors
    $(document).on('click', 'a[href^="#"]:not([href="#"]):not([data-bs-toggle])', function (e) {
        var id = $(this).attr('href');
        if (id.length > 1 && $(id).length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: $(id).offset().top - 70 }, 900, 'easeInOutExpo');
        }
    });

    // Testimonials / education carousel
    if ($('.testimonial-carousel').length) {
        $('.testimonial-carousel').owlCarousel({
            autoplay: true, smartSpeed: 1000, loop: true, nav: false, dots: true, items: 1, dotsData: true,
        });
    }

    // Footer year
    document.querySelectorAll('.js-year').forEach(function (e) { e.textContent = new Date().getFullYear(); });

    // init
    wireLinks();
    wireContactForm();
    typing();
    observeOnView();

})(jQuery);
