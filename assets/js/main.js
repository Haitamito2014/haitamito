/* Northfare — interactions, motion & FR/EN translation */
(function () {
  "use strict";

  // English strings. French is the source text already in index.html.
  var EN = {
    "nav.solutions": "Solutions",
    "nav.clients": "Who it's for",
    "nav.method": "How we work",
    "nav.why": "Why Northfare",
    "nav.cta": "Request a demo",
    "nav.contact": "Contact",

    "hero.eyebrow": "Travel Tech · Morocco",
    "hero.title": "Technology that moves travel forward.",
    "hero.lead": "Northfare gives travel agencies, transport operators and companies one platform to sell, manage and distribute their travel services.",
    "hero.cta1": "Request a demo",
    "hero.cta2": "Explore the platform",
    "hero.chip1": "Travel agencies",
    "hero.chip2": "Transport operators",
    "hero.chip3": "Companies",

    "mq.1": "Booking engine",
    "mq.2": "Distribution & API",
    "mq.3": "Back office",
    "mq.4": "Transport ticketing",
    "mq.5": "Business travel",
    "mq.6": "Payments & resellers",

    "tile.more": "Learn more",
    "clients.eyebrow": "Who it's for",
    "clients.title": "One platform, three travel businesses.",
    "clients.a.t": "Travel agencies",
    "clients.a.d": "Sell flights, hotels, tours and packages online and over the counter, with a back office that centralises bookings, customers and invoicing.",
    "clients.b.t": "Transport operators",
    "clients.b.d": "Put your inventory on sale on your website and through your resellers: ticketing, seat management, fares and real-time sales tracking.",
    "clients.c.t": "Companies",
    "clients.c.d": "Organise your teams' business travel: self-service booking, travel policy, approval workflows and spend tracking.",

    "sol.eyebrow": "Solutions",
    "sol.title": "Everything you need to sell and manage travel.",
    "sol.lead": "Modules that work together or on their own, depending on your business.",
    "sol.1.t": "Booking engine",
    "sol.1.d": "A B2C and B2B engine for flights, accommodation, transfers and packages, embeddable in your website under your own brand.",
    "sol.2.t": "Distribution & connectivity",
    "sol.2.d": "Connect your suppliers and sales channels through APIs to access more content and distribute yours further.",
    "sol.3.t": "Back office & management",
    "sol.3.d": "Customer files, bookings, invoicing, commissions and reporting brought together in one tool.",
    "sol.4.t": "Transport ticketing",
    "sol.4.d": "Manage routes, timetables, seats and fares, with sales online, at the counter and through your resellers.",
    "sol.5.t": "Business travel",
    "sol.5.d": "A booking tool for employees, with travel rules, approvals and spend dashboards.",
    "sol.6.t": "Payments & reseller network",
    "sol.6.d": "Online payments, agent accounts, credit limits and commissions to grow your distribution network.",

    "how.eyebrow": "How we work",
    "how.title": "From the first conversation to go-live.",
    "how.1.t": "Assessment",
    "how.1.d": "We study your business, your suppliers and your sales channels.",
    "how.2.t": "Setup",
    "how.2.d": "We configure the modules, your fares, your brand and your connections.",
    "how.3.t": "Launch",
    "how.3.d": "Your teams are trained and your platform goes live.",
    "how.4.t": "Ongoing support",
    "how.4.d": "Responsive support and continuous improvements to grow your sales.",

    "why.eyebrow": "Why Northfare",
    "why.title": "Built for the Moroccan market, open to the world.",
    "why.lead": "A local team that understands travel in Morocco and builds tools that meet international standards.",
    "why.1.t": "Local",
    "why.1.d": "Pricing in dirhams, interface in French, Arabic and English, support from Morocco.",
    "why.2.t": "Modular",
    "why.2.d": "Start with one module and add others as your business grows.",
    "why.3.t": "Connected",
    "why.3.d": "An API-first architecture to link your suppliers, tools and partners.",
    "why.4.t": "Your brand",
    "why.4.d": "Your customers see your name, your colours and your domain — not ours.",

    "stmt.text": "Travel begins long before departure. We build the technology that makes it simple to sell, smooth to manage and easy to distribute.",
    "stmt.cta": "Let's talk about your project",

    "contact.eyebrow": "Contact",
    "contact.title": "Let's talk about your project.",
    "contact.lead": "Tell us in a few words what you want to sell or manage. We'll get back to you quickly to set up a demo.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.address": "Address",

    "form.name": "Full name",
    "form.company": "Company",
    "form.email": "Work email",
    "form.phone": "Phone",
    "form.type": "You are",
    "form.opt1": "Travel agency",
    "form.opt2": "Transport operator",
    "form.opt3": "Company",
    "form.opt4": "Other",
    "form.msg": "Your needs",
    "form.submit": "Send request",
    "form.ok": "Thank you! Your email app will open to send your request.",
    "form.err": "Please enter your name and a valid email address.",

    "footer.tag": "Technology that moves travel forward.",
    "footer.rights": "All rights reserved."
  };
  var FR_EXTRA = {
    "form.ok": "Merci ! Votre messagerie va s'ouvrir pour envoyer votre demande.",
    "form.err": "Merci d'indiquer votre nom et une adresse e-mail valide."
  };
  var META = {
    fr: { title: "Northfare — Technologie du voyage au Maroc" },
    en: { title: "Northfare — Travel technology in Morocco" }
  };
  var CONTACT_EMAIL = "contact@northfare.ma"; // fictive: replace with the real address

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined" && !reduceMotion;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- i18n ---------- */
  var nodes = document.querySelectorAll("[data-i18n]");
  var FR = {};
  nodes.forEach(function (el) { FR[el.getAttribute("data-i18n")] = el.textContent; });
  Object.keys(FR_EXTRA).forEach(function (k) { FR[k] = FR_EXTRA[k]; });
  var DICT = { fr: FR, en: EN };
  var current = "fr";

  function t(key) { return (DICT[current] && DICT[current][key]) || FR[key] || ""; }

  function setLang(lang, animate) {
    if (!DICT[lang]) lang = "fr";
    current = lang;
    nodes.forEach(function (el) {
      var v = DICT[lang][el.getAttribute("data-i18n")];
      if (v) el.textContent = v;
    });
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    var note = document.getElementById("formNote");
    if (note) { note.textContent = ""; note.className = "form__note"; }
    try { localStorage.setItem("nf-lang", lang); } catch (e) { /* storage unavailable */ }
    splitTitle(animate);
  }

  /* ---------- Hero title word reveal ---------- */
  var title = document.querySelector("[data-split]");
  function splitTitle(animate) {
    if (!title) return;
    var text = title.textContent.trim();
    title.setAttribute("aria-label", text);
    title.innerHTML = text.split(" ").map(function (w) {
      return '<span class="w" aria-hidden="true"><span>' + w + "</span></span>";
    }).join(" ");
    if (hasGsap && animate !== false) {
      gsap.fromTo(title.querySelectorAll(".w > span"),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out", stagger: 0.07, delay: 0.15 });
    }
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
  });

  var saved = null;
  try { saved = localStorage.getItem("nf-lang"); } catch (e) { /* ignore */ }
  if (!saved && /^en\b/i.test(navigator.language || "")) saved = "en";
  if (saved && saved !== "fr") setLang(saved, true); else splitTitle(true);

  /* ---------- Hero intro ---------- */
  if (hasGsap) {
    gsap.from([".hero .eyebrow", ".hero__lead", ".hero__ctas", ".hero__foot"], {
      y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.5
    });
    gsap.from(".nav__inner", { y: -16, opacity: 0, duration: .9, ease: "power3.out", delay: 0.2 });
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Nav state + progress ---------- */
  var nav = document.querySelector(".nav");
  var progress = document.getElementById("progress");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveals ---------- */
  if (hasGsap) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      gsap.from(group.children, {
        y: 40, opacity: 0, duration: .9, ease: "power3.out", stagger: 0.1,
        scrollTrigger: { trigger: group, start: "top 82%", once: true }
      });
    });
    // Parallax on the statement background and hero video
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      gsap.to(el, { yPercent: 18, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    gsap.to(".hero__video", { yPercent: 14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- Lazy videos: load & play only when visible ---------- */
  var lazyVideos = document.querySelectorAll("[data-lazy-video]");
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.dataset.loaded) {
            v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; });
            v.load(); v.dataset.loaded = "1";
          }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v.dataset.loaded) {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px" });
    lazyVideos.forEach(function (v) { vio.observe(v); });
  } else {
    lazyVideos.forEach(function (v) {
      v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; });
      v.load();
    });
  }
  // Respect reduced motion: don't autoplay the hero video.
  if (reduceMotion) {
    var hv = document.querySelector(".hero__video");
    if (hv) { hv.removeAttribute("autoplay"); hv.pause(); }
  }

  /* ---------- Contact form: opens a pre-filled email (no backend yet) ---------- */
  var form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = document.getElementById("formNote");
    var d = new FormData(form);
    var name = String(d.get("name") || "").trim();
    var email = String(d.get("email") || "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = t("form.err"); note.className = "form__note err"; return;
    }
    var en = current === "en";
    var subject = "Northfare — " + (en ? "Demo request" : "Demande de démo") + " — " + (d.get("company") || name);
    var body = [
      (en ? "Name" : "Nom") + ": " + name,
      (en ? "Company" : "Société") + ": " + (d.get("company") || "-"),
      "Email: " + email,
      (en ? "Phone" : "Téléphone") + ": " + (d.get("phone") || "-"),
      (en ? "Profile" : "Profil") + ": " + d.get("type"),
      "",
      String(d.get("message") || "")
    ].join("\n");
    note.textContent = t("form.ok"); note.className = "form__note ok";
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
