document.addEventListener("DOMContentLoaded", () => {
    startMarquee();
    loadNews();
    showAdminPanel();
});

function startMarquee() {
    let marquee = document.getElementById("marquee-text");
    let containerWidth = document.querySelector(".marquee-container").offsetWidth;
    let textWidth = marquee.offsetWidth;
    let position = containerWidth;

    function move() {
        position -= 2;
        if (position < -textWidth) {
            position = containerWidth;
        }
        marquee.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(move);
    }

    move();
}

const ADMIN_PASSWORD = "Hieu@1990";

function checkLogin() {
    let password = document.getElementById("admin-password").value;
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true");
        showAdminPanel();
    } else {
        alert("Sai mật khẩu!");
    }
}

function logout() {
    localStorage.removeItem("isAdmin");
    location.reload();
}

function showAdminPanel() {
    let isAdmin = localStorage.getItem("isAdmin") === "true";
    document.getElementById("login-section").style.display = isAdmin ? "none" : "block";
    document.getElementById("news-form").style.display = isAdmin ? "block" : "none";
    document.getElementById("logout-button").style.display = isAdmin ? "block" : "none";
    document.querySelectorAll(".delete-button, .edit-button").forEach(button => {
        button.style.display = isAdmin ? "block" : "none";
    });
}

async function loadNews() {
    let newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "";

    try {
        let response = await fetch("news.json");
        let newsList = await response.json();

        newsList.forEach((news, index) => {
            let newAnnouncement = document.createElement("div");
            newAnnouncement.classList.add("announcement");
            newAnnouncement.innerHTML = `<h3 onclick="toggleNews(${index})" style="cursor:pointer; color:blue;">${news.title}</h3>
                                        <p id="news-content-${index}" style="display:none;">${news.content}</p>`;

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Xóa";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = function() { deleteNews(index); };
            newAnnouncement.appendChild(deleteButton);

            let editButton = document.createElement("button");
            editButton.textContent = "Chỉnh sửa";
            editButton.classList.add("edit-button");
            editButton.onclick = function() { editNews(index); };
            newAnnouncement.appendChild(editButton);

            newsContainer.prepend(newAnnouncement);
        });
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}
