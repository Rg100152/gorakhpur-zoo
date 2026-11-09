/* ==========================================================================
   Gorakhpur Zoo — Booking engine (localStorage demo)
   Author: Raj Gautam
   ========================================================================== */
(() => {
  "use strict";

  const STORAGE_KEY = "gorakhpur_bookings";
  const PRICES = { adult: 50, child: 25, foreign: 400 };
  const $ = (id) => document.getElementById(id);

  const form = $("bookingForm");
  if (!form) return;

  const els = {
    name: $("fullName"),
    phone: $("phone"),
    email: $("email"),
    date: $("visitDate"),
    type: $("bookingType"),
    adults: $("adults"),
    children: $("children"),
    foreigners: $("foreigners"),
    alert: $("bookingAlert"),
    submit: $("bookingSubmit"),
    summaryDate: $("summaryDate"),
    summaryType: $("summaryType"),
    summaryAdults: $("summaryAdults"),
    summaryChildren: $("summaryChildren"),
    summaryForeigners: $("summaryForeigners"),
    summaryCount: $("summaryCount"),
    summarySubtotal: $("summarySubtotal"),
    summaryDiscount: $("summaryDiscount"),
    summaryDiscountRow: $("summaryDiscountRow"),
    summaryTotal: $("summaryTotal"),
    modal: $("successModal"),
    ticketName: $("ticketName"),
    ticketDate: $("ticketDate"),
    ticketVisitors: $("ticketVisitors"),
    ticketId: $("ticketId"),
    ticketAmount: $("ticketAmount"),
    ticketType: $("ticketType"),
    ticketQr: $("ticketQr"),
  };

  const todayISO = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const num = (input) => Math.max(0, Math.min(100, parseInt(input && input.value, 10) || 0));
  const money = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;
  const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

  function readBookings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function calculate() {
    const adults = num(els.adults);
    const children = num(els.children);
    const foreigners = num(els.foreigners);
    const count = adults + children + foreigners;
    const subtotal = adults * PRICES.adult + children * PRICES.child + foreigners * PRICES.foreign;
    let rate = 0;
    if (count >= 50) rate = 0.2;
    else if (count >= 20) rate = 0.15;
    const discount = Math.round(subtotal * rate);
    const total = subtotal - discount;
    return { adults, children, foreigners, count, subtotal, rate, discount, total };
  }

  function formatDate(value) {
    if (!value) return "Select a date";
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  }

  function updateSummary() {
    const c = calculate();
    if (els.summaryDate) els.summaryDate.textContent = formatDate(els.date && els.date.value);
    if (els.summaryType) els.summaryType.textContent = els.type && els.type.value === "Foreign" ? "Foreign visitor" : "Indian visitor";
    if (els.summaryAdults) els.summaryAdults.textContent = `${c.adults} × ${money(PRICES.adult)}`;
    if (els.summaryChildren) els.summaryChildren.textContent = `${c.children} × ${money(PRICES.child)}`;
    if (els.summaryForeigners) els.summaryForeigners.textContent = `${c.foreigners} × ${money(PRICES.foreign)}`;
    if (els.summaryCount) els.summaryCount.textContent = `${c.count} visitor${c.count === 1 ? "" : "s"}`;
    if (els.summarySubtotal) els.summarySubtotal.textContent = money(c.subtotal);
    if (els.summaryDiscountRow) els.summaryDiscountRow.style.display = c.discount > 0 ? "flex" : "none";
    if (els.summaryDiscount) els.summaryDiscount.textContent = `− ${money(c.discount)}`;
    if (els.summaryTotal) els.summaryTotal.textContent = money(c.total);
  }

  function setAlert(message, type) {
    if (!els.alert) return;
    if (!message) {
      els.alert.className = "form-alert";
      els.alert.textContent = "";
      return;
    }
    els.alert.textContent = message;
    els.alert.className = `form-alert ${type || "success"} show`;
  }

  function makeQr(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rand = () => {
      h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
      return (h >>> 0) / 4294967296;
    };
    const size = 21;
    const offset = 4;
    const inFinder = (x, y) => (
      (x < 7 && y < 7) ||
      (x > size - 8 && y < 7) ||
      (x < 7 && y > size - 8)
    );
    let dots = "";
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (inFinder(x, y)) continue;
        if (rand() < 0.46) dots += `<rect x="${x + offset}" y="${y + offset}" width="1" height="1"/>`;
      }
    }
    const finder = (fx, fy) => {
      const base = `<rect x="${fx + offset}" y="${fy + offset}" width="7" height="7"/>`;
      const hole = `<rect x="${fx + offset + 1}" y="${fy + offset + 1}" width="5" height="5" fill="#fff"/>`;
      const core = `<rect x="${fx + offset + 2}" y="${fy + offset + 2}" width="3" height="3"/>`;
      return base + hole + core;
    };
    let timing = "";
    for (let i = 8; i < size - 8; i += 2) {
      if (i !== 6) {
        timing += `<rect x="${i + offset}" y="${6 + offset}" width="1" height="1"/>`;
        timing += `<rect x="${6 + offset}" y="${i + offset}" width="1" height="1"/>`;
      }
    }
    return `<svg viewBox="0 0 29 29" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mock QR code for booking ${seed}"><rect width="29" height="29" fill="#fff"/><g fill="#143d1a">${dots}${timing}${finder(0, 0)}${finder(size - 7, 0)}${finder(0, size - 7)}</g></svg>`;
  }

  function showModal(booking) {
    if (els.ticketName) els.ticketName.textContent = booking.name;
    if (els.ticketDate) els.ticketDate.textContent = formatDate(booking.date);
    if (els.ticketVisitors) {
      els.ticketVisitors.textContent = `${booking.tickets} visitor${booking.tickets === 1 ? "" : "s"}`;
    }
    if (els.ticketId) els.ticketId.textContent = booking.id;
    if (els.ticketAmount) els.ticketAmount.textContent = money(booking.total);
    if (els.ticketType) els.ticketType.textContent = booking.type === "Foreign" ? "Foreign" : "Indian";
    if (els.ticketQr) els.ticketQr.innerHTML = makeQr(booking.id);
    if (!els.modal) return;
    els.modal.classList.add("open");
    els.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = els.modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!els.modal) return;
    els.modal.classList.remove("open");
    els.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function resetForm() {
    form.reset();
    if (els.date) els.date.value = todayISO();
    if (els.type) els.type.value = "Indian";
    if (els.adults) els.adults.value = "2";
    if (els.children) els.children.value = "0";
    if (els.foreigners) els.foreigners.value = "0";
    setAlert("");
    updateSummary();
  }

  function prefillFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const date = params.get("date");
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      if (els.date) els.date.value = date;
    }
    ["adults", "children", "foreigners"].forEach((key) => {
      const value = params.get(key);
      if (value !== null && els[key]) {
        const n = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
        els[key].value = String(n);
      }
    });
  }

  form.addEventListener("input", () => {
    updateSummary();
    if (els.alert && els.alert.classList.contains("error")) setAlert("");
  });
  form.addEventListener("change", () => {
    updateSummary();
    if (els.alert && els.alert.classList.contains("error")) setAlert("");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setAlert("");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const c = calculate();
    if (c.count < 1) {
      setAlert("Please add at least one visitor to confirm your booking.", "error");
      if (els.adults) els.adults.focus();
      return;
    }

    const date = els.date ? els.date.value : "";
    if (!date || date < todayISO()) {
      setAlert("Please choose today or a future visit date.", "error");
      if (els.date) els.date.focus();
      return;
    }

    const name = (els.name ? els.name.value : "").trim();
    const phone = (els.phone ? els.phone.value : "").trim();
    const email = (els.email ? els.email.value : "").trim();
    const type = els.type ? els.type.value : "Indian";

    const bookings = readBookings();
    const phoneKey = normalizePhone(phone);
    const duplicate = bookings.find((b) => normalizePhone(b.phone) === phoneKey && b.date === date);
    if (duplicate) {
      setAlert(`A booking already exists for this phone number on ${formatDate(date)}. Your booking ID is ${duplicate.id}. Please choose another date or contact us for help.`, "error");
      return;
    }

    let id = "";
    do {
      id = `ZOO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (bookings.some((b) => b.id === id));

    const booking = {
      id,
      name,
      phone,
      email,
      date,
      type,
      adults: c.adults,
      children: c.children,
      foreigners: c.foreigners,
      tickets: c.count,
      subtotal: c.subtotal,
      discount: c.discount,
      discountRate: c.rate,
      total: c.total,
      createdAt: new Date().toISOString(),
    };

    try {
      bookings.push(booking);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      setAlert("We could not save your booking in this browser. Please check your storage settings and try again.", "error");
      return;
    }

    if (els.submit) {
      els.submit.disabled = true;
      els.submit.textContent = "Booking confirmed ✓";
      window.setTimeout(() => {
        els.submit.disabled = false;
        els.submit.textContent = "Confirm Booking";
      }, 2200);
    }

    showModal(booking);
    if (els.alert) {
      els.alert.textContent = `Booking confirmed! Your ID is ${booking.id}.`;
      els.alert.className = "form-alert success show";
    }
  });

  if (els.modal) {
    els.modal.addEventListener("click", (e) => {
      if (e.target === els.modal) closeModal();
    });
    els.modal.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeModal();
        if (btn.dataset.reset === "true") resetForm();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && els.modal.classList.contains("open")) closeModal();
    });
  }

  const printBtn = $("printTicket");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  if (els.date) {
    els.date.min = todayISO();
    if (!els.date.value) els.date.value = todayISO();
  }

  prefillFromUrl();
  updateSummary();
})();
