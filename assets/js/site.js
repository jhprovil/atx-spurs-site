/* ==========================================================================
   AUSTIN SPURS — site.js
   Nav, parallax hero, scroll reveals, fixture rendering, form embed.
   No build step, no dependencies. Reads everything from data/site-data.js.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.AUSTIN_SPURS || { settings: {}, fixtures: [] };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Mobile nav
     --------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
    /* Escape closes it, and focus goes back to the button */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Social links — hrefs come from settings.social in site-data.js.
     An empty url greys the tile out as "coming soon".
     --------------------------------------------------------------- */
  function initSocial() {
    var s = (DATA.settings && DATA.settings.social) || {};
    Array.prototype.forEach.call(document.querySelectorAll("[data-social]"), function (el) {
      var key = el.getAttribute("data-social");
      var url = (s[key] || "").trim();
      var label = el.getAttribute("data-label") || key;
      if (url) {
        el.setAttribute("href", url);
        el.classList.remove("social-link--soon");
        el.setAttribute("aria-label", label + " (opens in a new tab)");
      } else {
        el.removeAttribute("href");
        el.classList.add("social-link--soon");
        el.setAttribute("aria-label", label + " — coming soon");
      }
    });
  }

  /* ---------------------------------------------------------------
     Hero parallax — scroll driven, with a gentle pointer drift
     --------------------------------------------------------------- */
  function initParallax() {
    var layers = Array.prototype.slice.call(document.querySelectorAll("[data-depth]"));
    if (!layers.length || reduceMotion) return;

    /* SCROLL_TRAVEL: pixels a depth-1.0 layer moves from the moment its section
       enters the viewport to the moment it leaves. Multiply by the layer's depth
       for its actual travel, so hero__crest at 0.85 covers ~440px.
       POINTER_TRAVEL: pixels of drift from one edge of the hero to the other. */
    var SCROLL_TRAVEL  = 520;
    var POINTER_TRAVEL = 70;

    var pointerX = 0, pointerY = 0, ticking = false;

    function render() {
      ticking = false;
      var vh = window.innerHeight || 800;

      for (var i = 0; i < layers.length; i++) {
        var el = layers[i];
        var d = parseFloat(el.getAttribute("data-depth")) || 0;

        /* Measured off the live rect rather than a chain of offsetTop lookups —
           fewer assumptions about how the layer is positioned, and correct on
           every page regardless of where the section sits. */
        var host = el.parentElement.closest(".hero, .page-hero, .c2c-hero") || el.parentElement;
        var r = host.getBoundingClientRect();

        /* 0 when the section is just below the fold, 1 once it's fully above. */
        var p = (vh - r.top) / (vh + r.height);
        p = Math.max(0, Math.min(1, p));

        var ty = (p - 0.5) * SCROLL_TRAVEL * d * -1;
        var tx = pointerX * d * POINTER_TRAVEL;
        ty += pointerY * d * (POINTER_TRAVEL * 0.45);

        el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
      }
    }
    function queue() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(render); }
    }

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });

    /* Pointer drift is tracked on the whole document so the hero keeps reacting
       once the cursor moves past it, instead of snapping back to centre. */
    document.addEventListener("pointermove", function (e) {
      var vw = window.innerWidth || 1200, vh2 = window.innerHeight || 800;
      pointerX = (e.clientX / vw) - 0.5;
      pointerY = (e.clientY / vh2) - 0.5;
      queue();
    }, { passive: true });

    render();
  }

  /* ---------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------
     Fixture helpers
     --------------------------------------------------------------- */
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  var STATUS = {
    open:   { label: "Tramps is open",        hint: "Game on. COYS!",                                  cls: "open" },
    tbd:    { label: "Tramps not confirmed",  hint: "Check back closer to kickoff, or join the list.", cls: "tbd" },
    closed: { label: "Tramps closed",         hint: "Sorry, the pub isn't open.",                      cls: "closed" }
  };

  function parseDate(s) {
    var p = String(s).split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function today() {
    if (DATA.settings && DATA.settings.todayOverride) return parseDate(DATA.settings.todayOverride);
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }
  function isUpcoming(f) { return parseDate(f.date) >= today(); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function venueTag(f) {
    if (f.venue === "H") return '<span class="ha ha--h">Home</span>';
    if (f.venue === "A") return '<span class="ha ha--a">Away</span>';
    return "";
  }

  /* opts.showUk — the full events page shows UK kickoff alongside Central;
     the homepage "Next Three" leaves it off to stay uncluttered. */
  function fixtureHtml(f, isNext, opts) {
    opts = opts || {};
    var d = parseDate(f.date);
    var st = STATUS[f.tramps] || STATUS.tbd;
    var cls = "fixture";
    if (f.featured) cls += " fixture--flag";
    else if (isNext) cls += " fixture--next";

    var timeBits = [];
    if (f.ct && f.ct !== "TBC") timeBits.push(escapeHtml(f.ct) + " CT");
    else timeBits.push("Time TBC");
    if (opts.showUk !== false && f.uk && f.uk !== "TBC") timeBits.push(escapeHtml(f.uk) + " UK");
    timeBits.push(escapeHtml(f.comp || ""));

    return '' +
      '<article class="' + cls + '">' +
        '<div class="fixture__date">' +
          '<div class="fixture__dow">' + DAYS[d.getDay()] + '</div>' +
          '<div class="fixture__day">' + d.getDate() + '</div>' +
          '<div class="fixture__mon">' + MONTHS[d.getMonth()] + '</div>' +
        '</div>' +
        '<div class="fixture__meta">' +
          '<h3 class="fixture__opp">' + escapeHtml(f.opponent) + ' ' + venueTag(f) + '</h3>' +
          '<div class="fixture__sub"><span>' + timeBits.join('</span><span>') + '</span></div>' +
          (f.note ? '<p class="fixture__note">' + escapeHtml(f.note) + '</p>' : '') +
        '</div>' +
        '<div class="fixture__status status--' + st.cls + '">' +
          '<span class="lamp lamp--' + st.cls + '" aria-hidden="true"></span>' +
          '<div>' +
            '<div class="status__label">' + st.label + '</div>' +
            '<div class="status__hint">' + st.hint + '</div>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* ---------------------------------------------------------------
     Events page list + filters
     --------------------------------------------------------------- */
  function initFixtureList() {
    var mount = document.getElementById("fixture-list");
    if (!mount) return;

    /* The default view shows this many, then offers to reveal the rest in one
       go. Everything is already in the page, so there is nothing to "load" —
       paging it out a handful at a time would be friction with no payoff.
       Applying a filter lifts the limit: the user has already narrowed
       deliberately, so truncating a second time just gets in the way. */
    var PREVIEW_COUNT = 5;

    var mode = "upcoming";
    var expanded = false;
    var moreBtn = document.getElementById("fixture-more");
    var section = mount.closest("section");

    function draw() {
      var list = DATA.fixtures.slice().sort(function (a, b) {
        return parseDate(a.date) - parseDate(b.date);
      });
      if (mode === "upcoming") list = list.filter(isUpcoming);
      if (mode === "league") list = list.filter(function (f) { return f.comp === "Premier League" && isUpcoming(f); });
      if (mode === "showing") list = list.filter(function (f) { return f.tramps === "open" && isUpcoming(f); });

      if (!list.length) {
        mount.innerHTML = '<p class="section__lede">Nothing matches that filter yet. Try “Upcoming”.</p>';
        if (moreBtn) moreBtn.hidden = true;
        return;
      }

      var limited = (mode === "upcoming") && !expanded && list.length > PREVIEW_COUNT;
      var shown = limited ? list.slice(0, PREVIEW_COUNT) : list;

      var firstUpcoming = shown.findIndex(isUpcoming);
      mount.innerHTML = shown.map(function (f, i) {
        return fixtureHtml(f, i === firstUpcoming);
      }).join("");

      if (moreBtn) {
        var canToggle = (mode === "upcoming") && list.length > PREVIEW_COUNT;
        moreBtn.hidden = !canToggle;
        if (canToggle) {
          moreBtn.innerHTML = limited
            ? 'Show all ' + list.length + ' upcoming matches <span class="arw" aria-hidden="true">&rarr;</span>'
            : 'Show fewer';
          moreBtn.setAttribute("aria-expanded", String(!limited));
        }
      }
    }

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        expanded = !expanded;
        draw();
        /* Collapsing from the bottom of a long list would strand the reader
           somewhere below the fold. Bring them back to the list. */
        if (!expanded && section) {
          section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      });
    }

    var chips = document.querySelectorAll("[data-filter]");
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () {
        mode = c.getAttribute("data-filter");
        expanded = false;          /* returning to Upcoming starts collapsed again */
        Array.prototype.forEach.call(chips, function (x) {
          x.setAttribute("aria-pressed", String(x === c));
        });
        draw();
      });
    });
    draw();
  }

  /* ---------------------------------------------------------------
     "Next match" mini card (homepage + Tramps page)
     --------------------------------------------------------------- */
  function initNextMatch() {
    var mount = document.getElementById("next-match");
    if (!mount) return;
    var list = DATA.fixtures.slice()
      .filter(function (f) { return f.comp === "Premier League"; })
      .sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); })
      .filter(isUpcoming);
    if (!list.length) {
      mount.innerHTML = '<p class="section__lede">Season\'s done. New fixtures land in June.</p>';
      return;
    }
    mount.innerHTML = list.slice(0, 3).map(function (f, i) {
      return fixtureHtml(f, i === 0, { showUk: false });
    }).join("");
  }

  /* ---------------------------------------------------------------
     Google Form embed (or setup instructions if not configured yet)
     --------------------------------------------------------------- */
  function initForm() {
    var mount = document.getElementById("form-mount");
    if (!mount) return;
    var s = DATA.settings || {};
    var url = (s.googleFormEmbedUrl || "").trim();

    if (url) {
      mount.innerHTML =
        '<iframe src="' + escapeHtml(url) + '" title="Austin Spurs mailing list signup" ' +
        'frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>';
      return;
    }

    var email = s.email || "austinspurs@gmail.com";
    mount.innerHTML =
      '<div class="form-fallback">' +
        '<p class="eyebrow">Form not connected yet</p>' +
        '<h2 style="font-size:1.7rem">Two minutes to switch this on</h2>' +
        '<ol>' +
          '<li>Sign in to Google as <code>' + escapeHtml(email) + '</code> and create a new Form. Ask for name, email, and “How did you hear about us?”.</li>' +
          '<li>In the Form, open <b>Responses</b> and turn on email notifications so submissions hit the inbox.</li>' +
          '<li>Click <b>Send</b>, choose the <b>&lt; &gt;</b> embed tab, and copy the <code>src="…"</code> URL.</li>' +
          '<li>Open <code>data/site-data.js</code> and paste it into <code>googleFormEmbedUrl</code>. Save, refresh.</li>' +
        '</ol>' +
        '<p style="margin-top:1.6rem">In the meantime, anyone can reach us the old-fashioned way:</p>' +
        '<a class="btn" href="mailto:' + escapeHtml(email) + '?subject=Join%20Austin%20Spurs">' +
          'Email ' + escapeHtml(email) + ' <span class="arw">&rarr;</span></a>' +
      '</div>';
  }

  /* ---------------------------------------------------------------
     Featured event banner (Events page)
     --------------------------------------------------------------- */
  function initFeatured() {
    var mount = document.getElementById("featured-banner");
    if (!mount) return;
    var e = DATA.featuredEvent;
    if (!e || !e.active) { mount.remove(); return; }
    mount.innerHTML =
      '<div class="flag-banner__inner">' +
        '<div>' +
          '<span class="flag-banner__tag">' + escapeHtml(e.tag) + '</span>' +
          '<h2>' + escapeHtml(e.title) + '</h2>' +
          '<p><b>' + escapeHtml(e.dateLabel) + '</b> &middot; ' + escapeHtml(e.blurb) + '</p>' +
        '</div>' +
        '<a class="btn" href="' + escapeHtml(e.ctaHref) + '">' + escapeHtml(e.ctaLabel) + ' <span class="arw">&rarr;</span></a>' +
      '</div>';
  }

  /* ---------------------------------------------------------------
     Venue details injected from data
     --------------------------------------------------------------- */
  function initVenueBindings() {
    var v = (DATA.settings && DATA.settings.venue) || {};
    var map = {
      "venue-name": v.name, "venue-street": v.street,
      "venue-city": v.city, "venue-phone": v.phone
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && map[id]) el.textContent = map[id];
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-email]"), function (el) {
      var e = (DATA.settings && DATA.settings.email) || "austinspurs@gmail.com";
      el.textContent = e;
      if (el.tagName === "A") el.setAttribute("href", "mailto:" + e);
    });
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------- */
  function boot() {
    initNav();
    initSocial();
    initParallax();
    initReveal();
    initFeatured();
    initFixtureList();
    initNextMatch();
    initForm();
    initVenueBindings();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
