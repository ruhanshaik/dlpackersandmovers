/* ============================================================
   DL LOADER — type the brand name, then reveal the page
   ============================================================ */
(function () {
  const loader = document.getElementById("dl-loader");
  if (!loader) return;

  const text = loader.querySelector(".dl-loader__typing") || loader.querySelector(".dl-loader__text");
  const message = "Packers & Movers";
  const hideLoader = () => {
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 500);
  };

  if (!text) {
    console.error("DL loader text element is missing.");
    hideLoader();
    return;
  }

  let characterCount = 0;
  const typingTimer = window.setInterval(() => {
    characterCount += 1;
    text.textContent = message.slice(0, characterCount);

    if (characterCount >= message.length) {
      window.clearInterval(typingTimer);
      window.setTimeout(hideLoader, 350);
    }
  }, 70);
})();