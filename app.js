/* =========================================================
   Portfolio behaviour: theme, filters, grid, lightbox.
   No dependencies.
   ========================================================= */
(function () {
  "use strict";

  var photos = Array.isArray(window.PHOTOS) ? window.PHOTOS.slice() : [];

  /* ---------- theme --------------------------------------------------- */

  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
    });
  }

  /* ---------- sticky header hairline ---------------------------------- */

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- grid ----------------------------------------------------- */

  var grid = document.getElementById("grid");
  var empty = document.getElementById("empty");
  var filterBar = document.getElementById("filters");
  var visible = photos.slice();   // what the lightbox steps through

  var reveal = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -40px 0px" })
    : null;

  function caption(photo) {
    return [photo.place, photo.year].filter(Boolean).join(" · ");
  }

  function render(collection) {
    visible = collection === "All"
      ? photos.slice()
      : photos.filter(function (p) { return p.collection === collection; });

    grid.textContent = "";

    visible.forEach(function (photo, i) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.setAttribute("aria-label", "Open " + photo.title);
      card.dataset.index = String(i);

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || photo.title;
      img.loading = i < 3 ? "eager" : "lazy";
      img.decoding = "async";
      if (photo.w && photo.h) {
        img.width = photo.w;
        img.height = photo.h;
      }

      var cap = document.createElement("figcaption");
      var name = document.createElement("span");
      name.textContent = photo.title;
      var meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = caption(photo);
      cap.appendChild(name);
      cap.appendChild(meta);

      card.appendChild(img);
      card.appendChild(cap);
      grid.appendChild(card);

      if (reveal) reveal.observe(card); else card.classList.add("is-in");
    });

    if (empty) empty.hidden = visible.length > 0;
  }

  function buildFilters() {
    if (!filterBar) return;
    var names = ["All"];
    photos.forEach(function (p) {
      if (p.collection && names.indexOf(p.collection) === -1) names.push(p.collection);
    });
    if (names.length < 3) return;   // not worth showing one chip

    names.forEach(function (name, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter";
      btn.textContent = name;
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      btn.addEventListener("click", function () {
        filterBar.querySelectorAll(".filter").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        render(name);
      });
      filterBar.appendChild(btn);
    });
  }

  /* ---------- lightbox -------------------------------------------------- */

  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-caption");
  var lbCount = document.getElementById("lb-count");
  var cursor = 0;
  var lastFocus = null;

  function show(i) {
    if (!visible.length) return;
    cursor = (i + visible.length) % visible.length;
    var photo = visible[cursor];
    lbImg.src = photo.src;
    lbImg.alt = photo.alt || photo.title;
    lbCap.textContent = [photo.title, caption(photo)].filter(Boolean).join(" — ");
    lbCount.textContent = (cursor + 1) + " / " + visible.length;
  }

  function open(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add("lb-open");
    show(i);
    lb.querySelector('[data-lb="close"]').focus();
  }

  function close() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    document.body.classList.remove("lb-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (grid) {
    grid.addEventListener("click", function (event) {
      var card = event.target.closest(".card");
      if (card) open(Number(card.dataset.index));
    });
  }

  if (lb) {
    lb.addEventListener("click", function (event) {
      var hit = event.target.closest("[data-lb]");
      if (hit) {
        var action = hit.dataset.lb;
        if (action === "close") close();
        if (action === "prev") show(cursor - 1);
        if (action === "next") show(cursor + 1);
        return;
      }
      // click on the backdrop, not the picture
      if (!event.target.closest(".lb-figure")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (lb.hidden) return;
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") show(cursor - 1);
      else if (event.key === "ArrowRight") show(cursor + 1);
      else if (event.key === "Tab") {
        // keep focus inside the dialog
        var stops = lb.querySelectorAll("button");
        var first = stops[0];
        var last = stops[stops.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last.focus(); event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus(); event.preventDefault();
        }
      }
    });

    // swipe on touch
    var startX = null;
    lb.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx < 0 ? cursor + 1 : cursor - 1);
      startX = null;
    }, { passive: true });
  }

  /* ---------- go ------------------------------------------------------- */

  buildFilters();
  render("All");

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
