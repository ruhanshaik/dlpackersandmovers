/* ============================================================
   DL SHARED FOOTER — inject, populate from config, parallax
   ============================================================ */
(function () {
  const mount = document.getElementById("dl-footer-mount");
  if (!mount) return;

  const fallbackFooter = `
    <footer class="dl-footer">
      <div class="dl-footer__bg" aria-hidden="true"></div>
      <div class="dl-footer__card-wrap">
        <div class="dl-footer__card">
          <div class="dl-footer__top">
            <div class="dl-footer__brand">
              <div class="dl-footer__brand-row">
                <div class="dl-footer__logo-tile"><img src="assets/images/brand-logo.png" alt="DL Packers &amp; Movers logo" loading="lazy" decoding="async"></div>
                <span class="dl-footer__wordmark">Packers &amp; Movers</span>
              </div>
              <p class="dl-footer__desc" id="dlFooterDesc"></p>
            </div>
            <div class="dl-footer__columns">
              <div class="dl-footer__col"><h4>Company</h4><ul>
                <li><a href="index.html">Home</a></li><li><a href="about.html">About Us</a></li>
                <li><a href="services.html">Services</a></li><li><a href="contact.html">Contact Us</a></li>
              </ul></div>
              <div class="dl-footer__col"><h4>Our Services</h4><ul id="dlFooterServices"></ul></div>
              <div class="dl-footer__col"><h4>Contact</h4><ul id="dlFooterContact"></ul></div>
            </div>
          </div>
          <div class="dl-footer__bottom">
            <p id="dlFooterCopy"></p>
            <p class="dl-footer__credit">Built with <span class="dl-footer__heart" aria-label="love">♥</span> by <a href="https://gmitech.in/">gmitech.in</a></p>
            <div class="dl-footer__legal">
              <a href="terms-and-conditions.html">Terms &amp; Conditions</a><span aria-hidden="true">·</span>
              <a href="privacy-policy.html">Privacy Policy</a>
            </div>
            <div class="dl-footer__social" id="dlFooterSocial" aria-label="Contact and social links"></div>
          </div>
        </div>
      </div>
      <div class="dl-footer__truck-layer" aria-hidden="true">
        <img src="assets/images/parallax-truck.png" alt="" class="dl-footer__truck" loading="lazy" decoding="async" onerror="this.style.display='none'">
      </div>
    </footer>`;

  function renderFooter(html) {
    mount.innerHTML = html;
    populateFooter();
    initParallaxTruck();
    const card = mount.querySelector(".dl-footer__card");
    if (card) requestAnimationFrame(() => card.classList.add("is-visible"));
  }

  if (location.protocol === "file:") {
    renderFooter(fallbackFooter);
  } else {
    fetch("partials/footer.html")
      .then((response) => {
        if (!response.ok) throw new Error(`Footer request failed: ${response.status}`);
        return response.text();
      })
      .then(renderFooter)
      .catch((error) => {
        console.error("Unable to load the shared footer; using the built-in footer.", error);
        renderFooter(fallbackFooter);
      });
  }

  function populateFooter() {
    const cfg = window.DL_CONFIG || {};

    // Description
    const desc = document.getElementById("dlFooterDesc");
    if (desc) desc.textContent = cfg.footerDescription || "";

    // Services column
    const svc = document.getElementById("dlFooterServices");
    if (svc && cfg.footerServices) {
      svc.innerHTML = cfg.footerServices
        .map((s) => `<li><a href="services.html">${s}</a></li>`)
        .join("");
    }

    // Contact column
    const contact = document.getElementById("dlFooterContact");
    if (contact) {
      const locationItem = cfg.locationUrl
        ? `<li><a href="${cfg.locationUrl}" target="_blank" rel="noopener noreferrer">${cfg.location || ""}</a></li>`
        : `<li><span>${cfg.location || ""}</span></li>`;
      contact.innerHTML = `
        ${locationItem}
        <li><a href="tel:${(cfg.phone || "").replace(/[^+\d]/g, "")}">${cfg.phoneDisplay || ""}</a></li>
        <li><a href="mailto:${cfg.email || ""}">${cfg.emailDisplay || ""}</a></li>
      `;
    }

    // Contact and social icons (inline SVG, no external deps)
    const social = document.getElementById("dlFooterSocial");
    if (social) {
      const phone = (cfg.phone || "").replace(/[^+\d]/g, "");
      const whatsappPhone = phone.replace(/\D/g, "");
      const whatsappHref =
        /^\d{11,15}$/.test(whatsappPhone) ? `https://wa.me/${whatsappPhone}` : "contact.html";
      const icons = [
        {
          label: "Call us",
          href: `tel:${phone}`,
          svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.18 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92Z"/></svg>`,
        },
        {
          label: "WhatsApp",
          href: whatsappHref,
          svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.5 7.5L4 20.5l1-3.7a8.5 8.5 0 1 1 15.5-5Z"/><path d="M9 8.5c.4 2.4 2.1 4.2 4.5 5l1.2-1 2 1c-.2 1.3-.9 2-2 2-3.2-.4-6.3-3.5-6.7-6.7 0-1.1.7-1.8 2-2l1 2-1 1.2"/></svg>`,
        },
        {
          label: "Email us",
          href: `mailto:${cfg.email || ""}`,
          svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
        },
        {
          label: "Instagram",
          href: (cfg.social && cfg.social.instagram) || "#",
          svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
        },
      ];

      social.innerHTML = icons
        .map(({ label, href, svg }) => `<a href="${href}" aria-label="${label}" class="dl-footer__social-link">${svg}</a>`)
        .join("");
    }

    // Copyright
    const copy = document.getElementById("dlFooterCopy");
    if (copy) {
      copy.textContent = `© ${cfg.copyrightYear || new Date().getFullYear()} ${cfg.businessName || "DL Packers & Movers"}. All Rights Reserved.`;
    }
  }

  /* Scroll-linked parallax for truck layer — vanilla port of
     useScroll + useTransform([0,1] → [-50, 150]) */
  function initParallaxTruck() {
    const footer = document.querySelector(".dl-footer");
    const layer  = document.querySelector(".dl-footer__truck-layer");
    if (!footer || !layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ticking = false;
    const minY = -50;
    const maxY = 150;

    function update() {
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress 0 → footer just enters view; 1 → footer fully scrolled past
      const total = rect.height + vh;
      const passed = vh - rect.top;
      let progress = passed / total;
      progress = Math.min(1, Math.max(0, progress));

      const y = minY + (maxY - minY) * progress;
      layer.style.transform = `translate3d(0, ${y}px, 0)`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }
})();