/* ==========================================================================
   Gorakhpur Zoo — Shared UI, navigation & interactions
   Author: Raj Gautam
   ========================================================================== */
(() => {
  "use strict";

  const BASE = window.location.pathname.replace(/[^/]*$/, "");
  const url = (file) => BASE + file;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const LOGO_SVG = `
    <svg viewBox="0 0 48 48" role="img" aria-label="Gorakhpur Zoo logo">
      <circle cx="24" cy="24" r="24" fill="#2E7D32"/>
      <path d="M24 36c-7 0-12.4-5.5-12.4-12.3 0-2.2 1.8-4 4-4 2.6 0 4.6 1.7 5.7 3.8C21.8 17.2 26.8 12 33.3 12c1.7 0 3.1 1.4 3.1 3.1C36.4 24.2 31.2 36 24 36z" fill="#fff"/>
      <path d="M18.6 27.7c1.9-4 4.9-7.2 9.2-9.4" fill="none" stroke="#2E7D32" stroke-width="1.7" stroke-linecap="round"/>
    </svg>`;

  const ICONS = {
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    fb: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.4-3H14V4.4c0-.9.3-1.4 1.5-1.4H18V.1C17.6.1 16.3 0 14.9 0c-3 0-5 1.8-5 5.2V6H7v3h2.9v9H14V9z"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-6.3L6.7 22H3.6l7.3-8.3L1 2h6.3l4.3 5.7L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z"/></svg>`,
    yt: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.6 12 4.6 12 4.6s-7.5 0-9.4.5A3 3 0 0 0 .5 7.2C0 9.1 0 12 0 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>`
  };

  const NAV_ITEMS = [
    ["index.html", "Home"],
    ["ticket-price.html", "Ticket Price"],
    ["animals.html", "Animals"],
    ["attractions.html", "Attractions"],
    ["gallery.html", "Gallery"],
    ["visit.html", "Visit"],
    ["about.html", "About"],
    ["contact.html", "Contact"]
  ];

  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const activeFile = currentFile.startsWith("animal-")
    ? "animals.html"
    : currentFile.startsWith("attraction-")
      ? "attractions.html"
      : currentFile;
  const bookingActive = currentFile === "booking.html";

  /* ---------------------------------------------------------------- Navbar */
  function buildNavbar() {
    const target = document.getElementById("site-nav");
    if (!target) return;

    const links = NAV_ITEMS.map(([file, label]) => {
      const active = file === activeFile || (currentFile === "" && file === "index.html");
      return `<li><a class="nav-link${active ? " active" : ""}" data-nav="${file}" href="${url(file)}"${active ? ' aria-current="page"' : ""}>${label}</a></li>`;
    }).join("");

    target.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <nav class="navbar" id="navbar" aria-label="Main navigation">
        <div class="nav-inner">
          <a class="nav-logo" href="${url("index.html")}" aria-label="Gorakhpur Zoo home">
            <span class="logo-mark" aria-hidden="true">${LOGO_SVG}</span>
            <span class="logo-text">GORAKHPUR ZOO<small>WILD · WONDER · WANDER</small></span>
          </a>
          <button class="hamburger" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle navigation menu">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links" id="navLinks">
            ${links}
            <li><a class="btn btn-light nav-cta${bookingActive ? " active" : ""}" href="${url("booking.html")}"${bookingActive ? ' aria-current="page"' : ""}>Book Tickets</a></li>
          </ul>
        </div>
      </nav>`;

    const nav = document.getElementById("navbar");
    const toggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    const closeMenu = () => {
      navLinks.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (!nav.contains(e.target)) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });

    const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });
  }

  /* ---------------------------------------------------------------- Footer */
  function buildFooter() {
    const target = document.getElementById("site-footer");
    if (!target) return;

    target.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="nav-logo" href="${url("index.html")}" aria-label="Gorakhpur Zoo home">
                <span class="logo-mark" aria-hidden="true">${LOGO_SVG}</span>
                <span class="logo-text">GORAKHPUR ZOO<small>WILD · WONDER · WANDER</small></span>
              </a>
              <p>A home for wildlife, a place for people. Explore rescued and exotic animals, interactive attractions and green spaces in the heart of Gorakhpur.</p>
              <div class="footer-social">
                <a href="#" aria-label="Facebook">${ICONS.fb}</a>
                <a href="#" aria-label="Instagram">${ICONS.ig}</a>
                <a href="#" aria-label="X (Twitter)">${ICONS.x}</a>
                <a href="#" aria-label="YouTube">${ICONS.yt}</a>
              </div>
            </div>
            <div>
              <h4>Explore</h4>
              <ul class="footer-links">
                <li><a href="${url("animals.html")}">Animals</a></li>
                <li><a href="${url("attractions.html")}">Attractions</a></li>
                <li><a href="${url("gallery.html")}">Gallery</a></li>
                <li><a href="${url("events.html")}">Events</a></li>
                <li><a href="${url("blog.html")}">Blog</a></li>
                <li><a href="${url("news.html")}">News</a></li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul class="footer-links">
                <li><a href="${url("privacy.html")}">Privacy Policy</a></li>
                <li><a href="${url("terms.html")}">Terms &amp; Conditions</a></li>
                <li><a href="${url("faq.html")}">FAQ</a></li>
                <li><a href="${url("careers.html")}">Careers</a></li>
                <li><a href="${url("feedback.html")}">Feedback</a></li>
                <li><a href="${url("rules.html")}">Zoo Rules</a></li>
              </ul>
            </div>
            <div class="footer-contact-col">
              <h4>Plan Your Visit</h4>
              <ul class="footer-contact">
                <li>${ICONS.pin}<span>Gorakhpur Zoo, Taramandal Road,<br>Gorakhpur, Uttar Pradesh 273001</span></li>
                <li>${ICONS.clock}<span>9:00 AM – 5:00 PM · Closed on Mondays</span></li>
                <li>${ICONS.phone}<span><a href="tel:+915512345678">+91 551 234 5678</a></span></li>
                <li>${ICONS.mail}<span><a href="mailto:hello@gorakhpurzoo.in">hello@gorakhpurzoo.in</a></span></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© 2026 Gorakhpur Zoo · Designed by <strong class="credit-name">Raj Gautam</strong></span>
            <span class="credit">Made with care for wildlife · <a href="${url("booking.html")}">Book your visit</a></span>
          </div>
        </div>
      </footer>`;
  }

  /* ------------------------------------------------------------ Smooth scroll */
  function initSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", id);
    });
  }

  /* ---------------------------------------------------------------- Reveal */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------------- Counters */
  function initCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    const format = (value, decimals, useComma) => {
      const fixed = value.toFixed(decimals);
      return useComma ? Number(fixed).toLocaleString("en-IN") : fixed;
    };

    const animate = (el) => {
      const target = parseFloat(el.dataset.counter || "0");
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const useComma = el.dataset.format === "comma";
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const duration = parseInt(el.dataset.duration || "1500", 10);
      const start = performance.now();

      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + format(target * eased, decimals, useComma) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      };

      if (reduceMotion) {
        el.textContent = prefix + format(target, decimals, useComma) + suffix;
      } else {
        requestAnimationFrame(frame);
      }
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach((el) => io.observe(el));
  }

  /* --------------------------------------------------------------- Parallax */
  function initParallax() {
    const layer = document.querySelector("[data-parallax]");
    if (!layer || reduceMotion) return;
    let ticking = false;
    const update = () => {
      const speed = parseFloat(layer.dataset.parallax || "0.22");
      const y = Math.min(window.scrollY * speed, 260);
      layer.style.transform = `translate3d(0, ${y}px, 0)`;
      ticking = false;
    };
    update();
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  /* ---------------------------------------------------------- Falling leaves */
  function initLeaves() {
    const layer = document.querySelector(".leaf-layer");
    if (!layer || reduceMotion) return;
    const glyphs = ["🍃", "🍂", "🍃", "🌿"];
    let markup = "";
    for (let i = 0; i < 10; i += 1) {
      const left = Math.round(Math.random() * 94);
      const size = (14 + Math.random() * 16).toFixed(0);
      const dur = (10 + Math.random() * 9).toFixed(1);
      const delay = (Math.random() * 12).toFixed(1);
      const drift = (Math.random() * 120 - 60).toFixed(0);
      const glyph = glyphs[i % glyphs.length];
      markup += `<span class="leaf" style="left:${left}%;--leaf-size:${size}px;--leaf-dur:${dur}s;--leaf-delay:-${delay}s;--leaf-x:${drift}px">${glyph}</span>`;
    }
    layer.innerHTML = markup;
  }

  /* ---------------------------------------------------------------- Lightbox */
  function initLightbox() {
    const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (!triggers.length) return;

    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image viewer">&times;</button>
      <button class="lightbox-prev" type="button" aria-label="Previous image">&#8249;</button>
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
      <button class="lightbox-next" type="button" aria-label="Next image">&#8250;</button>
      <div class="lightbox-caption" aria-live="polite"></div>`;
    document.body.appendChild(box);

    const img = box.querySelector("img");
    const caption = box.querySelector(".lightbox-caption");
    const closeBtn = box.querySelector(".lightbox-close");
    const prevBtn = box.querySelector(".lightbox-prev");
    const nextBtn = box.querySelector(".lightbox-next");
    let index = 0;
    let lastFocus = null;

    const sourceOf = (el) => {
      const nested = el.querySelector("img");
      return el.dataset.full || (nested ? nested.src : el.src);
    };
    const captionOf = (el) => {
      const nested = el.querySelector("img");
      return el.dataset.caption || (nested ? nested.alt : el.alt) || "Gorakhpur Zoo";
    };

    const show = (i) => {
      index = (i + triggers.length) % triggers.length;
      const el = triggers[index];
      img.src = sourceOf(el);
      img.alt = captionOf(el);
      caption.textContent = captionOf(el);
    };

    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    const close = () => {
      box.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    triggers.forEach((el, i) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(index - 1));
    nextBtn.addEventListener("click", () => show(index + 1));
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ------------------------------------------------------------------- FAQ */
  function initFaq() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;

      if (item.classList.contains("open")) answer.style.maxHeight = `${answer.scrollHeight}px`;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach((other) => {
          other.classList.remove("open");
          const otherBtn = other.querySelector(".faq-question");
          const otherAns = other.querySelector(".faq-answer");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          if (otherAns) otherAns.style.maxHeight = "0px";
        });
        if (!isOpen) {
          item.classList.add("open");
          button.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    });

    window.addEventListener("resize", () => {
      document.querySelectorAll(".faq-item.open .faq-answer").forEach((answer) => {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    });
  }

  /* --------------------------------------------------------- Demo form saving */
  function initDemoForms() {
    const forms = document.querySelectorAll("form[data-demo-form]");
    forms.forEach((form) => {
      const alertBox = form.querySelector(".form-alert");
      const storeKey = form.dataset.store || "gorakhpur_demo_entries";
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        data.submittedAt = new Date().toISOString();
        try {
          const existing = JSON.parse(localStorage.getItem(storeKey) || "[]");
          existing.push(data);
          localStorage.setItem(storeKey, JSON.stringify(existing));
        } catch (err) {
          console.warn("Gorakhpur Zoo: unable to save form data.", err);
        }
        if (alertBox) {
          alertBox.textContent = form.dataset.success || "Thank you! Your message has been received. Our team will get back to you soon.";
          alertBox.className = "form-alert success show";
        }
        form.reset();
        const rating = form.querySelector(".rating-input");
        if (rating) rating.querySelectorAll("input").forEach((r) => { r.checked = false; });
      });
    });
  }

  /* ------------------------------------------------------------- Quick book */
  function initQuickBook() {
    const form = document.querySelector("[data-quick-book]");
    if (!form) return;
    const adults = form.querySelector("#qbAdults");
    const children = form.querySelector("#qbChildren");
    const foreigners = form.querySelector("#qbForeigners");
    const totalEl = form.querySelector("#qbTotal");
    const note = form.querySelector("#qbNote");
    const dateInput = form.querySelector("#qbDate");

    const num = (input) => Math.max(0, parseInt(input && input.value, 10) || 0);

    const update = () => {
      const a = num(adults);
      const c = num(children);
      const f = num(foreigners);
      const count = a + c + f;
      let total = a * 50 + c * 25 + f * 400;
      let discount = 0;
      if (count >= 50) discount = 0.2;
      else if (count >= 20) discount = 0.15;
      total = Math.round(total * (1 - discount));
      if (totalEl) totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
      if (note) {
        if (count === 0) note.textContent = "Add visitors to see your total. Children under 6 enter free.";
        else if (discount) note.textContent = `${count} visitors · ${Math.round(discount * 100)}% group discount applied at checkout.`;
        else note.textContent = `${count} visitor${count > 1 ? "s" : ""} · Group discounts start at 20 visitors.`;
      }
    };

    [adults, children, foreigners].forEach((input) => {
      if (input) input.addEventListener("input", update);
    });

    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.min = today;
      if (!dateInput.value) dateInput.value = today;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (dateInput && dateInput.value) params.set("date", dateInput.value);
      const a = num(adults);
      const c = num(children);
      const f = num(foreigners);
      if (a + c + f === 0) {
        if (note) note.textContent = "Please add at least one visitor to continue.";
        if (adults) adults.focus();
        return;
      }
      params.set("adults", a);
      params.set("children", c);
      params.set("foreigners", f);
      window.location.href = `${url("booking.html")}?${params.toString()}`;
    });

    update();
  }

  /* --------------------------------------------------------- Group calculator */
  function initGroupCalculator() {
    const calc = document.querySelector("[data-group-calc]");
    if (!calc) return;
    const slider = calc.querySelector("#groupSize");
    const countEl = calc.querySelector("#groupCount");
    const subEl = calc.querySelector("#groupSubtotal");
    const discEl = calc.querySelector("#groupDiscount");
    const totalEl = calc.querySelector("#groupTotal");
    const msgEl = calc.querySelector("#groupMsg");
    if (!slider) return;

    const update = () => {
      const count = parseInt(slider.value, 10) || 1;
      const subtotal = count * 50;
      let rate = 0;
      if (count >= 50) rate = 0.2;
      else if (count >= 20) rate = 0.15;
      const discount = Math.round(subtotal * rate);
      const total = subtotal - discount;
      const fill = ((count - 1) / 99) * 100;
      slider.style.setProperty("--range-fill", `${fill}%`);
      if (countEl) countEl.innerHTML = `${count} <small>visitor${count > 1 ? "s" : ""}</small>`;
      if (subEl) subEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
      if (discEl) discEl.textContent = rate ? `− ₹${discount.toLocaleString("en-IN")}` : "₹0";
      if (totalEl) totalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
      if (msgEl) {
        if (count >= 50) msgEl.textContent = "Excellent! A 20% group discount is applied for 50+ visitors.";
        else if (count >= 20) msgEl.textContent = "Great! A 15% group discount is applied for 20+ visitors.";
        else msgEl.textContent = `${20 - count} more visitor${20 - count > 1 ? "s" : ""} to unlock a 15% group discount.`;
      }
    };

    slider.addEventListener("input", update);
    update();
  }

  /* --------------------------------------------------------------- Date min */
  function initDates() {
    const today = new Date().toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach((input) => {
      if (!input.min) input.min = today;
    });
  }

  /* --------------------------------------------------------------- Init all */
  function init() {
    buildNavbar();
    buildFooter();
    initSmoothScroll();
    initReveal();
    initCounters();
    initParallax();
    initLeaves();
    initLightbox();
    initFaq();
    initDemoForms();
    initQuickBook();
    initGroupCalculator();
    initDates();

    console.log(
      "%c🦁 GORAKHPUR ZOO %c Wild · Wonder · Wander ",
      "background:#2E7D32;color:#fff;font-weight:bold;padding:6px 10px;border-radius:6px 0 0 6px;font-family:sans-serif",
      "background:#795548;color:#fff;padding:6px 10px;border-radius:0 6px 6px 0;font-family:sans-serif"
    );
    console.log(
      "%cDesigned & developed by Raj Gautam — © 2026 Gorakhpur Zoo",
      "color:#2E7D32;font-weight:600;font-family:sans-serif"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
