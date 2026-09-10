/* Click-to-zoom preview for gallery and image cards. No dependencies. */
(function () {
    'use strict';

    function isPortrait(img) {
        var w = parseInt(img.getAttribute('width'), 10);
        var h = parseInt(img.getAttribute('height'), 10);
        return !!w && !!h && h > w;
    }

    var groups = [];

    document.querySelectorAll('.kg-gallery-card').forEach(function (card) {
        var imgs = Array.prototype.slice.call(card.querySelectorAll('.kg-gallery-image img')).filter(function (img) {
            return !isPortrait(img);
        });
        if (!imgs.length) return;
        var caption = card.querySelector('figcaption');
        groups.push({ imgs: imgs, caption: caption ? caption.textContent.trim() : '' });
    });

    document.querySelectorAll('.kg-card.kg-image-card').forEach(function (card) {
        var img = card.querySelector('img');
        if (!img || isPortrait(img)) return;
        var caption = card.querySelector('figcaption');
        groups.push({ imgs: [img], caption: caption ? caption.textContent.trim() : (img.alt || '') });
    });

    if (!groups.length) return;

    var lookup = new Map();
    groups.forEach(function (group) {
        group.imgs.forEach(function (img, i) {
            lookup.set(img, { group: group, index: i });
        });
    });

    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="Закрыть">×</button>' +
        '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Предыдущее изображение">‹</button>' +
        '<button type="button" class="lightbox-nav lightbox-next" aria-label="Следующее изображение">›</button>' +
        '<div class="lightbox-stage">' +
        '<img class="lightbox-img" alt="">' +
        '<div class="lightbox-caption" hidden></div>' +
        '</div>';
    document.body.appendChild(overlay);

    var stage = overlay.querySelector('.lightbox-stage');
    var imgEl = overlay.querySelector('.lightbox-img');
    var captionEl = overlay.querySelector('.lightbox-caption');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var prevBtn = overlay.querySelector('.lightbox-prev');
    var nextBtn = overlay.querySelector('.lightbox-next');

    var state = { group: null, index: 0, lastFocused: null };

    function bestSrc(img) {
        var srcset = img.getAttribute('srcset');
        if (!srcset) return img.currentSrc || img.src;
        var best = { url: img.currentSrc || img.src, width: 0 };
        srcset.split(',').forEach(function (entry) {
            var parts = entry.trim().split(/\s+/);
            var width = parseInt(parts[1], 10) || 0;
            if (width > best.width) best = { url: parts[0], width: width };
        });
        return best.url;
    }

    function show(i) {
        var group = state.group;
        state.index = (i + group.imgs.length) % group.imgs.length;
        var img = group.imgs[state.index];

        imgEl.classList.remove('is-loaded');
        imgEl.alt = img.alt || '';
        imgEl.onload = function () { imgEl.classList.add('is-loaded'); };
        imgEl.src = bestSrc(img);

        captionEl.textContent = group.caption;
        captionEl.hidden = !group.caption;

        var multi = group.imgs.length > 1;
        prevBtn.hidden = !multi;
        nextBtn.hidden = !multi;
    }

    function open(img) {
        var entry = lookup.get(img);
        if (!entry) return;
        state.lastFocused = document.activeElement;
        state.group = entry.group;
        show(entry.index);
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('lightbox-lock');
        closeBtn.focus();
        document.addEventListener('keydown', onKeydown);
    }

    function close() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('lightbox-lock');
        document.removeEventListener('keydown', onKeydown);
        imgEl.removeAttribute('src');
        if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
            state.lastFocused.focus();
        }
    }

    function onKeydown(e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowLeft') { show(state.index - 1); return; }
        if (e.key === 'ArrowRight') { show(state.index + 1); return; }
        if (e.key === 'Tab') trapFocus(e);
    }

    function trapFocus(e) {
        var focusable = [closeBtn, prevBtn, nextBtn].filter(function (el) { return !el.hidden; });
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    lookup.forEach(function (entry, img) {
        img.classList.add('is-zoomable');
        img.addEventListener('click', function () { open(img); });
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
    });
    imgEl.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(state.index - 1); });
    nextBtn.addEventListener('click', function () { show(state.index + 1); });

    var touchStartX = null;
    stage.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
        if (touchStartX === null) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) show(state.index + (dx < 0 ? 1 : -1));
        touchStartX = null;
    }, { passive: true });
})();
