document.addEventListener("DOMContentLoaded", function () {
    loadNews();
});

function loadNews() {
    let newsContainer = document.getElementById("news-container");
    let newsList = JSON.parse(localStorage.getItem("news")) || [];
    newsContainer.innerHTML = "";

    newsList.forEach(news => {
        let newsItem = document.createElement("div");
        newsItem.innerHTML = `
            <h3 class="news-title" onclick="showNews(${news.id})">${news.title}</h3>
            <p>${news.summary}</p>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function showNews(id) {
    let newsList = JSON.parse(localStorage.getItem("news")) || [];
    let selectedNews = newsList.find(news => news.id === id);

    if (selectedNews) {
        let newsContainer = document.getElementById("news-container");
        newsContainer.innerHTML = `
            <h2>${selectedNews.title}</h2>
            <p>${selectedNews.content}</p>
            <button onclick="loadNews()">Quay lại</button>
        `;
    }
}

function searchNews() {
    let searchText = document.getElementById("search").value.toLowerCase();
    let newsContainer = document.getElementById("news-container");
    let newsList = JSON.parse(localStorage.getItem("news")) || [];

    newsContainer.innerHTML = "";

    let filteredNews = newsList.filter(news => news.title.toLowerCase().includes(searchText));

    if (filteredNews.length === 0) {
        newsContainer.innerHTML = "<p>Không tìm thấy tin tức nào.</p>";
        return;
    }

    filteredNews.forEach(news => {
        let newsItem = document.createElement("div");
        newsItem.innerHTML = `
            <h3 class="news-title" onclick="showNews(${news.id})">${news.title}</h3>
            <p>${news.summary}</p>
        `;
        newsContainer.appendChild(newsItem);
    });
}

