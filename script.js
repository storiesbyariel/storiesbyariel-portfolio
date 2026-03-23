/* =============================================
   Stories by Ariel — Portfolio Logic
   =============================================
   All content is driven by assets/content.json.

   Layout types:
   - "grid"    → flat photo grid (Headshots)
   - "sidebar" → left sidebar nav with grouped sections (Events)
   - "cities"  → horizontal city/location nav with grouped sections (Moments, Places)
   - "blog"    → journal-style posts with large images and text (Personal)

   Photo metadata (title, description, camera, lens) displays
   in the lightbox when viewing a single image.
   ============================================= */

let CATEGORIES = [];

// ---- DOM refs ----
const homeView = document.getElementById("home-view");
const galleryView = document.getElementById("gallery-view");
const contactView = document.getElementById("contact-view");
const categoryGrid = document.getElementById("category-grid");
const galleryBody = document.getElementById("gallery-body");
const galleryTitle = document.getElementById("gallery-title");
const backBtn = document.getElementById("back-btn");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbClose = document.getElementById("lb-close");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");
const lbCounter = document.getElementById("lb-counter");
const lbMeta = document.getElementById("lb-meta");

let currentImages = []; // array of image objects { src, title, description, camera, lens, caption }
let currentIndex = 0;

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();

// ---- View management ----
function hideAllViews() {
  homeView.classList.add("hidden");
  galleryView.classList.add("hidden");
  contactView.classList.add("hidden");
}

function showHome(pushState = true) {
  hideAllViews();
  homeView.classList.remove("hidden");
  window.scrollTo(0, 0);
  if (pushState) {
    history.pushState({ view: "home" }, "", window.location.pathname);
  }
}

function showContact(pushState = true) {
  hideAllViews();
  contactView.classList.remove("hidden");
  window.scrollTo(0, 0);
  if (pushState) {
    history.pushState({ view: "contact" }, "", "#contact");
  }
}

// ---- Helpers ----
function getGroupImages(group) {
  if (group.images) return group.images;
  if (group.subgroups) return group.subgroups.flatMap((sg) => sg.images);
  return [];
}

function getAllImageObjects(cat) {
  if (cat.images) return cat.images;
  if (cat.themes) return cat.themes.flatMap((t) => t.images);
  if (cat.groups) return cat.groups.flatMap((g) => getGroupImages(g));
  if (cat.posts) return cat.posts.flatMap((p) => p.images || []);
  return [];
}

function makeGalleryItem(imgObj, globalIndex, fallbackAlt) {
  const item = document.createElement("div");
  item.className = "gallery-item";
  item.innerHTML = `<img src="${imgObj.src}" alt="${imgObj.title || imgObj.caption || fallbackAlt}" loading="lazy" />`;
  item.addEventListener("click", () => openLightbox(globalIndex));
  return item;
}

// ---- Load content ----
async function loadContent() {
  try {
    const res = await fetch("assets/content.json");
    const data = await res.json();
    CATEGORIES = data.categories;
    history.replaceState({ view: "home" }, "", window.location.pathname);
    renderCategories();
  } catch (err) {
    console.error("Failed to load content.json:", err);
    categoryGrid.innerHTML = '<p style="color:#8a8578;text-align:center;padding:2rem;">Failed to load content. Check console for details.</p>';
  }
}

// ---- Build category grid ----
function renderCategories() {
  categoryGrid.innerHTML = "";
  CATEGORIES.forEach((cat, i) => {
    const tile = document.createElement("div");
    tile.className = "category-tile" + (cat.cover ? "" : " placeholder");
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
    tile.setAttribute("aria-label", `View ${cat.name} gallery`);

    if (cat.cover) {
      tile.innerHTML = `
        <img src="${cat.cover}" alt="${cat.name}" loading="lazy" />
        <div class="tile-overlay"><span>${cat.name}</span></div>
      `;
    } else {
      tile.innerHTML = `<span class="tile-label">${cat.name}</span>`;
    }

    tile.addEventListener("click", () => openGallery(i));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openGallery(i);
      }
    });

    categoryGrid.appendChild(tile);
  });
}

// ---- Layout renderers ----
function renderGridLayout(cat) {
  currentImages = cat.images || [];
  const grid = document.createElement("div");
  grid.className = "layout-grid";

  if (currentImages.length === 0) {
    for (let i = 0; i < 3; i++) {
      const ph = document.createElement("div");
      ph.className = "gallery-item placeholder";
      ph.textContent = "No photos yet";
      grid.appendChild(ph);
    }
  } else {
    currentImages.forEach((imgObj, i) => {
      grid.appendChild(makeGalleryItem(imgObj, i, `${cat.name} photo ${i + 1}`));
    });
  }

  galleryBody.appendChild(grid);
}

function renderScatterLayout(cat) {
  currentImages = getAllImageObjects(cat);
  const scatter = document.createElement("div");
  scatter.className = "layout-scatter";

  const patterns = [
    { size: "large", nudge: "nudge-right" },
    { size: "small", nudge: "nudge-left" },
    { size: "medium", nudge: "" },
    { size: "small", nudge: "nudge-right-far" },
    { size: "large", nudge: "nudge-left" },
    { size: "medium", nudge: "nudge-right" },
    { size: "small", nudge: "" },
    { size: "large", nudge: "nudge-left-far" },
    { size: "medium", nudge: "nudge-right-far" },
    { size: "small", nudge: "nudge-left" },
  ];

  const themes = cat.themes || [{ name: null, images: cat.images || [] }];
  let globalIdx = 0;
  let patIdx = 0;

  themes.forEach((theme) => {
    // Theme heading
    if (theme.name) {
      const heading = document.createElement("h3");
      heading.className = "scatter-theme-heading";
      heading.textContent = theme.name;
      scatter.appendChild(heading);
    }

    theme.images.forEach((imgObj) => {
      const item = document.createElement("div");
      const alt = imgObj.title || imgObj.caption || cat.name + " moment";

      if (imgObj.feature === "desktop") {
        item.className = "scatter-item scatter-full-desktop";
      } else if (imgObj.feature === "mobile") {
        item.className = "scatter-item scatter-full-mobile";
      } else {
        const p = patterns[patIdx % patterns.length];
        item.className = `scatter-item scatter-${p.size} ${p.nudge}`.trim();
        patIdx++;
      }

      item.innerHTML = `<img src="${imgObj.src}" alt="${alt}" loading="lazy" />`;
      const idx = globalIdx;
      item.addEventListener("click", () => openLightbox(idx));
      scatter.appendChild(item);
      globalIdx++;
    });
  });

  galleryBody.appendChild(scatter);
}

function renderSidebarLayout(cat) {
  currentImages = getAllImageObjects(cat);
  const wrapper = document.createElement("div");
  wrapper.className = "layout-sidebar";

  const nav = document.createElement("nav");
  nav.className = "sidebar-nav";

  const content = document.createElement("div");
  content.className = "sidebar-content";

  let globalIdx = 0;

  (cat.groups || []).forEach((group, gi) => {
    const btn = document.createElement("button");
    btn.className = "sidebar-nav-item" + (gi === 0 ? " active" : "");
    btn.textContent = group.name;
    btn.addEventListener("click", () => {
      nav.querySelectorAll(".sidebar-nav-item").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = content.querySelector(`[data-group="${gi}"]`);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nav.appendChild(btn);

    const section = document.createElement("div");
    section.className = "group-section";
    section.setAttribute("data-group", gi);

    const heading = document.createElement("h3");
    heading.className = "group-heading";
    heading.textContent = group.name;
    section.appendChild(heading);

    if (group.subgroups) {
      // Event with sub-events: show all sub-events under one sidebar entry
      group.subgroups.forEach((sg, si) => {
        const subHeading = document.createElement("h4");
        subHeading.className = "subgroup-heading";
        subHeading.textContent = sg.name;
        section.appendChild(subHeading);

        const grid = document.createElement("div");
        grid.className = "group-grid";
        sg.images.forEach((imgObj) => {
          grid.appendChild(makeGalleryItem(imgObj, globalIdx, `${group.name} — ${sg.name}`));
          globalIdx++;
        });
        section.appendChild(grid);
      });
    } else {
      // Flat event: images directly
      const grid = document.createElement("div");
      grid.className = "group-grid";
      (group.images || []).forEach((imgObj) => {
        grid.appendChild(makeGalleryItem(imgObj, globalIdx, `${group.name} photo`));
        globalIdx++;
      });
      section.appendChild(grid);
    }

    content.appendChild(section);
  });

  wrapper.appendChild(nav);
  wrapper.appendChild(content);
  galleryBody.appendChild(wrapper);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const gi = entry.target.getAttribute("data-group");
          nav.querySelectorAll(".sidebar-nav-item").forEach((b, idx) => {
            b.classList.toggle("active", idx === parseInt(gi));
          });
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );

  content.querySelectorAll(".group-section").forEach((s) => observer.observe(s));
}

function renderCitiesLayout(cat) {
  currentImages = getAllImageObjects(cat);

  const cityNav = document.createElement("div");
  cityNav.className = "cities-nav";

  const allBtn = document.createElement("button");
  allBtn.className = "city-btn active";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    cityNav.querySelectorAll(".city-btn").forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
    citiesContent.querySelectorAll(".group-section").forEach((s) => (s.style.display = ""));
  });
  cityNav.appendChild(allBtn);

  (cat.groups || []).forEach((group, gi) => {
    const btn = document.createElement("button");
    btn.className = "city-btn";
    btn.textContent = group.name;
    btn.addEventListener("click", () => {
      cityNav.querySelectorAll(".city-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      citiesContent.querySelectorAll(".group-section").forEach((s, idx) => {
        s.style.display = idx === gi ? "" : "none";
      });
    });
    cityNav.appendChild(btn);
  });

  galleryBody.appendChild(cityNav);

  const citiesContent = document.createElement("div");
  citiesContent.className = "cities-content";

  let globalIdx = 0;

  (cat.groups || []).forEach((group) => {
    const section = document.createElement("div");
    section.className = "group-section";

    const heading = document.createElement("h3");
    heading.className = "group-heading";
    heading.textContent = group.name;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "group-grid";

    group.images.forEach((imgObj) => {
      grid.appendChild(makeGalleryItem(imgObj, globalIdx, `${group.name} photo`));
      globalIdx++;
    });

    section.appendChild(grid);
    citiesContent.appendChild(section);
  });

  galleryBody.appendChild(citiesContent);
}

function renderBlogLayout(cat) {
  currentImages = getAllImageObjects(cat);
  const blog = document.createElement("div");
  blog.className = "layout-blog";

  let globalIdx = 0;

  (cat.posts || []).forEach((post) => {
    const article = document.createElement("article");
    article.className = "blog-post";

    // Post header
    const header = document.createElement("div");
    header.className = "blog-post-header";
    header.innerHTML = `
      <h3 class="blog-post-title">${post.title}</h3>
      ${post.date ? `<time class="blog-post-date">${formatDate(post.date)}</time>` : ""}
    `;
    article.appendChild(header);

    // Post body text
    if (post.body) {
      const body = document.createElement("p");
      body.className = "blog-post-body";
      body.textContent = post.body;
      article.appendChild(body);
    }

    // Post images
    if (post.images && post.images.length > 0) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "blog-images";

      post.images.forEach((imgObj) => {
        const figure = document.createElement("figure");
        figure.className = "blog-figure";

        const imgDiv = document.createElement("div");
        imgDiv.className = "gallery-item";
        imgDiv.innerHTML = `<img src="${imgObj.src}" alt="${imgObj.caption || imgObj.title || post.title}" loading="lazy" />`;
        const idx = globalIdx;
        imgDiv.addEventListener("click", () => openLightbox(idx));
        figure.appendChild(imgDiv);

        // Caption + metadata under the image
        const captionEl = document.createElement("figcaption");
        captionEl.className = "blog-caption";
        let captionParts = [];
        if (imgObj.caption) captionParts.push(imgObj.caption);
        let metaParts = [];
        if (imgObj.camera) metaParts.push(imgObj.camera);
        if (imgObj.lens) metaParts.push(imgObj.lens);
        captionEl.innerHTML = `
          ${captionParts.length ? `<span class="blog-caption-text">${captionParts.join("")}</span>` : ""}
          ${metaParts.length ? `<span class="blog-caption-meta">${metaParts.join(" — ")}</span>` : ""}
        `;
        figure.appendChild(captionEl);

        imageWrap.appendChild(figure);
        globalIdx++;
      });

      article.appendChild(imageWrap);
    }

    blog.appendChild(article);
  });

  galleryBody.appendChild(blog);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// ---- Gallery view ----
function openGallery(catIndex, pushState = true) {
  const cat = CATEGORIES[catIndex];
  galleryTitle.textContent = cat.name;
  galleryBody.innerHTML = "";

  switch (cat.layout) {
    case "sidebar":
      renderSidebarLayout(cat);
      break;
    case "scatter":
      renderScatterLayout(cat);
      break;
    case "cities":
      renderCitiesLayout(cat);
      break;
    case "blog":
      renderBlogLayout(cat);
      break;
    default:
      renderGridLayout(cat);
  }

  hideAllViews();
  galleryView.classList.remove("hidden");
  window.scrollTo(0, 0);

  if (pushState) {
    history.pushState({ view: "gallery", catIndex }, "", `#${cat.name.toLowerCase()}`);
  }
}

backBtn.addEventListener("click", () => showHome());

// Browser back/forward button
window.addEventListener("popstate", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    closeLightbox(false);
    return;
  }

  if (e.state && e.state.view === "gallery") {
    openGallery(e.state.catIndex, false);
  } else if (e.state && e.state.view === "contact") {
    showContact(false);
  } else {
    showHome(false);
  }
});

// Handle nav links
document.querySelectorAll("[data-home]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (!lightbox.classList.contains("hidden")) closeLightbox();
    showHome();
  });
});

document.querySelectorAll("[data-contact]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (!lightbox.classList.contains("hidden")) closeLightbox();
    showContact();
  });
});

// ---- Lightbox ----
function openLightbox(index) {
  if (currentImages.length === 0) return;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  history.pushState({ view: "lightbox" }, "");
}

function closeLightbox(pushState = true) {
  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
  if (pushState) {
    history.back();
  }
}

function updateLightbox() {
  const img = currentImages[currentIndex];
  lbImg.src = img.src;
  lbImg.alt = img.title || img.caption || `Photo ${currentIndex + 1}`;
  lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;

  // Build metadata
  let metaHTML = "";
  const title = img.title || img.caption || "";
  const desc = img.description || "";
  let techParts = [];
  if (img.camera) techParts.push(img.camera);
  if (img.lens) techParts.push(img.lens);

  if (title) metaHTML += `<div class="lb-meta-title">${title}</div>`;
  if (desc) metaHTML += `<div class="lb-meta-desc">${desc}</div>`;
  if (techParts.length) metaHTML += `<div class="lb-meta-tech">${techParts.join(" — ")}</div>`;

  lbMeta.innerHTML = metaHTML;
}

function prevImage() {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", prevImage);
lbNext.addEventListener("click", nextImage);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// ---- Init ----
loadContent();
