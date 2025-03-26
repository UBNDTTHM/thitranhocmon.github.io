document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");

    db.collection("news").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let article = document.createElement("div");
            article.innerHTML = `<h2>${data.title}</h2><p>${data.content}</p>`;
            newsContainer.appendChild(article);
        });
    });
});
