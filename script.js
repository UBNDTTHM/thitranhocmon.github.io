const GITHUB_RAW_URL = "https://raw.githubusercontent.com/USERNAME/REPO/main/news.json";
const GITHUB_API_URL = "https://api.github.com/repos/USERNAME/REPO/contents/news.json";
const TOKEN = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"; // Nhớ thay bằng Token của bạn

// 📝 Đọc nội dung từ `news.json`
async function loadPublishedNews() {
    try {
        let response = await fetch(GITHUB_RAW_URL);
        let newsList = await response.json();

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
    } catch (error) {
        console.error("Lỗi tải tin tức:", error);
        document.getElementById("news-list").innerHTML = "<p>Lỗi tải tin tức!</p>";
    }
}

// 📝 Lưu tin tức vào `news.json` trên GitHub
async function saveNews() {
    let title = document.getElementById("title").value;
    let summary = document.getElementById("summary").value;
    let image = document.getElementById("image").value;

    let response = await fetch(GITHUB_RAW_URL);
    let newsList = await response.json();

    let newNews = {
        title: title,
        summary: summary,
        image: image,
        date: new Date().toLocaleDateString()
    };

    newsList.push(newNews);
    let updatedContent = JSON.stringify(newsList, null, 4);

    // 📝 Cập nhật file `news.json` trên GitHub
    let getFile = await fetch(GITHUB_API_URL, {
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });
    let fileData = await getFile.json();
    
    let update = await fetch(GITHUB_API_URL, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
            message: "Cập nhật tin tức",
            content: btoa(updatedContent),
            sha: fileData.sha
        })
    });

    if (update.ok) {
        alert("Tin tức đã được lưu!");
    } else {
        alert("Lỗi khi lưu tin tức!");
    }
}

// 🛠 Nếu là trang hiển thị tin tức, tự động tải tin tức
if (document.getElementById("news-list")) {
    loadPublishedNews();
}
