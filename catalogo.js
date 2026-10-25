/* Catálogo estático sem backend: os PNGs são descobertos por HEAD.
   Cadastro em catalogo-dados.js; somente arquivos existentes entram na grade. */
(() => {
  "use strict";
  const all = Array.isArray(window.BARBER_CATALOG) ? window.BARBER_CATALOG : [];
  const grid = document.getElementById("catalog-grid");
  const status = document.getElementById("catalog-status");
  const empty = document.getElementById("catalog-empty");
  const emptyText = document.getElementById("catalog-empty-text");
  const search = document.getElementById("catalog-search");
  const filters = [...document.querySelectorAll("[data-category]")];
  const dialog = document.getElementById("catalog-dialog");
  const dialogImage = document.getElementById("catalog-dialog-img");
  const dialogTitle = document.getElementById("catalog-dialog-title");
  const dialogCount = document.getElementById("catalog-dialog-count");
  const close = document.getElementById("catalog-dialog-close");
  const prev = document.getElementById("catalog-dialog-prev");
  const next = document.getElementById("catalog-dialog-next");
  if (!grid || !status || !search || !dialog) return;

  const labels = { cortes: "Corte", barbas: "Barba", bigodes: "Bigode / cavanhaque", desenhos: "Desenho" };
  const path = (item) => "assets/catalogo/" + encodeURIComponent(item.file);
  const clean = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  let published = [];
  let filtered = [];
  let category = "todos";
  let selectedIndex = 0;
  let lastTrigger = null;
  let ready = false;

  async function exists(item) {
    try {
      const response = await fetch(path(item), { method: "HEAD" });
      if (response.ok) return true;
      if (response.status !== 405 && response.status !== 501) return false;
    } catch (_) { /* HEAD indisponível; tentar imagem normal. */ }
    return await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = path(item);
    });
  }

  async function discover() {
    let cursor = 0;
    const available = new Array(all.length).fill(false);
    const concurrency = Math.min(6, all.length);
    await Promise.all(Array.from({ length: concurrency }, async () => {
      while (cursor < all.length) {
        const index = cursor++;
        available[index] = await exists(all[index]);
      }
    }));
    published = all.filter((_, index) => available[index]);
    ready = true;
    render();
  }

  function card(item, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-card";
    button.setAttribute("aria-label", "Ampliar referência: " + item.title);
    const wrap = document.createElement("span");
    wrap.className = "catalog-image-wrap";
    const image = document.createElement("img");
    image.src = path(item);
    image.alt = item.title;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      published = published.filter((entry) => entry !== item);
      render();
    }, { once: true });
    wrap.append(image);
    const title = document.createElement("span");
    title.className = "catalog-card-title";
    title.textContent = item.title;
    const subtitle = document.createElement("span");
    subtitle.className = "catalog-card-subtitle";
    subtitle.textContent = (item.tags || []).map((tag) => labels[tag]).filter(Boolean).join(" · ");
    button.append(wrap, title, subtitle);
    button.addEventListener("click", () => {
      lastTrigger = button;
      open(index);
    });
    return button;
  }

  function render() {
    if (!ready) return;
    const query = clean(search.value);
    filtered = published.filter((item) =>
      (category === "todos" || item.tags.includes(category)) &&
      (!query || clean(item.title + " " + item.file + " " + item.tags.join(" ")).includes(query))
    );
    grid.replaceChildren(...filtered.map(card));
    status.textContent = filtered.length + " " + (filtered.length === 1 ? "referência disponível" : "referências disponíveis");
    empty.hidden = filtered.length !== 0;
    if (!published.length) {
      emptyText.textContent = "As referências estão sendo adicionadas ao catálogo. Enquanto isso, você pode conhecer meus trabalhos no site.";
    } else {
      emptyText.textContent = "Nenhum estilo corresponde à busca ou ao filtro selecionado.";
    }
  }

  function show(index) {
    if (!filtered.length) return;
    selectedIndex = (index + filtered.length) % filtered.length;
    const item = filtered[selectedIndex];
    dialogImage.src = path(item);
    dialogImage.alt = item.title;
    dialogTitle.textContent = item.title;
    dialogCount.textContent = (selectedIndex + 1) + " / " + filtered.length;
  }

  function open(index) {
    if (!filtered.length) return;
    show(index);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    close.focus();
  }

  function dismiss() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  filters.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.category;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    render();
  }));
  search.addEventListener("input", render);
  prev.addEventListener("click", () => show(selectedIndex - 1));
  next.addEventListener("click", () => show(selectedIndex + 1));
  close.addEventListener("click", dismiss);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dismiss(); });
  dialog.addEventListener("close", () => { if (lastTrigger?.isConnected) lastTrigger.focus(); });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowRight") { event.preventDefault(); show(selectedIndex + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(selectedIndex - 1); }
    if (event.key === "Escape" && typeof dialog.close !== "function") dismiss();
  });
  let startX = null;
  dialogImage.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) startX = event.touches[0].clientX;
  }, { passive: true });
  dialogImage.addEventListener("touchend", (event) => {
    if (startX === null || !event.changedTouches.length) return;
    const distance = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(distance) > 55) show(selectedIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  discover().catch(() => {
    ready = true;
    status.textContent = "Não foi possível verificar as imagens agora.";
    empty.hidden = false;
  });
})();
