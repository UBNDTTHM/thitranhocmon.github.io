document.addEventListener("DOMContentLoaded", function() {
    fetch("news.json")
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById("news-container");
            newsContainer.innerHTML = ""; // Xóa nội dung cũ

            data.forEach(news => {
                const newsItem = document.createElement("div");
                newsItem.innerHTML = `
                    <h3 class="news-title" onclick="showNews(${news.id})">${news.title}</h3>
                    <p>${news.summary}</p>
                `;
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => console.error("Lỗi khi tải tin tức:", error));
});

function showNews(id) {
    fetch("news.json")
        .then(response => response.json())
        .then(data => {
            const selectedNews = data.find(news => news.id === id);
            if (selectedNews) {
                const newsContainer = document.getElementById("news-container");
                newsContainer.innerHTML = `
                    <h2>${selectedNews.title}</h2>
                    <p>${selectedNews.content}</p>
                    <button onclick="location.reload()">Quay lại danh sách</button>
                `;
            }
        })
        .catch(error => console.error("Lỗi khi tải nội dung tin tức:", error));
}
