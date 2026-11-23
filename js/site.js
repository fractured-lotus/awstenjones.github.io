(function () {
  var toggle = document.querySelector(".nav-toggle");
  var header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("video[data-hls]").forEach(function (video) {
    var src = video.getAttribute("data-hls");
    if (!src) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      return;
    }
    video.src = src;
  });

  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var to = form.getAttribute("data-mailto");
      var subject = form.getAttribute("data-subject") || "Website message";
      var lines = [];
      var data = new FormData(form);
      data.forEach(function (value, key) {
        if (key === "updates") {
          lines.push("Sign up for news and updates: yes");
          return;
        }
        lines.push(key + ": " + String(value).trim());
      });
      if (!data.has("updates") && form.querySelector('[name="updates"]')) {
        lines.push("Sign up for news and updates: no");
      }
      var href =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
      var note = form.querySelector(".form-note");
      if (note) note.textContent = "Opening your email app…";
      window.location.href = href;
    });
  });

  var lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;
  var lightImg = lightbox.querySelector("img");
  var lightCap = lightbox.querySelector("figcaption");
  var closeBtn = lightbox.querySelector(".lightbox-close");

  function closeLight() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("hidden", "");
  }

  document.querySelectorAll(".strip img").forEach(function (img) {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      lightImg.src = img.currentSrc || img.src;
      lightImg.alt = img.alt;
      lightCap.textContent = img.alt;
      lightbox.removeAttribute("hidden");
      lightbox.classList.add("is-open");
      closeBtn.focus();
    });
  });

  closeBtn.addEventListener("click", closeLight);
  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLight();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLight();
  });
})();
