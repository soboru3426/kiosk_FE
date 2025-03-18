document.addEventListener("DOMContentLoaded", function () {
    // 헤더 불러오기
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        });

    // 푸터 불러오기
    // fetch("footer.html")
    //     .then(response => response.text())
    //     .then(data => {
    //         document.getElementById("footer-container").innerHTML = data;
    //     });

    // 닫기 버튼 동작 추가: 로컬 저장소 초기화 후 test.html로 이동
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("close-btn")) {
            localStorage.clear();  // 로컬 저장소 초기화
            window.location.href = "test.html";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        product.addEventListener("click", function () {
            const name = product.querySelector("p").textContent;
            const price = product.querySelector(".price").textContent
                           .replace("₩", "")
                           .replace(",", "");
            // 변경: product.html -> flavor.html
            window.location.href = `flavor.html?name=${encodeURIComponent(name)}&price=${price}`;
        });
    });
});
