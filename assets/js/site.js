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
    /* Both cut hard (was 520 / 70) because the crest is now sized to read as
       the crest rather than as a fragment, and a more visible mark has less
       room to move before an edge shows.

       The budget is the crest's vertical overhang, which is 14% of hero height
       at either end — measured at 83px on a 603px hero. These numbers spend
       58px of it (42 scroll + 15 pointer), leaving 25px.

       Sized against a SHORT hero on purpose: the overhang scales with the hero
       but this travel is fixed pixels, so a shallow viewport is the case that
       breaks first. An earlier pass used 165/60, which fit an 800px hero and
       overran a real 603px one. */
    var SCROLL_TRAVEL  = 100;
    var POINTER_TRAVEL = 40;

    /* Narrow screens get roughly a third of the travel. Three reasons: there's
       far less room before a layer's edge enters frame, mobile browsers resize
       the viewport when the URL bar collapses (which shifts everything mid-
       scroll), and large transforms on every scroll frame are the main cause of
       jank on phones. */
    function scrollTravel() {
      return (window.innerWidth || 1200) <= 760 ? 70 : SCROLL_TRAVEL;
    }

    /* Pointer drift is a mouse affordance. On touch, pointermove fires during
       a scroll drag, which adds movement nobody asked for. */
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    /* Vertical only. Horizontal drift was removed deliberately — with the crest
       sitting close to the right edge there is very little sideways room, and
       the sideways motion was the part that gave the effect away. */
    var pointerY = 0, ticking = false;

    function render() {
      ticking = false;
      var vh = window.innerHeight || 800;
      var travel = scrollTravel();

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

        var ty = (p - 0.5) * travel * d * -1;
        ty += pointerY * d * (POINTER_TRAVEL * 0.45);

        el.style.transform = "translate3d(0," + ty.toFixed(1) + "px,0)";
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
      if (!finePointer) return;
      var vh2 = window.innerHeight || 800;
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

    /* Shows five, then reveals five more per click until the list runs out.
       Applying a filter lifts the limit entirely: the user has already
       narrowed deliberately, so truncating a second time gets in the way. */
    var PREVIEW_COUNT = 5;
    var STEP = 5;

    var mode = "upcoming";
    var shownCount = PREVIEW_COUNT;
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

      var paged = (mode === "upcoming");
      var shown = paged ? list.slice(0, shownCount) : list;
      var remaining = paged ? Math.max(0, list.length - shown.length) : 0;

      var firstUpcoming = shown.findIndex(isUpcoming);
      mount.innerHTML = shown.map(function (f, i) {
        return fixtureHtml(f, i === firstUpcoming);
      }).join("");

      if (moreBtn) {
        var canPage = paged && list.length > PREVIEW_COUNT;
        moreBtn.hidden = !canPage;
        if (canPage) {
          if (remaining > 0) {
            moreBtn.innerHTML = 'Show next ' + Math.min(STEP, remaining) +
              ' <span class="fixtures-more__count">(' + remaining + ' more)</span>' +
              ' <span class="arw" aria-hidden="true">&rarr;</span>';
          } else {
            moreBtn.innerHTML = 'Show fewer';
          }
          moreBtn.setAttribute("aria-expanded", String(remaining === 0));
        }
      }

      /* Tell screen readers how much of the list is on screen — otherwise
         "Show next 5" fires with no announced result. */
      var status = document.getElementById("fixture-status");
      if (status) {
        status.textContent = paged
          ? "Showing " + shown.length + " of " + list.length + " upcoming matches."
          : "Showing " + list.length + " matches.";
      }
    }

    if (moreBtn) {
      moreBtn.addEventListener("click", function () {
        var total = DATA.fixtures.filter(isUpcoming).length;
        if (shownCount < total) {
          var firstNewIndex = shownCount;
          shownCount += STEP;
          draw();
          /* Move focus to the first newly revealed match so keyboard and
             screen reader users land on the new content, not back at the top. */
          var cards = mount.querySelectorAll(".fixture");
          var target = cards[firstNewIndex];
          if (target) {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        } else {
          shownCount = PREVIEW_COUNT;
          draw();
          /* Collapsing from the bottom of a long list would strand the reader
             below the fold. Bring them back to the list. */
          if (section) {
            section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
          }
        }
      });
    }

    var chips = document.querySelectorAll("[data-filter]");
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () {
        mode = c.getAttribute("data-filter");
        shownCount = PREVIEW_COUNT;   /* returning to Upcoming starts collapsed again */
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
     Join panel

     Three states, in order of preference:
       1. officialClubUrl  — the real one. Membership runs through Tottenham
                             because we're an official supporters club.
       2. googleFormEmbedUrl — fallback if the club ever changes how this works.
       3. plain email       — so the page is never a dead end.
     --------------------------------------------------------------- */
  function initForm() {
    var mount = document.getElementById("form-mount");
    if (!mount) return;
    var s = DATA.settings || {};
    var email = s.email || "austinspurs@gmail.com";
    var clubUrl = (s.officialClubUrl || "").trim();
    var formUrl = (s.googleFormEmbedUrl || "").trim();

    if (clubUrl) {
      mount.innerHTML =
        '<div class="form-fallback">' +
          '<p class="eyebrow">Official supporters club</p>' +
          '<h2 style="font-size:1.7rem">Sign Up Through Spurs</h2>' +
          '<div class="rule"></div>' +
          '<p>' +
            'Austin Spurs is an official Tottenham Hotspur supporters club, so email ' +
            'signup starts with them. It takes a minute and happens on their site ' +
            'rather than ours.' +
          '</p>' +
          '<p>' +
            'Follow the link, then hit <b>Join Club</b> on the Austin Spurs page. ' +
            "You'll need a Spurs account if you don't already have one. It's free." +
          '</p>' +
          '<p style="margin-top:1.8rem">' +
            '<a class="btn" href="' + escapeHtml(clubUrl) + '" target="_blank" rel="noopener">' +
              'Join at tottenhamhotspur.com <span class="arw" aria-hidden="true">&rarr;</span>' +
            '</a>' +
          '</p>' +
          '<p style="margin-top:1.6rem;font-size:.9rem;color:var(--muted)">' +
            'Stuck, or would rather not make an account? Email ' +
            '<a data-email href="mailto:' + escapeHtml(email) + '?subject=Join%20Austin%20Spurs">' +
              escapeHtml(email) + '</a> and we\'ll sort it out.' +
          '</p>' +
        '</div>';
      return;
    }

    if (formUrl) {
      mount.innerHTML =
        '<iframe src="' + escapeHtml(formUrl) + '" title="Austin Spurs mailing list signup" ' +
        'frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>';
      return;
    }

    mount.innerHTML =
      '<div class="form-fallback">' +
        '<p class="eyebrow">Get in touch</p>' +
        '<h2 style="font-size:1.7rem">Drop Us A Line</h2>' +
        '<div class="rule"></div>' +
        '<p>Send us a note and we\'ll add you by hand.</p>' +
        '<p style="margin-top:1.8rem">' +
          '<a class="btn" href="mailto:' + escapeHtml(email) + '?subject=Join%20Austin%20Spurs">' +
            'Email ' + escapeHtml(email) + ' <span class="arw" aria-hidden="true">&rarr;</span></a>' +
        '</p>' +
      '</div>';
  }

  /* ---------------------------------------------------------------
     Featured event banner (Events page)
     --------------------------------------------------------------- */
  function initFeatured() {
    var mount = document.getElementById("c2c-strip");
    if (!mount) return;
    var e = DATA.featuredEvent;
    if (!e || !e.active) { mount.remove(); return; }

    /* Retire itself the day after the event. The active flag is the manual
       override; this is the safety net for when nobody remembers to flip it.
       String compare works because both sides are ISO yyyy-mm-dd. */
    var today = (DATA.settings && DATA.settings.todayOverride) || isoToday();
    if (e.date && today > e.date) { mount.remove(); return; }

    /* Short date for the strip — the full dateLabel is too long for one line
       next to a headline and a call to action. */
    var shortDate = e.date ? formatStripDate(e.date) : "";

    mount.innerHTML =
      '<a class="c2c-strip__link" href="' + escapeHtml(e.ctaHref) + '">' +
        '<span class="c2c-strip__tag">' + escapeHtml(e.tag) + '</span>' +
        '<span class="c2c-strip__text">' +
          (shortDate ? '<b>' + escapeHtml(shortDate) + '</b> &middot; ' : '') +
          escapeHtml(e.title) + ' at ' + escapeHtml(venueShortName()) +
        '</span>' +
        '<span class="c2c-strip__cta">' + escapeHtml(e.ctaLabel) +
          ' <span class="arw" aria-hidden="true">&rarr;</span></span>' +
      '</a>';
    mount.hidden = false;
  }

  function isoToday() {
    var d = new Date();
    return d.getFullYear() + "-" +
           String(d.getMonth() + 1).padStart(2, "0") + "-" +
           String(d.getDate()).padStart(2, "0");
  }

  function formatStripDate(iso) {
    var MONTHS = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var p = iso.split("-");
    /* Built as a local date, not parsed from the string — new Date("2026-08-22")
       is treated as UTC and lands on the 21st in Austin. */
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return DAYS[d.getDay()].slice(0, 3) + " " + d.getDate() + " " + MONTHS[d.getMonth()];
  }

  function venueShortName() {
    var v = (DATA.settings && DATA.settings.venue) || {};
    /* "Mister Tramps Sports Pub & Cafe" is too long for a one-line strip. */
    return (v.name || "Mister Tramps").split(" Sports")[0];
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
