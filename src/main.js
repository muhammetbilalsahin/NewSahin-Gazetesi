const API_KEY = "1a9c2c3d0161409d90664db4ec9aec3f";
const PAGE_SIZE = 10;
// HTML element referansları
const newsContainer = document.getElementById("news");
const paginationContainer = document.getElementById("pagination");
const countrySelect = document.getElementById("countrySelect");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

let currentPage = 1;
let totalResults = 0;
let currentQuery = "";
let currentCountry = countrySelect.value;
let currentCategory = categorySelect.value;
// Karanlık modun yüklenmesi
function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark");
    darkModeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    darkModeToggle.textContent = "🌙";
  }
}
// Karanlık mod butonuna tıklama olayını dinleme
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    darkModeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    darkModeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
// Sayfalama butonlarına tıklama olayını dinleme
paginationContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const page = Number(e.target.dataset.page);
    if (page && page !== currentPage) {
      currentPage = page;
      fetchNews();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});
// Ülke ve kategori seçimlerini resetleyip haberleri yeniden yükleme
function resetAndFetch() {
  currentPage = 1;
  currentCountry = countrySelect.value;
  currentCategory = categorySelect.value;
  currentQuery = searchInput.value.trim();
  fetchNews();
}

countrySelect.addEventListener("change", resetAndFetch);
categorySelect.addEventListener("change", resetAndFetch);
searchBtn.addEventListener("click", resetAndFetch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    resetAndFetch();
  }
});
// İlk yükleme
async function fetchNews() {
  newsContainer.innerHTML = "<p>Yükleniyor...</p>";
  paginationContainer.innerHTML = "";

  const trimmedQuery = currentQuery.trim();
  const isSearch = Boolean(trimmedQuery);

  let url = new URL(
    isSearch
      ? "https://newsapi.org/v2/everything"
      : "https://newsapi.org/v2/top-headlines"
  );

  if (isSearch) {
    url.searchParams.append("q", trimmedQuery);
    url.searchParams.append("language", getLangFromCountry(currentCountry));
    url.searchParams.append("sortBy", "publishedAt");
  } else {
    url.searchParams.append("country", currentCountry);
    if (currentCategory) {
      url.searchParams.append("category", currentCategory);
    }
  }

  url.searchParams.append("pageSize", PAGE_SIZE);
  url.searchParams.append("page", currentPage);
  url.searchParams.append("apiKey", API_KEY);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (
      !isSearch &&
      data.status === "ok" &&
      data.totalResults === 0 &&
      currentCountry
    ) {
      const backupQuery = getBackupKeyword(currentCategory);
      const backupUrl = new URL("http://newsapi.org/v2/everything");
      backupUrl.searchParams.append("q", backupQuery);
      backupUrl.searchParams.append(
        "language",
        getLangFromCountry(currentCountry)
      );
      backupUrl.searchParams.append("sortBy", "publishedAt");
      backupUrl.searchParams.append("pageSize", PAGE_SIZE);
      backupUrl.searchParams.append("page", currentPage);
      backupUrl.searchParams.append("apiKey", API_KEY);

      const backupRes = await fetch(backupUrl.toString());
      const backupData = await backupRes.json();

      if (backupData.status === "ok" && backupData.totalResults > 0) {
        totalResults = backupData.totalResults;
        displayNews(backupData.articles);
        setupPagination();
        return;
      }
    }

    if (data.status !== "ok")
      throw new Error(data.message || "Bilinmeyen API hatası");

    totalResults = data.totalResults;

    if (totalResults === 0) {
      newsContainer.innerHTML = `<p style="color:red;">Hiç haber bulunamadı.</p>`;
      return;
    }

    displayNews(data.articles);
    setupPagination();
  } catch (error) {
    newsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    paginationContainer.innerHTML = "";
  }
}

// Yedek anahtar kelime belirleme fonksiyonu
function getBackupKeyword(category) {
  const map = {
    general: "haber",
    technology: "teknoloji",
    sports: "spor",
    health: "sağlık",
    science: "bilim",
    business: "ekonomi",
    entertainment: "magazin",
  };
  return map[category] || "haber";
}
// Ülke koduna göre dil belirleme fonksiyonu
function getLangFromCountry(countryCode) {
  const map = {
    tr: "tr",
    gb: "en",
    us: "en",
    de: "de",
    fr: "fr",
  };
  return map[countryCode] || "en";
}
// Haberleri görüntüleme fonksiyonu
function displayNews(articles) {
  newsContainer.innerHTML = articles
    .map((article) => {
      const publishedAt = new Date(article.publishedAt).toLocaleString(
        "tr-TR",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
      return `
    <article>
      <h2>${article.title}</h2>
      ${
        article.urlToImage
          ? `<img src="${article.urlToImage}" alt="${article.title}">`
          : ""
      }
      <p>${article.description || ""}</p>
      <p><small>Yayınlanma: ${publishedAt}</small></p>
      <a href="${
        article.url
      }" target="_blank" rel="noopener noreferrer">Devamını oku</a>
    </article>
    `;
    })
    .join("");
}
// sayfalama fonksiyonu
function setupPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.min(Math.ceil(totalResults / PAGE_SIZE), 50);

  if (totalPages <= 1) return;

  const maxButtons = 7;
  let startPage = Math.max(1, currentPage - 3);
  let endPage = Math.min(totalPages, currentPage + 3);

  if (endPage - startPage + 1 < maxButtons) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxButtons - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
  }

  if (startPage > 1) {
    paginationContainer.innerHTML += `<button data-page="1">1</button>`;
    if (startPage > 2) paginationContainer.innerHTML += `<span>...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.innerHTML += `<button data-page="${i}" ${
      i === currentPage ? 'disabled style="font-weight:bold;"' : ""
    }>${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1)
      paginationContainer.innerHTML += `<span>...</span>`;
    paginationContainer.innerHTML += `<button data-page="${totalPages}">${totalPages}</button>`;
  }
}

loadTheme();
fetchNews();
