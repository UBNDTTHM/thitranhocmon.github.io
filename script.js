// Lưu tin tức vào localStorage (tạm thời, sau sẽ cập nhật để lưu JSON)
function saveNews() {
    let title = document.getElementById("title").value;
    let summary = document.getElementById("summary").value;
    let image = document.getElementById("image").value;
    
    let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    
    let newNews = {
        title: title,
        summary: summary,
        image: image,
        date: new Date().toLocaleDateString()
    };
    
    newsList.push(newNews);
    localStorage.setItem("newsList", JSON.stringify(newsList));

    alert("Tin tức đã được lưu!");
}

// Đọc tin tức từ localStorage và hiển thị
function loadPublishedNews() {
    let newsList = JSON.parse(localStorage.getItem("newsList")) || [];
    let newsListDiv = document.getElementById("news-list");
    newsListDiv.innerHTML = "";

    newsList.forEach(news => {
        let newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
            <h2>${news.title}</h2>
            <p>${news.summary}</p>
            ${news.image ? `<img src="${news.image}" alt="Hình ảnh" style="max-width:100%;">` : ""}
            <p class="date">Ngày đăng: ${news.date}</p>
        `;
        newsListDiv.appendChild(newsItem);
    });
}

if (document.getElementById("news-list")) {
    loadPublishedNews();
}
