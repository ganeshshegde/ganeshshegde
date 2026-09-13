/* Sahyadri Cashews — landing page behaviour.
   No dependencies. Everything degrades gracefully without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings a little so groups cascade instead of popping together.
        var delay = Math.min(i * 70, 280);
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('.stat-num');

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = formatNumber(target) + suffix;
      return;
    }

    var duration = 1500;
    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(runCounter);
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------- product tabs ---------- */
  var tabWrap = document.getElementById('productTabs');
  if (tabWrap) {
    var tabs = Array.prototype.slice.call(tabWrap.querySelectorAll('[role="tab"]'));

    function selectTab(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.classList.toggle('is-active', selected);
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectTab(tab); });

      tab.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = tabs[(index + dir + tabs.length) % tabs.length];
        next.focus();
        selectTab(next);
      });
    });
  }

  /* ---------- enquiry form ---------- */
  var form = document.getElementById('enquiryForm');
  var note = document.getElementById('formNote');

  function showError(field, message) {
    var el = form.querySelector('.error[data-for="' + field + '"]');
    var input = form.elements[field];
    if (el) {
      el.textContent = message;
      el.classList.toggle('is-shown', Boolean(message));
    }
    if (input) input.classList.toggle('is-invalid', Boolean(message));
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var valid = true;

      showError('name', '');
      showError('email', '');

      if (!name) {
        showError('name', 'Please tell us your name.');
        valid = false;
      }
      if (!email) {
        showError('email', 'We need an email address to reply to.');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showError('email', 'That email address does not look right.');
        valid = false;
      }

      if (!valid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend on a static page: hand the enquiry to the visitor's mail client
      // with every field already filled in, so nothing is silently dropped.
      var lines = [
        'Name: ' + name,
        'Company: ' + (form.elements.company.value.trim() || '—'),
        'Email: ' + email,
        'Grade: ' + form.elements.grade.value,
        'Volume (MT): ' + (form.elements.volume.value.trim() || '—'),
        'Destination: ' + (form.elements.destination.value.trim() || '—'),
        '',
        (form.elements.message.value.trim() || '(no additional notes)')
      ];

      var href = 'mailto:exports@sahyadricashews.example' +
        '?subject=' + encodeURIComponent('Cashew enquiry — ' + form.elements.grade.value + ' — ' + name) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      window.location.href = href;

      if (note) {
        note.textContent = 'Opening your email client with the enquiry ready to send.';
        note.classList.add('is-success');
      }
    });

    ['name', 'email'].forEach(function (field) {
      var input = form.elements[field];
      if (input) input.addEventListener('input', function () { showError(field, ''); });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
