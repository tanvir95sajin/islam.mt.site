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

// ---------------------------------------------------------------------------
// Tiny dependency-free Markdown renderer (headings ##/###/####, paragraphs,
// unordered/ordered lists, blockquotes, fenced code blocks, and inline
// bold/italic/code/links). No external library, no eval — keeps this page
// working under any Content-Security-Policy.
// ---------------------------------------------------------------------------
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineMd(text) {
  text = escapeHtml(text);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return text;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;
  let inCode = false, codeBuf = [];
  let listType = null, listBuf = [];

  function flushList() {
    if (listType) {
      html += `<${listType}>` + listBuf.map((li) => `<li>${inlineMd(li)}</li>`).join("") + `</${listType}>`;
      listType = null; listBuf = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      flushList();
      inCode = !inCode;
      if (!inCode) {
        html += `<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`;
        codeBuf = [];
      }
      i++; continue;
    }
    if (inCode) { codeBuf.push(line); i++; continue; }

    if (!line.trim()) { flushList(); i++; continue; }

    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      html += `<h${level}>${inlineMd(h[2])}</h${level}>`;
      i++; continue;
    }

    const bq = line.match(/^>\s?(.*)$/);
    if (bq) {
      flushList();
      let buf = [bq[1]];
      i++;
      while (i < lines.length && lines[i].match(/^>\s?(.*)$/)) {
        buf.push(lines[i].match(/^>\s?(.*)$/)[1]);
        i++;
      }
      html += `<blockquote><p>${buf.map(inlineMd).join("<br>")}</p></blockquote>`;
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)$/);
    if (ul) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listBuf.push(ul[1]);
      i++; continue;
    }

    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ol) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listBuf.push(ol[1]);
      i++; continue;
    }

    flushList();
    let buf = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^(#{2,4})\s+/) &&
      !lines[i].match(/^[-*]\s+/) &&
      !lines[i].match(/^\d+\.\s+/) &&
      !lines[i].match(/^>\s?/) &&
      !lines[i].trim().startsWith("```")
    ) {
      buf.push(lines[i]);
      i++;
    }
    html += `<p>${inlineMd(buf.join(" "))}</p>`;
  }
  flushList();
  return html;
}

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
      mount.innerHTML = mdToHtml(md);
    })
    .catch(function () {
      mount.innerHTML = '<p class="muted">Couldn\u2019t load this post. If you\u2019re previewing locally, serve this folder over http (see comment in assets/js/blog.js).</p>';
    });
}

document.addEventListener("DOMContentLoaded", function () {
  renderPostList();
  renderPost();
});
