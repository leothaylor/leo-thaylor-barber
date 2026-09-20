const SITE_CONFIG = {
  whatsappNumber: "",
  instagramUrl: "https://www.instagram.com/leothaylor/",
  whatsappMessages: {
    barbearia: "Oi, Leo. Vim pelo site e queria confirmar se você está atendendo agora na barbearia.",
    domicilio: "Oi, Leo. Vim pelo site e queria consultar disponibilidade para atendimento em domicílio.",
    geral: "Oi, Leo. Vim pelo site e queria falar com você."
  }
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav ? [...nav.querySelectorAll("a")] : [];


document.querySelectorAll("[data-site-asset]").forEach((image) => {
  const markLoaded = () => image.classList.add("is-loaded");
  const markMissing = () => image.classList.remove("is-loaded");

  image.addEventListener("load", markLoaded);
  image.addEventListener("error", markMissing);

  if (image.complete) {
    if (image.naturalWidth > 0) markLoaded();
    else markMissing();
  }
});

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

function buildWhatsAppUrl(intent = "geral") {
  const number = String(SITE_CONFIG.whatsappNumber || "").replace(/\D/g, "");
  const message = SITE_CONFIG.whatsappMessages[intent] || SITE_CONFIG.whatsappMessages.geral;

  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-whatsapp-intent]").forEach((link) => {
  const intent = link.dataset.whatsappIntent || "geral";
  const url = buildWhatsAppUrl(intent);

  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
    return;
  }

  link.href = "#contato";
  link.title = "Número de WhatsApp será adicionado na próxima revisão";
});

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  const url = buildWhatsAppUrl("geral");

  if (url) {
    link.href = url;
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


const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const galleryImages = [...document.querySelectorAll("[data-gallery-image]")];

function openLightbox(image) {
  if (!lightbox || !lightboxImage || !image || image.naturalWidth === 0) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Trabalho ampliado";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImage.removeAttribute("src");
}

galleryImages.forEach((image) => {
  image.addEventListener("click", () => openLightbox(image));
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});
