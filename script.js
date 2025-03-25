async function loadNews() {
    let response = await fetch("news.json");
    let newsList = await response.json();
    let newsContainer = document.getElementById("news-list");
    newsContainer.innerHTML = "";

    newsList.forEach((news, index) => {
        let newsItem = document.createElement("div");
        newsItem.innerHTML = `
            <h2>${news.title}</h2>
            <p>${news.summary}</p>
            <p>Ngày đăng: ${news.date}</p>
            <button onclick="editNews(${index})">✏️ Sửa</button>
            <button onclick="deleteNews(${index})">❌ Xóa</button>
        `;
        newsContainer.appendChild(newsItem);
    });
}

function addNews() {
    let title = prompt("Nhập tiêu đề tin:");
    let summary = prompt("Nhập nội dung tóm tắt:");
    let date = new Date().toISOString().split("T")[0];

    let news = { title, summary, date };
    let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    newsList.push(news);
    localStorage.setItem("newsList", JSON.stringify(newsList));

    saveToJson(newsList); // Lưu lên GitHub
    loadNews();
}

function editNews(index) {
    let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    let news = newsList[index];

    let newTitle = prompt("Sửa tiêu đề:", news.title);
    let newSummary = prompt("Sửa nội dung:", news.summary);

    if (newTitle && newSummary) {
        newsList[index] = { ...news, title: newTitle, summary: newSummary };
        localStorage.setItem("newsList", JSON.stringify(newsList));
        saveToJson(newsList);
        loadNews();
    }
}

function deleteNews(index) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
        newsList.splice(index, 1);
        localStorage.setItem("newsList", JSON.stringify(newsList));
        saveToJson(newsList);
        loadNews();
    }
}

async function saveToJson(newsList) {
    let jsonData = JSON.stringify(newsList, null, 2);

    // Gửi dữ liệu lên GitHub (cần GitHub API)
    console.log("Bạn cần sử dụng GitHub API để cập nhật news.json");
}

loadNews();
