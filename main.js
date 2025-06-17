const API_KEY = "d5bacaddfa9ef9eb2bf8c7d681869330";
const PAGE_SIZE = 10;

// HTML referansları
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

// Tema yükleme
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

// Tema değiştirme
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  darkModeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// Sayfalama tıklama
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

// Arama ve filtreleri resetle
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

// Ana veri çekme fonksiyonu
async function fetchNews() {
  newsContainer.innerHTML = "<p>Yükleniyor...</p>";
  paginationContainer.innerHTML = "";

  const trimmedQuery = currentQuery.trim();
  const url = new URL("https://api.mediastack.com/v1/news");

  if (trimmedQuery) {
    url.searchParams.append("keywords", trimmedQuery);
  } else {
    if (currentCountry) url.searchParams.append("countries", currentCountry);
    if (currentCategory) url.searchParams.append("categories", currentCategory);
  }

  url.searchParams.append("limit", PAGE_SIZE);
  url.searchParams.append("offset", (currentPage - 1) * PAGE_SIZE);
  url.searchParams.append("access_key", API_KEY);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      newsContainer.innerHTML = `<p style="color:red;">Hiç haber bulunamadı.</p>`;
      return;
    }

    totalResults = data.pagination.total;
    displayNews(data.data);
    setupPagination();
  } catch (error) {
    newsContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// Haberleri görüntüleme
function displayNews(articles) {
  newsContainer.innerHTML = articles
    .map((article) => {
      const publishedAt = new Date(article.published_at).toLocaleString("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      return `
    <article>
      <h2>${article.title}</h2>
      ${article.image ? `<img src="${article.image}" alt="${article.title}" />` : ""}
      <p>${article.description || ""}</p>
      <p><small>Yayınlanma: ${publishedAt}</small></p>
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">Devamını oku</a>
    </article>
    `;
    })
    .join("");
}

// Sayfalama kur
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
    if (endPage < totalPages - 1) paginationContainer.innerHTML += `<span>...</span>`;
    paginationContainer.innerHTML += `<button data-page="${totalPages}">${totalPages}</button>`;
  }
}

// Uygulamayı başlat
loadTheme();
fetchNews();
