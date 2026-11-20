/* ============================================================
   DL SHARED HEADER — inject, sticky state, active link, menu
   ============================================================ */
(function () {
  const mount = document.getElementById("dl-header-mount");
  if (!mount) return;

  const fallbackHeader = `
    <header id="dl-header" class="dl-header">
      <nav class="dl-header__nav" aria-label="Primary navigation">
        <a href="index.html" class="dl-header__brand" aria-label="DL Packers and Movers — Home">
          <img src="assets/images/brand-logo.png" alt="DL Packers &amp; Movers logo" class="dl-header__logo" width="68" height="48">
          <span class="dl-header__brand-text">Packers &amp;<br>Movers</span>
        </a>
        <button class="dl-header__toggle" id="dlMenuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="dlMenu" type="button">
          <span class="dl-header__hamburger"><span></span><span></span></span>
        </button>
        <div class="dl-header__menu" id="dlMenu">
          <ul class="dl-header__links">
            <li><a href="index.html" data-nav="index.html">Home</a></li>
            <li><a href="about.html" data-nav="about.html">About</a></li>
            <li><a href="services.html" data-nav="services.html">Services</a></li>
            <li><a href="contact.html" data-nav="contact.html">Contact</a></li>
          </ul>
          <a href="contact.html#quote" class="btn btn--primary dl-header__cta">Get a Quote</a>
        </div>
      </nav>
    </header>`;

  function renderHeader(html) {
    mount.innerHTML = html;
    initHeader();
  }

  if (location.protocol === "file:") {
    renderHeader(fallbackHeader);
  } else {
    fetch("partials/header.html")
      .then((response) => {
        if (!response.ok) throw new Error(`Header request failed: ${response.status}`);
        return response.text();
      })
      .then(renderHeader)
      .catch((error) => {
        console.error("Unable to load the shared header; using the built-in header.", error);
        renderHeader(fallbackHeader);
      });
  }

  function initHeader() {
    const header = document.getElementById("dl-header");
    const toggle = document.getElementById("dlMenuToggle");
    const menu = document.getElementById("dlMenu");
    if (!header || !toggle || !menu) return;

    // Active link highlighting
    const page = location.pathname.split("/").pop() || "index.html";
    header.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === page) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
    });

    // Add a subtle shadow once the page scrolls.
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("dl-menu-open", open);
    });

    // Close on link click (mobile)
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("dl-menu-open");
      });
    });
  }
})();