const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "admin-pages");
const OUT_DIR = path.join(__dirname, "prototype");
const CSS_FILE = path.join(__dirname, "muslimat-admin-override.css");

// Read override CSS
const overrideCSS = fs.readFileSync(CSS_FILE, "utf-8");

// PAGES array drives the build — no filesystem listing needed

// Build URL → filename map by scanning sidebar links in each file
const BASE = "";
const urlMap = new Map();

// Manual mapping — ASCII-safe filenames to avoid browser URL-encoding issues
const PAGES = [
  { file: "01-dashboard.html", src: "01-الرئيسية.html", path: "/index.php" },
  { file: "02-comments.html", src: "02-تعليقات-0لا-تعليق-بانتظار-الموافقة.html", path: "/edit-comments.php" },
  { file: "03-lessons.html", src: "03-الدروس.html", path: "/edit.php?post_type=lesson" },
  { file: "04-add-lesson.html", src: "04-أضف-درس.html", path: "/post-new.php?post_type=lesson" },
  { file: "05-lesson-topics.html", src: "05-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=lesson" },
  { file: "06-lesson-types.html", src: "06-أنواع-الدروس.html", path: "/edit-tags.php?taxonomy=lesson-type&post_type=lesson" },
  { file: "07-lesson-tax-order.html", src: "07-Taxonomy-Order.html", path: "/edit.php?post_type=lesson&page=to-interface-lesson" },
  { file: "08-series.html", src: "08-السلاسل-العلمية.html", path: "/edit.php?post_type=scientific-series" },
  { file: "09-add-series.html", src: "09-أضف-السلسلة-العلمية.html", path: "/post-new.php?post_type=scientific-series" },
  { file: "10-series-topics.html", src: "10-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=scientific-series" },
  { file: "11-series-index.html", src: "11-فهارس.html", path: "/edit-tags.php?taxonomy=index&post_type=scientific-series" },
  { file: "12-series-tax-order.html", src: "12-Taxonomy-Order.html", path: "/edit.php?post_type=scientific-series&page=to-interface-scientific-series" },
  { file: "13-articles.html", src: "13-المقالات.html", path: "/edit.php?post_type=article" },
  { file: "14-add-article.html", src: "14-أضف-المقالة.html", path: "/post-new.php?post_type=article" },
  { file: "15-article-topics.html", src: "15-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=article" },
  { file: "16-article-types.html", src: "16-أنواع-المقالات.html", path: "/edit-tags.php?taxonomy=article-type&post_type=article" },
  { file: "17-article-tax-order.html", src: "17-Taxonomy-Order.html", path: "/edit.php?post_type=article&page=to-interface-article" },
  { file: "18-fatwa.html", src: "18-أسئلة-وأجوبة.html", path: "/edit.php?post_type=fatwa" },
  { file: "19-add-fatwa.html", src: "19-أضف-سؤال-وجواب.html", path: "/post-new.php?post_type=fatwa" },
  { file: "20-fatwa-topics.html", src: "20-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=fatwa" },
  { file: "21-fatwa-sources.html", src: "21-المصادر.html", path: "/edit-tags.php?taxonomy=source&post_type=fatwa" },
  { file: "22-fatwa-tax-order.html", src: "22-Taxonomy-Order.html", path: "/edit.php?post_type=fatwa&page=to-interface-fatwa" },
  { file: "23-static-pages.html", src: "23-الصفحات-الثابتة.html", path: "/edit.php?post_type=static-page" },
  { file: "24-add-static-page.html", src: "24-أضف-الصفحة-الثابتة.html", path: "/post-new.php?post_type=static-page" },
  { file: "25-podcast.html", src: "25-بودكاست.html", path: "/edit.php?post_type=podcast" },
  { file: "26-add-podcast.html", src: "26-أضف-بودكاست.html", path: "/post-new.php?post_type=podcast" },
  { file: "27-podcast-topics.html", src: "27-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=podcast" },
  { file: "28-podcast-tax-order.html", src: "28-Taxonomy-Order.html", path: "/edit.php?post_type=podcast&page=to-interface-podcast" },
  { file: "29-quotes.html", src: "29-فوائد.html", path: "/edit.php?post_type=quote" },
  { file: "30-add-quote.html", src: "30-أضف-فائدة.html", path: "/post-new.php?post_type=quote" },
  { file: "31-quote-topics.html", src: "31-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=quote" },
  { file: "32-quote-tax-order.html", src: "32-Taxonomy-Order.html", path: "/edit.php?post_type=quote&page=to-interface-quote" },
  { file: "33-sci-lessons.html", src: "33-الدروس-العلمية.html", path: "/edit.php?post_type=scientific-lesson" },
  { file: "34-add-sci-lesson.html", src: "34-أضف-الدرس-العلمي.html", path: "/post-new.php?post_type=scientific-lesson" },
  { file: "35-sci-lesson-topics.html", src: "35-شجرة-التصنيفات.html", path: "/edit-tags.php?taxonomy=topic&post_type=scientific-lesson" },
  { file: "36-sci-lesson-index.html", src: "36-فهارس.html", path: "/edit-tags.php?taxonomy=index&post_type=scientific-lesson" },
  { file: "37-sci-lesson-tax-order.html", src: "37-Taxonomy-Order.html", path: "/edit.php?post_type=scientific-lesson&page=to-interface-scientific-lesson" },
  { file: "38-tools.html", src: "38-أدوات.html", path: "/tools.php" },
  { file: "39-wpml.html", src: "39-WPML.html", path: "/admin.php?page=tm/menu/main.php" },
  { file: "40-translations.html", src: "40-ترجمات.html", path: "/admin.php?page=tm/menu/translations-queue.php" },
  { file: "41-media-translation.html", src: "41-ترجمة-الوسائط.html", path: "/admin.php?page=wpml-media" },
  { file: "42-string-translation.html", src: "42-ترجمة-النصوص.html", path: "/admin.php?page=wpml-string-translation/menu/string-translation.php" },
  { file: "43-settings.html", src: "43-إعدادات.html", path: "/admin.php?page=tm/menu/settings" },
  { file: "44-media.html", src: "44-وسائط.html", path: "/upload.php" },
  { file: "45-add-media.html", src: "45-إضافة-ملف-جديد.html", path: "/media-new.php" },
  { file: "46-users.html", src: "46-أعضاء.html", path: "/users.php" },
  { file: "47-add-user.html", src: "47-إضافة-عضو-جديد.html", path: "/user-new.php" },
  { file: "48-profile.html", src: "48-حسابك.html", path: "/profile.php" },
];

// Build URL map — full URLs, relative paths, and &amp; variants
for (const p of PAGES) {
  const fullUrl = BASE + p.path;
  urlMap.set(fullUrl, p.file);
  urlMap.set(fullUrl.replace(/&/g, "&amp;"), p.file);
  // Relative path (strip leading /)
  const rel = p.path.replace(/^\//, "");
  urlMap.set(rel, p.file);
  urlMap.set(rel.replace(/&/g, "&amp;"), p.file);
  // With leading /
  urlMap.set(p.path, p.file);
  urlMap.set(p.path.replace(/&/g, "&amp;"), p.file);
}

// Also map the base admin URL to dashboard
urlMap.set(BASE + "/", "01-dashboard.html");
urlMap.set(BASE, "01-dashboard.html");
urlMap.set("/", "01-dashboard.html");
urlMap.set("index.php", "01-dashboard.html");

// Clean and create output directories
for (const sub of ["before", "after"]) {
  const dir = path.join(OUT_DIR, sub);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });
}

let processed = 0;

for (const p of PAGES) {
  const srcPath = path.join(SRC_DIR, p.src);
  if (!fs.existsSync(srcPath)) {
    console.log(`⊘ skip ${p.src} (not found)`);
    continue;
  }
  let html = fs.readFileSync(srcPath, "utf-8");

  // Replace all admin URLs with local ASCII filenames
  for (const [url, localFile] of urlMap) {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`href="${escaped}"`, "g");
    html = html.replace(regex, `href="${localFile}"`);
  }

  // Also replace any Arabic filename hrefs with ASCII equivalents
  for (const pg of PAGES) {
    if (pg.src !== pg.file) {
      html = html.replace(new RegExp(`href="${pg.src.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&")}"`, "g"), `href="${pg.file}"`);
    }
  }

  // Catch-all: replace ANY remaining hrefs pointing to the CMS domain with "#"
  const cmsBase = "https://muslimat-admin-testing.removed";
  html = html.replace(new RegExp(`href="${cmsBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"]*"`, "g"), 'href="#"');
  // Also catch &amp; encoded versions
  html = html.replace(new RegExp(`href="${cmsBase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&amp;")}[^"]*"`, "g"), 'href="#"');

  // Fix sidebar width to 220px to fit Arabic text + close gap with admin bar
  const sidebarFix = `\n<style id="aalaam-sidebar-fix">
#adminmenu, #adminmenu .wp-submenu, #adminmenuback, #adminmenuwrap { width: 220px !important; }
#wpcontent, #wpfooter { margin-right: 220px !important; }
#adminmenu .wp-submenu { right: 220px !important; }
#wpadminbar { right: 0 !important; left: 0 !important; width: 100% !important; }
</style>\n`;
  html = html.replace("</head>", sidebarFix + "</head>");

  // Save "before" version with ASCII filename
  fs.writeFileSync(path.join(OUT_DIR, "before", p.file), html, "utf-8");

  // Inject override CSS before </head> for "after" version
  const cssInject = `\n<style id="aalaam-override">\n/* === Aalaam Admin Override CSS === */\n${overrideCSS}\n</style>\n`;
  const afterHtml = html.replace("</head>", cssInject + "</head>");

  fs.writeFileSync(path.join(OUT_DIR, "after", p.file), afterHtml, "utf-8");
  processed++;
  console.log(`✓ ${p.src} → ${p.file}`);
}

// Create index.html
const indexHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>أعلام — نموذج تفاعلي للتحسينات</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:"IBM Plex Sans Arabic",sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px}
h1{font-size:28px;font-weight:700;margin-bottom:8px;color:#fff}
.sub{color:#94a3b8;margin-bottom:40px;font-size:15px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:700px;width:100%}
.card{background:#1e293b;border:2px solid #334155;border-radius:16px;padding:32px;text-align:center;text-decoration:none;color:#e2e8f0;transition:.2s}
.card:hover{border-color:#16a34a;transform:translateY(-2px);box-shadow:0 8px 24px rgba(22,163,74,.15)}
.card h2{font-size:20px;font-weight:700;margin-bottom:8px}
.card p{color:#94a3b8;font-size:13px;line-height:1.7}
.card.before{border-color:#475569}
.card.before:hover{border-color:#ef4444;box-shadow:0 8px 24px rgba(239,68,68,.1)}
.badge{display:inline-block;padding:4px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:16px}
.badge.b{background:#1e293b;border:1px solid #ef4444;color:#ef4444}
.badge.a{background:#052e16;border:1px solid #16a34a;color:#22c55e}
.pages{color:#64748b;font-size:12px;margin-top:32px}
</style>
</head>
<body>
<h1>أعلام — نموذج تفاعلي</h1>
<p class="sub">اضغط على أحد الخيارين لتصفح لوحة التحكم كاملة</p>
<div class="grid">
  <a href="before/01-dashboard.html" class="card before">
    <span class="badge b">قبل التحسين</span>
    <h2>الوضع الحالي</h2>
    <p>لوحة التحكم كما هي حالياً — بدون أي تعديلات. كل الصفحات متصلة ببعضها عبر القائمة الجانبية.</p>
  </a>
  <a href="after/01-dashboard.html" class="card after">
    <span class="badge a">بعد التحسين</span>
    <h2>بعد تطبيق CSS</h2>
    <p>نفس الصفحات مع تطبيق ملف التنسيق المحسّن — ألوان، إخفاء عناصر، تحسين خطوط وأزرار.</p>
  </a>
</div>
<p class="pages">٤٨ صفحة × نسختين = ٩٦ صفحة قابلة للتصفح</p>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml, "utf-8");

console.log(`\nDone. ${processed} pages × 2 versions = ${processed * 2} files.`);
console.log("Open prototype/index.html to start.");
