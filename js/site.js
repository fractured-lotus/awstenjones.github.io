(function () {
  var toggle = document.querySelector(".nav-toggle");
  var header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function layoutMosaic(root) {
    var figures = Array.prototype.slice.call(root.children);
    var width = root.clientWidth;
    if (!width || !figures.length) return;
    var gap = 19;
    var perRow = width < 720 ? 1 : width < 980 ? 2 : 3;
    var ratios = figures.map(function (fig) {
      var img = fig.querySelector("img");
      var w = img && img.naturalWidth ? img.naturalWidth : 3;
      var h = img && img.naturalHeight ? img.naturalHeight : 2;
      return w / h;
    });
    var row = [];
    var sum = 0;
    function paint(indexes, ratioSum) {
      var gaps = gap * (indexes.length - 1);
      var h = (width - gaps) / ratioSum;
      indexes.forEach(function (idx) {
        var fig = figures[idx];
        var img = fig.querySelector("img");
        fig.style.width = ratios[idx] * h + "px";
        if (img) {
          img.style.height = h + "px";
          img.style.width = "100%";
        }
      });
    }
    for (var i = 0; i < figures.length; i++) {
      row.push(i);
      sum += ratios[i];
      var rowFull = row.length === perRow;
      var last = i === figures.length - 1;
      if (rowFull || last) {
        paint(row, sum);
        row = [];
        sum = 0;
      }
    }
  }

  document.querySelectorAll("[data-mosaic]").forEach(function (root) {
    var run = function () {
      layoutMosaic(root);
    };
    run();
    window.addEventListener("resize", run);
    root.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", run);
    });
  });

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

  document.querySelectorAll(".mosaic img, .strip img").forEach(function (img) {
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
