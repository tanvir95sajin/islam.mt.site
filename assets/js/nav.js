document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight current page in nav
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    var target = a.getAttribute("href").split("/").pop();
    if (target === here) a.setAttribute("aria-current", "page");
  });

  // Fill in footer / contact links from config.js
  if (window.SITE) {
    document.querySelectorAll("[data-site-email]").forEach(function (el) {
      el.href = "mailto:" + window.SITE.email;
      if (el.dataset.siteEmail === "text") el.textContent = window.SITE.email;
    });
    document.querySelectorAll("[data-site-github]").forEach(function (el) { el.href = window.SITE.github; });
    document.querySelectorAll("[data-site-linkedin]").forEach(function (el) { el.href = window.SITE.linkedin; });
    document.querySelectorAll("[data-site-scholar]").forEach(function (el) { el.href = window.SITE.scholar; });
    document.querySelectorAll("[data-site-twitter]").forEach(function (el) { el.href = window.SITE.twitter; });
    document.querySelectorAll("[data-site-year]").forEach(function (el) { el.textContent = window.SITE.year; });
  }
});
