/* =============================================
   Stories by Ariel — Portfolio Logic
   =============================================
   To add your own photos:
   1. Drop images into assets/<category-folder>/
   2. Update the CATEGORIES array below with the
      category name, cover image path, and array
      of image paths.
   ============================================= */

const CATEGORIES = [
  {
    name: "Portraits",
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
    cover: "https://picsum.photos/seed/events/800/600",
    images: [
      "https://picsum.photos/seed/evt1/1200/800",
      "https://picsum.photos/seed/evt2/1200/800",
      "https://picsum.photos/seed/evt3/1200/800",
      "https://picsum.photos/seed/evt4/1200/800",
      "https://picsum.photos/seed/evt5/1200/800",
      "https://picsum.photos/seed/evt6/1200/800",
    ],
  },
  {
    name: "Street",
    cover: "https://picsum.photos/seed/street/800/600",
    images: [
      "https://picsum.photos/seed/str1/1200/800",
      "https://picsum.photos/seed/str2/1200/800",
      "https://picsum.photos/seed/str3/1200/800",
      "https://picsum.photos/seed/str4/1200/800",
      "https://picsum.photos/seed/str5/1200/800",
      "https://picsum.photos/seed/str6/1200/800",
    ],
  },
  {
    name: "Travel",
    cover: "https://picsum.photos/seed/travel/800/600",
    images: [
      "https://picsum.photos/seed/trv1/1200/800",
      "https://picsum.photos/seed/trv2/1200/800",
      "https://picsum.photos/seed/trv3/1200/800",
      "https://picsum.photos/seed/trv4/1200/800",
      "https://picsum.photos/seed/trv5/1200/800",
      "https://picsum.photos/seed/trv6/1200/800",
    ],
  },
  {
    name: "Personal",
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
const galleryGrid = document.getElementById("gallery-grid");
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

// ---- Gallery view ----
function openGallery(catIndex, pushState = true) {
  const cat = CATEGORIES[catIndex];
  galleryTitle.textContent = cat.name;
  currentImages = cat.images;
  galleryGrid.innerHTML = "";

  if (cat.images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="gallery-item placeholder">No photos yet</div>
      <div class="gallery-item placeholder">No photos yet</div>
      <div class="gallery-item placeholder">No photos yet</div>
    `;
  } else {
    cat.images.forEach((src, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<img src="${src}" alt="${cat.name} photo ${i + 1}" loading="lazy" />`;
      item.addEventListener("click", () => openLightbox(i));
      galleryGrid.appendChild(item);
    });
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
  // Close lightbox first if open
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

// Click outside image to close
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// ---- Init ----
history.replaceState({ view: "home" }, "", window.location.pathname);
renderCategories();
