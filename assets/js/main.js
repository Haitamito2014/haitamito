/* Northfare — interactions & FR/EN translation */
(function () {
  "use strict";

  // English strings. French is the source text already in index.html.
  var EN = {
    "skip": "Skip to content",
    "announce": "New · The group booking platform for rail operators",
    "nav.groups": "Groups",
    "nav.corporate": "Corporate",
    "nav.payment": "Payments",
    "nav.einvoice": "E-invoicing",
    "nav.clients": "Who it’s for",
    "nav.contact": "Contact",
    "nav.cta": "Request a demo",

    "hero.eyebrow": "The group & corporate travel platform",
    "hero.title": "Moving travel forward.",
    "hero.lead": "Northfare automates group and business travel sales for transport operators, travel agencies and companies: quote, option, payment, tickets and invoice, end to end.",
    "hero.cta1": "Request a demo",
    "hero.cta2": "See the platform",
    "hero.domains": "Expertise",
    "d.rail": "Rail", "d.bus": "Coach", "d.air": "Air", "d.agencies": "Agencies", "d.corporate": "Companies",

    "g.title": "Group travel, automated from request to ticket.",
    "g.problemLabel": "Today",
    "g.problem": "Most rail operators still handle groups in the back office, by email. Getting a single quote takes days, then come approval and payment.",
    "g.solutionLabel": "With Northfare",
    "g.solution": "The whole journey is online and automated, for rail as well as air. On the operator side, a back office to approve, adjust and track every group.",
    "g.s1k": "Size", "g.s1v": "10 to 100+ travellers",
    "g.s2k": "Trips", "g.s2v": "One-way, return, multi-destination",
    "g.s3k": "Fare", "g.s3v": "Per person or total",
    "st.1": "Request", "st.1d": "online, 24/7",
    "st.2": "Quote", "st.2d": "automatic",
    "st.3": "Option", "st.3d": "seats held",
    "st.4": "Payment", "st.4d": "card or transfer",
    "st.5": "Tickets", "st.5d": "+ invoice",

    "c.title": "Companies book, receive their invoices and pay online, on their own.",
    "c.ref": "Platform launched for a major European transport operator",
    "c.text": "More and more companies want a single place to organise their teams’ travel: self-service booking, travel policy, approvals and spend tracking.",
    "c.s1k": "Modes", "c.s1v": "Coach & rail",
    "c.s2k": "Languages",
    "c.s3k": "Invoices", "c.s3v": "Per entity, online",

    "p.title": "Reconciliation and invoicing on behalf of the operator.",
    "p.text": "The operator stays in control of its sales. We simplify the admin: payment by card, bank transfer, on invoice or in instalments.",
    "e.title": "Ready for mandatory e-invoicing.",
    "e.text": "E-invoicing becomes mandatory in several European countries from 2026. We have already delivered a national rail operator’s portal, in the Factur-X format.",

    "a.title": "Connected to your sales systems.",
    "a.text": "The platform integrates through APIs with operators’ and partners’ systems, and runs white-label: your customers see your name, not ours.",

    "k.1": "years of group travel expertise",
    "k.2": "customer support",
    "k.3": "languages on the corporate platform",
    "k.4": "automated steps, from request to ticket",

    "cl.title": "One platform, three travel businesses.",
    "cl.a": "Transport operators",
    "cl.ad": "Rail, coach, air: sell your seats to groups and companies, with no manual handling.",
    "cl.b": "Travel agencies",
    "cl.bd": "An online and over-the-counter tool, with bookings, customers and invoicing in one place.",
    "cl.c": "Companies",
    "cl.cd": "Self-service travel for your teams, with travel policy and approvals.",

    "ct.eyebrow": "Contact",
    "ct.title": "Let’s talk about your project.",
    "ct.lead": "Tell us what you want to sell or manage. We’ll get back to you to set up a demo.",
    "f.name": "Full name", "f.company": "Company", "f.email": "Work email", "f.type": "You are",
    "f.o1": "Transport operator", "f.o2": "Travel agency", "f.o3": "Company", "f.o4": "Other",
    "f.msg": "Your needs", "f.submit": "Send request",
    "f.ok": "Thank you! Your email app will open to send your request.",
    "f.err": "Please correct the highlighted fields.",
    "f.errName": "Please enter your name.",
    "f.errEmail": "Please enter a valid email address.",

    "footer.tag": "Travel Tech · Morocco"
  };
  var FR_EXTRA = {
    "f.ok": "Merci ! Votre messagerie va s’ouvrir pour envoyer votre demande.",
    "f.err": "Merci de corriger les champs signalés.",
    "f.errName": "Merci d’indiquer votre nom.",
    "f.errEmail": "Merci d’indiquer une adresse e-mail valide."
  };
  var META = {
    fr: "Northfare — Plateforme groupes & corporate pour le voyage",
    en: "Northfare — Group & corporate travel platform"
  };
  var TYPED = {
    fr: ["demande → devis → option → paiement → billets", "groupe · 40 voyageurs · Casablanca → Tanger"],
    en: ["request → quote → option → payment → tickets", "group · 40 travellers · Casablanca → Tangier"]
  };
  var CONTACT_EMAIL = "contact@northfaretech.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo && reduceMotion) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

  /* ---------- i18n ---------- */
  var nodes = document.querySelectorAll("[data-i18n]");
  var FR = {};
  nodes.forEach(function (el) { FR[el.getAttribute("data-i18n")] = el.textContent; });
  Object.keys(FR_EXTRA).forEach(function (k) { FR[k] = FR_EXTRA[k]; });
  var DICT = { fr: FR, en: EN };
  var current = "fr";
  function t(k) { return (DICT[current] && DICT[current][k]) || FR[k] || ""; }

  function setLang(lang) {
    if (!DICT[lang]) lang = "fr";
    current = lang;
    nodes.forEach(function (el) {
      var v = DICT[lang][el.getAttribute("data-i18n")];
      if (v) el.textContent = v;
    });
    document.documentElement.lang = lang;
    document.title = META[lang];
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    var note = document.getElementById("formNote");
    if (note) { note.textContent = ""; note.className = "form__note"; }
    try { localStorage.setItem("nf-lang", lang); } catch (e) { /* storage unavailable */ }
    restartTyping();
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Terminal typing ---------- */
  var typedEl = document.getElementById("typed");
  var typeTimer = null;
  function restartTyping() {
    if (!typedEl) return;
    clearTimeout(typeTimer);
    var lines = TYPED[current] || TYPED.fr;
    if (reduceMotion) { typedEl.textContent = lines[0]; return; }
    var li = 0, ci = 0, deleting = false;
    (function tick() {
      var line = lines[li];
      if (!deleting) {
        ci++;
        typedEl.textContent = line.slice(0, ci);
        if (ci === line.length) { deleting = true; typeTimer = setTimeout(tick, 2600); return; }
        typeTimer = setTimeout(tick, 38);
      } else {
        ci--;
        typedEl.textContent = line.slice(0, ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; typeTimer = setTimeout(tick, 400); return; }
        typeTimer = setTimeout(tick, 16);
      }
    })();
  }

  var saved = null;
  try { saved = localStorage.getItem("nf-lang"); } catch (e) { /* ignore */ }
  if (!saved && /^en\b/i.test(navigator.language || "")) saved = "en";
  if (saved && saved !== "fr") setLang(saved); else restartTyping();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { links.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); });
  });

  /* ---------- Nav state ---------- */
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".nav__tabs .tab[href^='#']"));
  var sections = tabs.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);

  /* ---------- Observers ---------- */
  if ("IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); rio.unobserve(en.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { rio.observe(el); });

    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tabs.forEach(function (a) {
          if (a.getAttribute("href") === "#" + en.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sio.observe(s); });

    var steps = document.getElementById("steps");
    if (steps && !reduceMotion) {
      var stepIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        stepIo.disconnect();
        var items = steps.querySelectorAll("li"), i = 0;
        (function next() {
          items.forEach(function (li, k) { li.classList.toggle("is-active", k === i); if (k < i) li.classList.add("is-done"); });
          if (i < items.length) { i++; setTimeout(next, 700); }
          else { items.forEach(function (li) { li.classList.remove("is-active"); li.classList.add("is-done"); }); }
        })();
      }, { threshold: 0.5 });
      stepIo.observe(steps);
    } else if (steps) {
      steps.querySelectorAll("li").forEach(function (li) { li.classList.add("is-done"); });
    }

    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.dataset.loaded) { v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; }); v.load(); v.dataset.loaded = "1"; }
          if (!reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (v.dataset.loaded) { v.pause(); }
      });
    }, { rootMargin: "200px 0px" });
    document.querySelectorAll("[data-lazy-video]").forEach(function (v) { vio.observe(v); });
  } else {
    document.documentElement.classList.add("no-io");
  }

  /* ---------- Contact form: pre-filled email (no backend yet) ---------- */
  var form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = document.getElementById("formNote");
    var d = new FormData(form);
    var name = String(d.get("name") || "").trim();
    var email = String(d.get("email") || "").trim();
    var nameOk = !!name, emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    function mark(field, ok, key) {
      form.elements[field].setAttribute("aria-invalid", String(!ok));
      document.getElementById("err-" + field).textContent = ok ? "" : t(key);
    }
    mark("name", nameOk, "f.errName");
    mark("email", emailOk, "f.errEmail");
    if (!nameOk || !emailOk) {
      note.textContent = t("f.err"); note.className = "form__note err";
      form.elements[nameOk ? "email" : "name"].focus();
      return;
    }
    var en = current === "en";
    var subject = "Northfare — " + (en ? "Demo request" : "Demande de démo") + " — " + (d.get("company") || name);
    var body = [
      (en ? "Name" : "Nom") + ": " + name,
      (en ? "Company" : "Société") + ": " + (d.get("company") || "-"),
      "Email: " + email,
      (en ? "Profile" : "Profil") + ": " + d.get("type"),
      "",
      String(d.get("message") || "")
    ].join("\n");
    note.textContent = t("f.ok"); note.className = "form__note ok";
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
