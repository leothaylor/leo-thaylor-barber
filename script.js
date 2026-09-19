const SITE_CONFIG = {
  whatsappUrl: "",
  instagramUrl: "https://www.instagram.com/leothaylor/"
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav ? [...nav.querySelectorAll("a")] : [];

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function closeMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    nav.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  if (SITE_CONFIG.whatsappUrl) {
    link.href = SITE_CONFIG.whatsappUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    return;
  }

  link.href = "#contato";
  link.title = "Número de WhatsApp será adicionado na próxima revisão";
});

document.querySelectorAll("[data-compare]").forEach((compare) => {
  const range = compare.querySelector(".compare-range");
  const stage = compare.querySelector(".compare-stage");

  if (!range || !stage) return;

  const update = () => {
    stage.style.setProperty("--split", `${range.value}%`);
  };

  range.addEventListener("input", update);
  update();
});

const revealItems = [...document.querySelectorAll("[data-reveal]")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
