/* =========================================================
   JONATHAN MELLO | BARBEIRO PROFISSIONAL — interações
   Todos os dados editáveis ficam em js/config.js
   ========================================================= */
(() => {
  "use strict";

  const C = window.SITE_CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Um valor só é considerado "real" se não estiver vazio nem for placeholder */
  const has = (v) => typeof v === "string" && v.trim() !== "" && !/^(INSERIR|\[)/i.test(v.trim());

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  };

  /* =========================================================
     AGENDAMENTO — todos os CTAs usam BOOKING_URL
     ========================================================= */
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid;

  const bookingUrl = () => {
    if (isIOS && has(C.BOOKING_URL_IOS)) return C.BOOKING_URL_IOS;
    if (isAndroid && has(C.BOOKING_URL_ANDROID)) return C.BOOKING_URL_ANDROID;
    return has(C.BOOKING_URL) ? C.BOOKING_URL : "";
  };

  /* Tenta abrir o app instalado (deep link); se não abrir, segue para o link web/loja */
  const openWithDeepLink = (fallback) => {
    let left = false;
    const onHide = () => { if (document.hidden) left = true; };
    document.addEventListener("visibilitychange", onHide);
    window.location.href = C.APP_DEEP_LINK;
    setTimeout(() => {
      document.removeEventListener("visibilitychange", onHide);
      if (!left && fallback) window.location.href = fallback;
    }, 1500);
  };

  /* Modal de escolha da loja: usado quando não há link direto para o dispositivo
     (ex.: computador) mas existem links da App Store / Google Play */
  const modal = $("#app-modal");
  const storeLinks = { ios: C.BOOKING_URL_IOS, android: C.BOOKING_URL_ANDROID };
  const hasStores = has(storeLinks.ios) || has(storeLinks.android);
  $$("[data-store]", modal).forEach((s) => {
    const href = storeLinks[s.dataset.store];
    if (has(href)) s.href = href; else s.hidden = true;
  });
  let modalReturn = null;
  function openModal(from) {
    modalReturn = from;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    $(".app-modal__close", modal).focus();
  }
  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { modal.hidden = true; }, 300);
    modalReturn && modalReturn.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".app-modal__close")) closeModal(); });

  const url = bookingUrl();
  $$("[data-booking]").forEach((a) => {
    if (url) {
      a.href = url;
      /* No celular abre na mesma aba (necessário para links universais abrirem o app) */
      if (!isMobile) { a.target = "_blank"; a.rel = "noopener"; }
    } else {
      a.href = "#agendar";
      if (hasStores) a.setAttribute("aria-haspopup", "dialog");
    }
    a.addEventListener("click", (e) => {
      closeMenu();
      if (!url && hasStores) {
        e.preventDefault();
        openModal(a);
        return;
      }
      if (!url && !has(C.APP_DEEP_LINK)) {
        e.preventDefault();
        toast("Link do aplicativo de agendamento ainda não configurado.");
        return;
      }
      if (isMobile && has(C.APP_DEEP_LINK)) {
        e.preventDefault();
        openWithDeepLink(url);
      }
    });
  });

  /* =========================================================
     DADOS EDITÁVEIS
     ========================================================= */
  $$("[data-config]").forEach((el) => {
    const v = C[el.dataset.config];
    if (has(v)) { el.textContent = v; el.classList.remove("is-placeholder"); }
    else { el.textContent = el.dataset.placeholder || ""; el.classList.add("is-placeholder"); }
  });

  /* Instagram e WhatsApp */
  const links = {
    INSTAGRAM: has(C.INSTAGRAM_URL) ? C.INSTAGRAM_URL : "",
    WHATSAPP: has(C.WHATSAPP_NUMBER)
      ? `https://wa.me/${C.WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(C.WHATSAPP_MESSAGE || "")}`
      : "",
  };
  $$("[data-link]").forEach((a) => {
    const href = links[a.dataset.link];
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
    else {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        toast(`${a.dataset.link === "INSTAGRAM" ? "Instagram" : "WhatsApp"} ainda não configurado.`);
      });
    }
  });
  if (has(C.INSTAGRAM_URL) && !has(C.INSTAGRAM_HANDLE)) {
    $$('[data-config="INSTAGRAM_HANDLE"]').forEach((el) => { el.textContent = "Instagram"; el.classList.remove("is-placeholder"); });
  }
  if (has(C.WHATSAPP_NUMBER) && !has(C.WHATSAPP_DISPLAY)) {
    $$('[data-config="WHATSAPP_DISPLAY"]').forEach((el) => { el.textContent = "WhatsApp"; el.classList.remove("is-placeholder"); });
  }

  /* Horários */
  const hoursList = $("#hours-list");
  const hours = Array.isArray(C.HOURS) && C.HOURS.length ? C.HOURS : [{ days: "", time: "" }];
  hoursList.innerHTML = "";
  hours.forEach((h) => {
    const li = document.createElement("li");
    const d = document.createElement("span");
    const t = document.createElement("span");
    d.textContent = has(h.days) ? h.days : "[Dias de funcionamento]";
    t.textContent = has(h.time) ? h.time : "[Horário]";
    if (!has(h.days)) d.classList.add("is-placeholder");
    if (!has(h.time)) t.classList.add("is-placeholder");
    li.append(d, t);
    hoursList.append(li);
  });

  /* Mapa + Como chegar */
  const mapQuery = has(C.MAPS_QUERY) ? C.MAPS_QUERY : has(C.ADDRESS) ? C.ADDRESS : "";
  const directions = $("#directions-btn");
  if (mapQuery) {
    const q = encodeURIComponent(mapQuery);
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
    const map = $("#map");
    const loadMap = () => {
      map.innerHTML = `<iframe title="Mapa: localização do Jonathan Mello" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${q}&output=embed"></iframe>`;
    };
    /* carrega o iframe só quando estiver perto da tela (performance) */
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((en) => en.isIntersecting)) { loadMap(); io.disconnect(); }
      }, { rootMargin: "400px" });
      io.observe(map);
    } else loadMap();
  } else {
    directions.addEventListener("click", (e) => {
      e.preventDefault();
      toast("Endereço ainda não configurado.");
    });
  }

  /* Avaliações */
  const grid = $("#testimonials-grid");
  const reviews = Array.isArray(C.TESTIMONIALS) ? C.TESTIMONIALS.filter((r) => r && has(r.text)) : [];
  const star = (on) => `<svg class="ico ${on ? "on" : "off"}" aria-hidden="true"><use href="#i-star"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  if (!reviews.length && C.HIDE_EMPTY_TESTIMONIALS) {
    $("#avaliacoes").hidden = true;
  } else {
    const items = reviews.length ? reviews : [null, null, null];
    grid.innerHTML = items.map((r, i) => {
      if (!r) {
        return `<article class="t-card t-card--empty reveal" style="--d:${i * 0.1}s">
          <div class="t-stars" aria-label="Espaço para nota em estrelas">${star(false).repeat(5)}</div>
          <p class="t-text">[ Espaço reservado para uma avaliação real de cliente ]</p>
          <p class="t-name">[ Nome do cliente ]</p>
        </article>`;
      }
      const n = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 5)));
      return `<article class="t-card reveal" style="--d:${i * 0.1}s">
        <div class="t-stars" role="img" aria-label="Nota ${n} de 5">${star(true).repeat(n)}${star(false).repeat(5 - n)}</div>
        <p class="t-text">${esc(r.text)}</p>
        <p class="t-name">${esc(r.name || "")}</p>
      </article>`;
    }).join("");
  }

  /* =========================================================
     HEADER / MENU
     ========================================================= */
  const header = $("#header");
  const burger = $("#burger");
  const menu = $("#mobile-menu");

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
    header.classList.add("is-scrolled");
    sticky && sticky.classList.remove("is-visible");
  }
  function closeMenu() {
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
    onScroll();
  }
  burger.addEventListener("click", () => (menu.classList.contains("is-open") ? closeMenu() : openMenu()));
  $$(".mobile-menu__nav a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeLightbox(); closeModal(); } });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (m) => m.matches && closeMenu());

  /* Fundo do header + botão fixo */
  const hero = $("#inicio");
  const finalCta = $("#agendar");
  const sticky = $("#sticky-book");
  let finalInView = false;

  function onScroll() {
    const y = window.scrollY;
    if (!menu.classList.contains("is-open")) header.classList.toggle("is-scrolled", y > 24);
    const pastHero = y > hero.offsetHeight * 0.55;
    sticky.classList.toggle("is-visible", pastHero && !finalInView && !menu.classList.contains("is-open"));
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { finalInView = en.isIntersecting; onScroll(); }, { threshold: 0.35 }).observe(finalCta);
  }

  /* Link ativo do menu */
  const navLinks = $$(".nav__link");
  const sections = navLinks.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  function setActive() {
    const mid = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((s) => { if (s.offsetTop <= mid) current = s; });
    navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + current.id));
  }

  /* Parallax leve no CTA final */
  const finalImg = $(".final-cta__media img");
  function parallax() {
    if (reduceMotion || !finalImg) return;
    const r = finalCta.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
    finalImg.style.transform = `translate3d(0, ${(-7 + p * 10).toFixed(2)}%, 0)`;
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); setActive(); parallax(); ticking = false; });
  }, { passive: true });
  onScroll(); setActive(); parallax();

  /* =========================================================
     FAQ — acordeão (um aberto por vez)
     ========================================================= */
  const accs = $$(".acc");
  accs.forEach((acc) => {
    const btn = $(".acc__btn", acc);
    btn.addEventListener("click", () => {
      const open = !acc.classList.contains("is-open");
      accs.forEach((o) => { o.classList.remove("is-open"); $(".acc__btn", o).setAttribute("aria-expanded", "false"); });
      if (open) { acc.classList.add("is-open"); btn.setAttribute("aria-expanded", "true"); }
    });
  });

  /* =========================================================
     ANIMAÇÕES DE ENTRADA
     ========================================================= */
  const reveals = $$(".reveal");
  /* atraso escalonado para itens irmãos em grids */
  $$(".services__grid, .diffs__cards, .gallery__grid").forEach((g) =>
    [...g.children].forEach((c, i) => c.style.setProperty("--d", `${(i % 4) * 0.09}s`)));

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================================================
     LIGHTBOX DA GALERIA
     ========================================================= */
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $("figcaption", lb);
  let lastFocus = null;

  function openLightbox(btn) {
    const img = $("img", btn);
    lastFocus = btn;
    lbImg.src = img.currentSrc || img.src;
    lbImg.src = lbImg.src.replace(/([?&])w=\d+/, "$1w=1600").replace(/&h=\d+/, "");
    lbImg.alt = img.alt;
    lbCap.textContent = btn.dataset.caption || "";
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    $(".lightbox__close", lb).focus();
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; lbImg.src = ""; }, 300);
    lastFocus && lastFocus.focus();
  }
  $$(".g-btn").forEach((b) => b.addEventListener("click", () => openLightbox(b)));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lightbox__close")) closeLightbox(); });

  /* Ano no rodapé */
  $("#year").textContent = new Date().getFullYear();
})();
