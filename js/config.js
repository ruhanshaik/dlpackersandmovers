/* ============================================================
   DL PACKERS & MOVERS — GLOBAL CONFIG
   Edit values here once. They propagate to header, footer,
   contact section, and phone/email links across all pages.
   ============================================================ */

const DL_CONFIG = {
  businessName: "DL Packers & Movers",
  shortName: "Packers & Movers",

  // ---- CONTACT DETAILS ----
  phone: "+91-70198-06135",
  phoneDisplay: "+91 70198 06135",
  email: "dlpackersandmovers@gmail.com",
  emailDisplay: "dlpackersandmovers@gmail.com",

  location: "Beside Taj Chicken Center, Jagruthi Nagar, Cowl Bazar, Ballari",
  locationUrl: "https://maps.app.goo.gl/5sxPSaFrLR5SHPjj7",

  hours: [
    { day: "Monday – Saturday", time: "9:00 AM – 7:00 PM" },
    { day: "Sunday", time: "By appointment" },
  ],

  social: {
    facebook:  "#",
    instagram: "#",
    twitter:   "#",
    linkedin:  "#",
    youtube:   "#",
  },

  // ---- NAVIGATION ----
  nav: [
    { label: "Home",     href: "index.html" },
    { label: "About",    href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Contact",  href: "contact.html" },
  ],

  // ---- FOOTER COLUMNS ----
  footerServices: [
    "Household Shifting",
    "Office Relocation",
    "Local Shifting",
    "Domestic Relocation",
    "Packing Services",
    "Loading and Unloading",
  ],

  footerDescription:
    "A professional relocation service based in Ballari, Karnataka, offering careful packing, safe handling, and organised transportation for homes and offices.",

  copyrightYear: 2026,
};

// Freeze to prevent accidental mutation
Object.freeze(DL_CONFIG);
window.DL_CONFIG = DL_CONFIG;