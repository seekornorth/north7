/**
 * North7 WebMCP (Web Model Context Protocol) In-Browser Agent Tools
 * Conforms to W3C WebML WebMCP standard & Google Chrome Model Context Specification
 * Enables AI agents to discover, interact with, and query North7 directly in-browser.
 */

(function initWebMCP() {
  async function registerNorth7Tools() {
    const modelContext = (typeof document !== 'undefined' && document.modelContext) ||
                         (typeof window !== 'undefined' && window.navigator && window.navigator.modelContext);

    if (!modelContext || typeof modelContext.registerTool !== 'function') {
      return;
    }

    // Tool 1: search_articles
    try {
      await modelContext.registerTool({
        name: "search_articles",
        title: "Cari Artikel North7",
        description: "Mencari artikel panduan Linux, konfigurasi jaringan networking, tips smartphone, dan berita teknologi di North7.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Kata kunci pencarian (contoh: adguard, wireguard, tailscale, ufw, baterai iphone, netplan)."
            }
          },
          required: ["query"]
        },
        annotations: {
          readOnlyHint: true
        },
        execute: async ({ query }) => {
          const searchInput = document.getElementById("search-query");
          const searchWrapper = document.getElementById("search-wrapper");
          
          if (searchWrapper && searchWrapper.classList.contains("invisible")) {
            searchWrapper.classList.remove("invisible");
          }

          if (searchInput) {
            searchInput.value = query;
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
          }

          return {
            status: "success",
            query: query,
            message: `Pencarian untuk '${query}' berhasil dijalankan di blog North7.`
          };
        }
      });
    } catch (err) {
      console.debug("WebMCP register search_articles notice:", err);
    }

    // Tool 2: get_article_content
    try {
      await modelContext.registerTool({
        name: "get_article_content",
        title: "Baca Konten Artikel",
        description: "Mengambil teks lengkap atau ringkasan artikel yang sedang dibuka beserta metadata judul dan penulis.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        annotations: {
          readOnlyHint: true
        },
        execute: async () => {
          const articleEl = document.querySelector("article");
          const h1 = document.querySelector("h1")?.innerText || document.title;
          const author = document.querySelector("[rel='author']")?.innerText || "Redaksi North7";
          return {
            title: h1,
            author: author,
            url: window.location.href,
            content: articleEl ? articleEl.innerText.slice(0, 15000) : document.body.innerText.slice(0, 5000)
          };
        }
      });
    } catch (err) {
      console.debug("WebMCP register get_article_content notice:", err);
    }

    // Tool 3: get_site_navigation
    try {
      await modelContext.registerTool({
        name: "get_site_navigation",
        title: "Daftar Navigasi & Kategori",
        description: "Mengambil daftar tautan kategori utama dan endpoint discovery AI di blog North7.",
        inputSchema: {
          type: "object",
          properties: {}
        },
        annotations: {
          readOnlyHint: true
        },
        execute: async () => {
          return {
            site: "North7 (https://north7.biz.id)",
            categories: [
              { name: "Linux", url: "https://north7.biz.id/kategori/linux/" },
              { name: "Networking", url: "https://north7.biz.id/kategori/networking/" },
              { name: "Teknologi", url: "https://north7.biz.id/kategori/teknologi/" },
              { name: "Ulasan", url: "https://north7.biz.id/kategori/ulasan/" }
            ],
            endpoints: {
              llms_txt: "https://north7.biz.id/llms.txt",
              llms_full_txt: "https://north7.biz.id/llms-full.txt",
              ai_catalog: "https://north7.biz.id/.well-known/ai-catalog.json",
              webmcp_schema: "https://north7.biz.id/webmcp.json",
              rss: "https://north7.biz.id/index.xml",
              sitemap: "https://north7.biz.id/sitemap.xml"
            }
          };
        }
      });
    } catch (err) {
      console.debug("WebMCP register get_site_navigation notice:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerNorth7Tools);
  } else {
    registerNorth7Tools();
  }
})();
