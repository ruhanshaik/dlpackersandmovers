/* ============================================================
   DL ANIMATIONS — GSAP reveal with a dependency-free fallback
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const targets = document.querySelectorAll("h1.gsap-reveal, h2.gsap-reveal, .gsap-reveal");
  const wordsByTarget = [];

  targets.forEach((el) => {
    const raw = el.textContent.trim();
    if (!raw) return;
    el.textContent = "";
    raw.split(/\s+/).forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "gsap-word";
      span.textContent = word;
      span.style.transitionDelay = `${index * 35}ms`;
      el.append(span, document.createTextNode(" "));
    });
    wordsByTarget.push({ element: el, words: el.querySelectorAll(".gsap-word") });
  });

  function initGsap() {
    gsap.registerPlugin(ScrollTrigger);

    wordsByTarget.forEach(({ element, words }) => {
      gsap.fromTo(
        words,
        {
          opacity: 0.1,
          rotateX: 3,
          filter: "blur(4px)",
          y: 12,
        },
        {
          opacity: 1,
          rotateX: 0,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
    });
  }

  function initFallback() {
    if (!("IntersectionObserver" in window)) {
      wordsByTarget.forEach(({ words }) => words.forEach((word) => word.classList.add("is-visible")));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".gsap-word").forEach((word) => word.classList.add("is-visible"));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    wordsByTarget.forEach(({ element }) => observer.observe(element));
  }

  if (window.gsap && window.ScrollTrigger) {
    initGsap();
  } else {
    initFallback();
  }
})();