/* ============================================================
   DL CONTACT — form validation, WhatsApp handoff, and business hours
   ============================================================ */
(function () {
  const form = document.getElementById("dlContactForm");
  const status = document.getElementById("dlFormStatus");

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".contact-form input, .contact-form select, .contact-form textarea")
      .forEach((el) => el.classList.remove("is-invalid"));
    const servicePicker = form && form.querySelector(".contact-select-wrap");
    if (servicePicker) servicePicker.classList.remove("is-invalid");
    const serviceTrigger = form && form.querySelector("#serviceTrigger");
    if (serviceTrigger) serviceTrigger.removeAttribute("aria-invalid");
  }

  function setError(field, msg) {
    const input = form.querySelector(`[name="${field}"]`);
    const err = document.querySelector(`[data-error-for="${field}"]`);
    if (input) input.classList.add("is-invalid");
    if (err) err.textContent = msg;
    if (field === "service") {
      const servicePicker = form.querySelector(".contact-select-wrap");
      if (servicePicker) servicePicker.classList.add("is-invalid");
      const serviceTrigger = form.querySelector("#serviceTrigger");
      if (serviceTrigger) serviceTrigger.setAttribute("aria-invalid", "true");
    }
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validatePhone(v) {
    const digits = v.replace(/[^\d]/g, "");
    return digits.length >= 7 && digits.length <= 15;
  }

  if (form) {
    const serviceSelect = form.querySelector("#service");
    const servicePicker = form.querySelector(".contact-select-wrap");
    const serviceTrigger = form.querySelector("#serviceTrigger");
    const serviceValue = form.querySelector("#serviceValue");
    const serviceList = form.querySelector("#serviceOptions");
    const serviceOptions = Array.from(serviceList.querySelectorAll('[role="option"]'));
    let activeServiceOption = -1;

    function updateServiceDisplay() {
      const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
      serviceValue.textContent = serviceSelect.value ? selectedOption.textContent : "Select a service";
      serviceTrigger.classList.toggle("is-placeholder", !serviceSelect.value);
      serviceOptions.forEach((option) => {
        option.setAttribute("aria-selected", String(option.dataset.value === serviceSelect.value));
      });
    }

    function setActiveServiceOption(index) {
      activeServiceOption = (index + serviceOptions.length) % serviceOptions.length;
      serviceOptions.forEach((option, optionIndex) => {
        option.classList.toggle("is-active", optionIndex === activeServiceOption);
      });
      const activeOption = serviceOptions[activeServiceOption];
      serviceTrigger.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    }

    function openServiceOptions(preferredIndex) {
      serviceList.hidden = false;
      serviceTrigger.setAttribute("aria-expanded", "true");
      const selectedIndex = serviceOptions.findIndex((option) => option.dataset.value === serviceSelect.value);
      const activeIndex = Number.isInteger(preferredIndex)
        ? preferredIndex
        : selectedIndex >= 0 ? selectedIndex : 0;
      setActiveServiceOption(activeIndex);
    }

    function closeServiceOptions() {
      serviceList.hidden = true;
      serviceTrigger.setAttribute("aria-expanded", "false");
      serviceTrigger.removeAttribute("aria-activedescendant");
      serviceOptions.forEach((option) => option.classList.remove("is-active"));
      activeServiceOption = -1;
    }

    function chooseServiceOption(option) {
      if (!option) return;
      serviceSelect.value = option.dataset.value;
      serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
      closeServiceOptions();
      servicePicker.classList.remove("is-invalid");
      serviceTrigger.removeAttribute("aria-invalid");
      const serviceError = form.querySelector('[data-error-for="service"]');
      if (serviceError) serviceError.textContent = "";
      serviceTrigger.focus();
    }

    updateServiceDisplay();
    serviceSelect.addEventListener("change", updateServiceDisplay);
    serviceTrigger.addEventListener("click", () => {
      if (serviceTrigger.getAttribute("aria-expanded") === "true") {
        closeServiceOptions();
      } else {
        openServiceOptions();
      }
    });
    serviceTrigger.addEventListener("keydown", (event) => {
      const isOpen = serviceTrigger.getAttribute("aria-expanded") === "true";
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (isOpen) setActiveServiceOption(activeServiceOption + 1);
          else openServiceOptions();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (isOpen) setActiveServiceOption(activeServiceOption - 1);
          else openServiceOptions(serviceOptions.length - 1);
          break;
        case "Home":
          event.preventDefault();
          if (!isOpen) openServiceOptions(0);
          else setActiveServiceOption(0);
          break;
        case "End":
          event.preventDefault();
          if (!isOpen) openServiceOptions(serviceOptions.length - 1);
          else setActiveServiceOption(serviceOptions.length - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (isOpen) chooseServiceOption(serviceOptions[activeServiceOption]);
          else openServiceOptions();
          break;
        case "Escape":
          if (isOpen) {
            event.preventDefault();
            closeServiceOptions();
          }
          break;
        case "Tab":
          closeServiceOptions();
          break;
      }
    });
    serviceOptions.forEach((option, index) => {
      option.addEventListener("mouseenter", () => setActiveServiceOption(index));
      option.addEventListener("click", () => chooseServiceOption(option));
    });
    document.addEventListener("click", (event) => {
      if (!servicePicker.contains(event.target)) closeServiceOptions();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();
      if (status) status.innerHTML = "";

      const data = new FormData(form);
      const get = (k) => (data.get(k) || "").toString().trim();

      const required = ["fullName", "phone", "email", "service", "movingFrom", "movingTo"];
      let ok = true;

      required.forEach((f) => {
        if (!get(f)) {
          setError(f, "This field is required.");
          ok = false;
        }
      });

      if (get("phone") && !validatePhone(get("phone"))) {
        setError("phone", "Please enter a valid phone number.");
        ok = false;
      }

      if (get("email") && !validateEmail(get("email"))) {
        setError("email", "Please enter a valid email address.");
        ok = false;
      }

      if (!ok) {
        if (status)
          status.innerHTML = `<div class="form-alert form-alert--error">Please correct the highlighted fields.</div>`;
        return;
      }

      const whatsappPhone = window.DL_CONFIG && DL_CONFIG.phone
        ? DL_CONFIG.phone.replace(/\D/g, "")
        : "";
      if (!/^\d{11,15}$/.test(whatsappPhone)) {
        if (status)
          status.innerHTML = `<div class="form-alert form-alert--error">The WhatsApp contact number is not configured. Please call us to request an estimate.</div>`;
        return;
      }

      const message = [
        "Hello DL Packers & Movers, I'd like to request a moving estimate.",
        "",
        `Full Name: ${get("fullName")}`,
        `Phone Number: ${get("phone")}`,
        `Email Address: ${get("email")}`,
        `Service Required: ${get("service")}`,
        `Moving From: ${get("movingFrom")}`,
        `Moving To: ${get("movingTo")}`,
        ...(get("message") ? [`Message: ${get("message")}`] : []),
      ].join("\n");
      const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      if (status) {
        status.innerHTML = `<div class="form-alert form-alert--success">Your request is ready in WhatsApp. Review the prefilled details and tap Send. If WhatsApp didn't open, <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">open it here</a>.</div>`;
      }
    });
  }

  // Populate business hours from config
  const hoursList = document.getElementById("dlHours");
  if (hoursList && window.DL_CONFIG && Array.isArray(DL_CONFIG.hours)) {
    hoursList.innerHTML = DL_CONFIG.hours
      .map((h) => `<li><span>${h.day}</span><strong>${h.time}</strong></li>`)
      .join("");
  }
})();