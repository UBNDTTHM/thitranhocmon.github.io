document.addEventListener("DOMContentLoaded", function () {
    loadNews();

    document.getElementById("news-form").addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("title").value;
        let summary = document.getElementById("summary").value;
        let content = document.getElementById("content").value;

        let newsList = JSON.parse(localStorage.getItem("news")) || [];
        let newId = newsList.length ? newsList[newsList.length - 1].id + 1 : 1;

        let newNews = { id: newId, title, summary, content };
        newsList.push(newNews);

        localStorage.setItem("news", JSON.stringify(newsList));

        document.getElementById("news-form").reset();
        loadNews();
    });
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
