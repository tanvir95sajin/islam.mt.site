// ---------------------------------------------------------------------------
// Tiny blog engine — no build step required.
//
// To add a new post:
//   1. Write assets-free markdown in blog/posts/your-slug.md
//   2. Add one entry to blog/posts.json:
//      { "slug": "your-slug", "title": "...", "date": "2026-08-09", "excerpt": "..." }
//   3. Newest post should be first in the array.
//
// Note: fetch() needs http(s), not file://. To preview locally, run a tiny
// server from the repo root, e.g. `python3 -m http.server`, then visit
// http://localhost:8000/blog/. On GitHub Pages this just works.
// ---------------------------------------------------------------------------

function fmtDate(iso) {
  var d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function renderPostList() {
  var list = document.getElementById("post-list");
  if (!list) return;
  fetch("posts.json")
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      if (!posts.length) {
        list.innerHTML = '<p class="muted">No posts yet — the first one is coming soon.</p>';
        return;
      }
      list.innerHTML = posts.map(function (p) {
        return (
          '<a class="post-list-item" href="post.html?post=' + encodeURIComponent(p.slug) + '">' +
            '<div class="post-date mono">' + fmtDate(p.date) + '</div>' +
            '<h3>' + p.title + '</h3>' +
            '<p class="post-excerpt">' + p.excerpt + '</p>' +
          '</a>'
        );
      }).join("");
    })
    .catch(function () {
      list.innerHTML = '<p class="muted">Couldn\u2019t load posts. If you\u2019re previewing locally, serve this folder over http (see comment in assets/js/blog.js).</p>';
    });
}

function renderPost() {
  var mount = document.getElementById("post-content");
  if (!mount) return;
  var params = new URLSearchParams(location.search);
  var slug = params.get("post");
  if (!slug) {
    mount.innerHTML = '<p class="muted">No post specified.</p>';
    return;
  }

  fetch("posts.json")
    .then(function (r) { return r.json(); })
    .then(function (posts) {
      var meta = posts.find(function (p) { return p.slug === slug; });
      if (meta) {
        document.title = meta.title + " — " + (window.SITE ? window.SITE.shortName : "Blog");
        document.getElementById("post-title").textContent = meta.title;
        document.getElementById("post-date").textContent = fmtDate(meta.date);
      }
      return fetch("posts/" + slug + ".md");
    })
    .then(function (r) {
      if (!r.ok) throw new Error("not found");
      return r.text();
    })
    .then(function (md) {
      mount.innerHTML = window.marked ? window.marked.parse(md) : md;
    })
    .catch(function () {
      mount.innerHTML = '<p class="muted">Couldn\u2019t load this post. If you\u2019re previewing locally, serve this folder over http (see comment in assets/js/blog.js).</p>';
    });
}

document.addEventListener("DOMContentLoaded", function () {
  renderPostList();
  renderPost();
});
