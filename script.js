const GITHUB_USERNAME = "ubndtthm";  // Thay bằng GitHub username của bạn
const REPO_NAME = "thitranhocmon.github.io";  // Thay bằng repository của bạn
const FILE_PATH = "news.json";  // File lưu tin tức
const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;
const TOKEN = "GITHUB_PERSONAL_ACCESS_TOKEN"; // Bạn phải tự tạo token GitHub

// 📝 Lưu tin tức mới
async function saveNews() {
    let title = document.getElementById("title").value;
    let summary = document.getElementById("summary").value;
    let image = document.getElementById("image").value;
    let date = new Date().toISOString().split("T")[0];

    if (!title || !summary) {
        alert("Vui lòng nhập tiêu đề và tóm tắt!");
        return;
    }

    let newNews = { title, summary, image, date };

    // 1️⃣ Lấy dữ liệu cũ từ news.json
    let response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
    let data = await response.json();
    
    // 2️⃣ Thêm tin mới vào mảng
    data.unshift(newNews);

    // 3️⃣ Gửi dữ liệu mới lên GitHub
    let fileSHA = await getFileSHA();
    let content = btoa(JSON.stringify(data, null, 2)); // Mã hóa thành base64

    let updateResponse = await fetch(API_URL, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Cập nhật tin tức",
            content: content,
            sha: fileSHA
        })
    });

    if (updateResponse.ok) {
        alert("📝 Lưu tin tức thành công!");
        loadNews();  // Tải lại danh sách tin
    } else {
        alert("❌ Lưu thất bại! Kiểm tra lại GitHub Token.");
    }
}

// 🔍 Lấy SHA của file `news.json` trên GitHub
async function getFileSHA() {
    let response = await fetch(API_URL, {
        headers: { "Authorization": `token ${TOKEN}` }
    });
    let data = await response.json();
    return data.sha;
}

// 📥 Tải danh sách tin tức lên trang Admin
async function loadNews() {
    let response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
    let newsList = await response.json();
    let newsListDiv = document.getElementById("news-list");
    newsListDiv.innerHTML = "";

    newsList.forEach((news, index) => {
        let newsItem = document.createElement("div");
        newsItem.classList.add("news-item");
        newsItem.innerHTML = `
            <h2>${news.title}</h2>
            <p>${news.summary}</p>
            ${news.image ? `<img src="${news.image}" alt="Hình ảnh" style="max-width:100%;">` : ""}
            <p class="date">Ngày đăng: ${news.date}</p>
            <button onclick="deleteNews(${index})">🗑 Xóa</button>
        `;
        newsListDiv.appendChild(newsItem);
    });
}

// ❌ Xóa tin tức
async function deleteNews(index) {
    let response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${FILE_PATH}`);
    let data = await response.json();

    data.splice(index, 1);  // Xóa tin theo index

    let fileSHA = await getFileSHA();
    let content = btoa(JSON.stringify(data, null, 2));

    let updateResponse = await fetch(API_URL, {
        method: "PUT",
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Xóa tin tức",
            content: content,
            sha: fileSHA
        })
    });

    if (updateResponse.ok) {
        alert("🗑 Xóa tin tức thành công!");
        loadNews();  // Cập nhật lại danh sách tin
    } else {
        alert("❌ Xóa thất bại! Kiểm tra lại GitHub Token.");
    }
}

// Tải tin tức khi trang Admin mở
document.addEventListener("DOMContentLoaded", loadNews);
