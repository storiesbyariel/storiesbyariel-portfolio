/* =============================================
   Stories by Ariel — Portfolio Logic
   =============================================
   Layout types:
   - "grid"    → flat photo grid (Portraits, Headshots, Personal)
   - "sidebar" → left sidebar nav with grouped sections (Events)
   - "cities"  → horizontal city nav with grouped sections (Street, Travel)

   For "grid" categories, use a flat `images` array.
   For "sidebar" and "cities", use a `groups` array of { name, images }.
   ============================================= */

const CATEGORIES = [
  {
    name: "Portraits",
    layout: "grid",
    cover: "https://picsum.photos/seed/portraits/800/600",
    images: [
      "https://picsum.photos/seed/port1/1200/800",
      "https://picsum.photos/seed/port2/1200/800",
      "https://picsum.photos/seed/port3/1200/800",
      "https://picsum.photos/seed/port4/1200/800",
      "https://picsum.photos/seed/port5/1200/800",
      "https://picsum.photos/seed/port6/1200/800",
    ],
  },
  {
    name: "Headshots",
    layout: "grid",
    cover: "https://picsum.photos/seed/headshots/800/600",
    images: [
      "https://picsum.photos/seed/head1/1200/800",
      "https://picsum.photos/seed/head2/1200/800",
      "https://picsum.photos/seed/head3/1200/800",
      "https://picsum.photos/seed/head4/1200/800",
      "https://picsum.photos/seed/head5/1200/800",
      "https://picsum.photos/seed/head6/1200/800",
    ],
  },
  {
    name: "Events",
    layout: "sidebar",
    cover: "https://picsum.photos/seed/events/800/600",
    groups: [
      {
        name: "Art Gallery Opening",
        images: [
          "https://picsum.photos/seed/evt-ag1/1200/800",
          "https://picsum.photos/seed/evt-ag2/1200/800",
          "https://picsum.photos/seed/evt-ag3/1200/800",
        ],
      },
      {
        name: "Community Festival",
        images: [
          "https://picsum.photos/seed/evt-cf1/1200/800",
          "https://picsum.photos/seed/evt-cf2/1200/800",
          "https://picsum.photos/seed/evt-cf3/1200/800",
        ],
      },
      {
        name: "Brand Launch",
        images: [
          "https://picsum.photos/seed/evt-bl1/1200/800",
          "https://picsum.photos/seed/evt-bl2/1200/800",
          "https://picsum.photos/seed/evt-bl3/1200/800",
        ],
      },
    ],
  },
  {
    name: "Street",
    layout: "cities",
    cover: "https://picsum.photos/seed/street/800/600",
    groups: [
      {
        name: "New York",
        images: [
          "https://picsum.photos/seed/str-ny1/1200/800",
          "https://picsum.photos/seed/str-ny2/1200/800",
          "https://picsum.photos/seed/str-ny3/1200/800",
          "https://picsum.photos/seed/str-ny4/1200/800",
        ],
      },
      {
        name: "Tokyo",
        images: [
          "https://picsum.photos/seed/str-tk1/1200/800",
          "https://picsum.photos/seed/str-tk2/1200/800",
          "https://picsum.photos/seed/str-tk3/1200/800",
        ],
      },
      {
        name: "London",
        images: [
          "https://picsum.photos/seed/str-ld1/1200/800",
          "https://picsum.photos/seed/str-ld2/1200/800",
          "https://picsum.photos/seed/str-ld3/1200/800",
        ],
      },
      {
        name: "Paris",
        images: [
          "https://picsum.photos/seed/str-pr1/1200/800",
          "https://picsum.photos/seed/str-pr2/1200/800",
          "https://picsum.photos/seed/str-pr3/1200/800",
        ],
      },
    ],
  },
  {
    name: "Travel",
    layout: "cities",
    cover: "https://picsum.photos/seed/travel/800/600",
    groups: [
      {
        name: "Barcelona",
        images: [
          "https://picsum.photos/seed/trv-bc1/1200/800",
          "https://picsum.photos/seed/trv-bc2/1200/800",
          "https://picsum.photos/seed/trv-bc3/1200/800",
        ],
      },
      {
        name: "Lisbon",
        images: [
          "https://picsum.photos/seed/trv-ls1/1200/800",
          "https://picsum.photos/seed/trv-ls2/1200/800",
          "https://picsum.photos/seed/trv-ls3/1200/800",
        ],
      },
      {
        name: "Mexico City",
        images: [
          "https://picsum.photos/seed/trv-mx1/1200/800",
          "https://picsum.photos/seed/trv-mx2/1200/800",
          "https://picsum.photos/seed/trv-mx3/1200/800",
        ],
      },
    ],
  },
  {
    name: "Personal",
    layout: "grid",
    cover: "https://picsum.photos/seed/personal/800/600",
    images: [
      "https://picsum.photos/seed/per1/1200/800",
      "https://picsum.photos/seed/per2/1200/800",
      "https://picsum.photos/seed/per3/1200/800",
      "https://picsum.photos/seed/per4/1200/800",
      "https://picsum.photos/seed/per5/1200/800",
      "https://picsum.photos/seed/per6/1200/800",
    ],
  },
];

// ---- DOM refs ----
const homeView = document.getElementById("home-view");
const galleryView = document.getElementById("gallery-view");
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

let currentImages = [];
let currentIndex = 0;

// ---- Footer year ----
document.getElementById("year").textContent = new Date().getFullYear();

// ---- Helpers ----
function getAllImages(cat) {
  if (cat.images) return cat.images;
  if (cat.groups) return cat.groups.flatMap((g) => g.images);
  return [];
}

function makeGalleryItem(src, globalIndex, altText) {
  const item = document.createElement("div");
  item.className = "gallery-item";
  item.innerHTML = `<img src="${src}" alt="${altText}" loading="lazy" />`;
  item.addEventListener("click", () => openLightbox(globalIndex));
  return item;
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
    currentImages.forEach((src, i) => {
      grid.appendChild(makeGalleryItem(src, i, `${cat.name} photo ${i + 1}`));
    });
  }

  galleryBody.appendChild(grid);
}

function renderSidebarLayout(cat) {
  currentImages = getAllImages(cat);
  const wrapper = document.createElement("div");
  wrapper.className = "layout-sidebar";

  // Sidebar nav
  const nav = document.createElement("nav");
  nav.className = "sidebar-nav";

  // Content area
  const content = document.createElement("div");
  content.className = "sidebar-content";

  let globalIdx = 0;

  (cat.groups || []).forEach((group, gi) => {
    // Nav button
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

    // Group section
    const section = document.createElement("div");
    section.className = "group-section";
    section.setAttribute("data-group", gi);

    const heading = document.createElement("h3");
    heading.className = "group-heading";
    heading.textContent = group.name;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "group-grid";

    group.images.forEach((src) => {
      grid.appendChild(makeGalleryItem(src, globalIdx, `${group.name} photo`));
      globalIdx++;
    });

    section.appendChild(grid);
    content.appendChild(section);
  });

  wrapper.appendChild(nav);
  wrapper.appendChild(content);
  galleryBody.appendChild(wrapper);

  // Update active sidebar item on scroll
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
  currentImages = getAllImages(cat);

  // City navigation bar
  const cityNav = document.createElement("div");
  cityNav.className = "cities-nav";

  // "All" button
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

  // City grouped content
  const citiesContent = document.createElement("div");
  citiesContent.className = "cities-content";

  let globalIdx = 0;

  (cat.groups || []).forEach((group, gi) => {
    const section = document.createElement("div");
    section.className = "group-section";

    const heading = document.createElement("h3");
    heading.className = "group-heading";
    heading.textContent = group.name;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "group-grid";

    group.images.forEach((src) => {
      grid.appendChild(makeGalleryItem(src, globalIdx, `${group.name} photo`));
      globalIdx++;
    });

    section.appendChild(grid);
    citiesContent.appendChild(section);
  });

  galleryBody.appendChild(citiesContent);
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
    case "cities":
      renderCitiesLayout(cat);
      break;
    default:
      renderGridLayout(cat);
  }

  homeView.classList.add("hidden");
  galleryView.classList.remove("hidden");
  window.scrollTo(0, 0);

  if (pushState) {
    history.pushState({ view: "gallery", catIndex }, "", `#${cat.name.toLowerCase()}`);
  }
}

function closeGallery(pushState = true) {
  galleryView.classList.add("hidden");
  homeView.classList.remove("hidden");
  window.scrollTo(0, 0);

  if (pushState) {
    history.pushState({ view: "home" }, "", window.location.pathname);
  }
}

backBtn.addEventListener("click", () => closeGallery());

// Browser back/forward button
window.addEventListener("popstate", (e) => {
  if (!lightbox.classList.contains("hidden")) {
    closeLightbox(false);
    return;
  }

  if (e.state && e.state.view === "gallery") {
    openGallery(e.state.catIndex, false);
  } else {
    closeGallery(false);
  }
});

// Handle nav Home link
document.querySelectorAll("[data-home]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    if (!lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
    if (!galleryView.classList.contains("hidden")) {
      closeGallery();
    }
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
  lbImg.src = currentImages[currentIndex];
  lbImg.alt = `Photo ${currentIndex + 1} of ${currentImages.length}`;
  lbCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
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
history.replaceState({ view: "home" }, "", window.location.pathname);
renderCategories();
