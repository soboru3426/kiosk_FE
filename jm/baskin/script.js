document.addEventListener("DOMContentLoaded", function () {
    // 헤더 불러오기
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        });

    // 푸터 불러오기
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });

    // 닫기 버튼 동작 추가
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-btn")) {
            window.location.href = "index.html";
        }
    });
});
