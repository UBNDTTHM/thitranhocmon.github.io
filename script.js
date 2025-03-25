const GITHUB_RAW_URL = "https://raw.githubusercontent.com/ubndtthm/thitranhocmon.github.io/main/news.json";
const GITHUB_API_URL = "https://api.github.com/repos/ubndtthm/thitranhocmon.github.io/contents/news.json";
const TOKEN = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"; // Thay bằng Token GitHub của bạn

// 📝 Tải danh sách tin tức
async function loadPublishedNews() {
    try {
        let response = await fetch(GITHUB_RAW_URL);
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
                <button onclick="editNews(${index})">✏️ Chỉnh sửa</button>
                <button onclick="deleteNews(${index})">🗑️ Xóa</button>
            `;
            newsListDiv.appendChild(newsItem);
        });
    } catch (error) {
        console.error("Lỗi tải tin tức:", error);
        document.getElementById("news-list").innerHTML = "<p>Lỗi tải tin tức!</p>";
    }
}

// 📝 Lưu tin tức vào GitHub
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
    await updateNewsFile(newsList);
}

// ✏️ Chỉnh sửa tin tức
async function editNews(index) {
    let response = await fetch(GITHUB_RAW_URL);
    let newsList = await response.json();

    let newTitle = prompt("Nhập tiêu đề mới:", newsList[index].title);
    let newSummary = prompt("Nhập nội dung mới:", newsList[index].summary);
    let newImage = prompt("Nhập đường dẫn ảnh mới:", newsList[index].image);

    if (newTitle !== null && newSummary !== null) {
        newsList[index].title = newTitle;
        newsList[index].summary = newSummary;
        newsList[index].image = newImage;
        await updateNewsFile(newsList);
        alert("Tin tức đã được cập nhật!");
        loadPublishedNews();
    }
}

// 🗑️ Xóa tin tức
async function deleteNews(index) {
    let response = await fetch(GITHUB_RAW_URL);
    let newsList = await response.json();

    if (confirm("Bạn có chắc muốn xóa tin tức này?")) {
        newsList.splice(index, 1);
        await updateNewsFile(newsList);
        alert("Tin tức đã bị xóa!");
        loadPublishedNews();
    }
}

// 🔄 Cập nhật file `news.json` trên GitHub
async function updateNewsFile(newsList) {
    let updatedContent = JSON.stringify(newsList, null, 4);

    let getFile = await fetch(GITHUB_API_URL, {
        headers: {
            "Authorization": `token ${TOKEN}`,
            "Accept": "application/vnd.github.v3+json"
        }
    });
    let fileData = await getFile.json();
    
    await fetch(GITHUB_API_URL, {
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
}

// 🛠 Tự động tải tin tức khi mở trang
if (document.getElementById("news-list")) {
    loadPublishedNews();
}
