/* ============================================================
   DL MAIN — bootstrap shared logic
   ============================================================ */
(function () {
  // Populate phone links from config
  if (window.DL_CONFIG) {
    const tel = DL_CONFIG.phone.replace(/[^+\d]/g, "");
    document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
      a.href = `tel:${tel}`;
    });
  }

  // Simple reveal-on-scroll (GSAP upgrade comes in Chunk 3)
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && els.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("is-visible"));
  }
})();