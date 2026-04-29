(function () {
  var GITHUB_OWNER = "AyoubDarrehmane";
  var GITHUB_REPO = "quinza-site";
  var ASSETS_DIR = "assets/";
  var EXCLUDED = new Set(["app-icon.png"]);
  var SUPPORTED = [".png", ".jpg", ".jpeg", ".webp"];
  var DEFAULT_ASSET_FILES = [
    "gameplay_frame1.png",
    "gameplay_frame2.png",
    "Screenshot_20260321_192202_Quinza! Internal.jpg",
    "Screenshot_20260321_192354_Quinza! Internal.jpg",
    "Screenshot_20260321_192501_Quinza! Internal.jpg",
  ];

  var galleryNode = document.getElementById("gallery");
  var lightboxNode = document.getElementById("lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var closeBtn = document.getElementById("lightbox-close");
  var prevBtn = document.getElementById("lightbox-prev");
  var nextBtn = document.getElementById("lightbox-next");

  var imagePaths = [];
  var activeIndex = -1;

  function isSupported(name) {
    var lower = name.toLowerCase();
    for (var i = 0; i < SUPPORTED.length; i += 1) {
      if (lower.endsWith(SUPPORTED[i])) {
        return true;
      }
    }
    return false;
  }

  function compareAsc(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: "base" });
  }

  function filterAssetNames(names) {
    return names
      .filter(function (name) {
        return !EXCLUDED.has(name) && isSupported(name);
      })
      .sort(compareAsc);
  }

  function renderEmptyState() {
    galleryNode.innerHTML = "<p class=\"gallery-empty\">No screenshots found in assets/ yet.</p>";
  }

  function renderGallery(paths) {
    if (!paths.length) {
      renderEmptyState();
      return;
    }

    var fragment = document.createDocumentFragment();
    paths.forEach(function (path, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-card";
      button.setAttribute("aria-label", "Open screenshot " + (index + 1));
      button.dataset.index = String(index);

      var img = document.createElement("img");
      img.src = path;
      img.alt = "Quinza gameplay screenshot " + (index + 1);
      img.loading = "lazy";
      img.decoding = "async";

      button.appendChild(img);
      fragment.appendChild(button);
    });

    galleryNode.innerHTML = "";
    galleryNode.appendChild(fragment);
  }

  function openLightbox(index) {
    if (index < 0 || index >= imagePaths.length) {
      return;
    }
    activeIndex = index;
    lightboxImage.src = imagePaths[index];
    lightboxNode.classList.add("is-open");
    lightboxNode.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    activeIndex = -1;
    lightboxNode.classList.remove("is-open");
    lightboxNode.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
  }

  function goTo(delta) {
    if (activeIndex === -1 || imagePaths.length === 0) {
      return;
    }
    var next = (activeIndex + delta + imagePaths.length) % imagePaths.length;
    openLightbox(next);
  }

  function attachEvents() {
    galleryNode.addEventListener("click", function (event) {
      var card = event.target.closest(".gallery-card");
      if (!card) {
        return;
      }
      var idx = Number(card.dataset.index);
      openLightbox(idx);
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", function () {
      goTo(-1);
    });
    nextBtn.addEventListener("click", function () {
      goTo(1);
    });

    lightboxNode.addEventListener("click", function (event) {
      if (event.target === lightboxNode) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (!lightboxNode.classList.contains("is-open")) {
        return;
      }
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        goTo(-1);
      } else if (event.key === "ArrowRight") {
        goTo(1);
      }
    });
  }

  function asAssetPath(name) {
    return ASSETS_DIR + name;
  }

  function fetchFromGitHubApi() {
    var url = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO + "/contents/assets";
    return fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("GitHub API response not ok");
        }
        return res.json();
      })
      .then(function (items) {
        if (!Array.isArray(items)) {
          throw new Error("Unexpected GitHub API payload");
        }
        var names = items
          .filter(function (item) {
            return item && item.type === "file" && typeof item.name === "string";
          })
          .map(function (item) {
            return item.name;
          });
        return filterAssetNames(names);
      });
  }

  function collectFromDomFallback() {
    return filterAssetNames(DEFAULT_ASSET_FILES.slice());
  }

  function init() {
    attachEvents();
    fetchFromGitHubApi()
      .catch(function () {
        return collectFromDomFallback();
      })
      .then(function (names) {
        imagePaths = names.map(asAssetPath);
        renderGallery(imagePaths);
      })
      .catch(function () {
        renderEmptyState();
      });
  }

  init();
})();
