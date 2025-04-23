// 🔹 서버에서 지점별 데이터를 가져오는 함수 (예: fetch API 사용)
async function fetchBranchData(branch) {
    try {
        const response = await fetch(`/stock/data/${branch}`); // 서버에서 데이터 요청
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');

        const data = await response.json(); // JSON 변환
        updateTable(data); // 테이블 업데이트
    } catch (error) {
        console.error("Error fetching branch data:", error);
    }
}

// 🔹 테이블 업데이트 함수 (Pay 버튼 추가)
function updateTable(data) {
    const tableBody = document.querySelector(".stock-table-body");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>조회 내역이 없습니다.</td></tr>";
        return;
    }

    data.forEach((row, index) => {
        const imagePath = row.image ? row.image : "경로 없음";

        const newRow = `<tr>
            <td>${index + 1}</td>
            <td>${row.branchName}</td>
            <td>${row.menuName}</td>
            <td>${imagePath}</td>
            <td>${row.quantity}</td>
            <td>${row.productStatus}</td>
            <td>${row.orderStatus}</td>
            <td>
                <a href="#" class="pay-btn" data-menu="${row.menuName}" data-branch="${row.branchName}">
                    <img src="/stock/images/icon.png" alt="Pay" />
                </a>
            </td>
        </tr>`;
        tableBody.innerHTML += newRow;
    });

    // 🔹 Pay 버튼 클릭 이벤트 추가
    document.querySelectorAll(".pay-btn").forEach(button => {
        button.addEventListener("click", async function(event) {
            event.preventDefault(); // 기본 동작 방지 (페이지 이동 X)
    
            const menu = this.dataset.menu;
            const branch = this.dataset.branch;
    
            // 이미지 경로 동적 생성
            const imageUrl = `/flavor-images/${menu}.png`;
    
            // 배경 흐리게 처리 (팝업 배경 추가)
            const background = document.createElement("div");
            background.classList.add("popup-background");
            document.body.appendChild(background);
    
            // 팝업을 동적으로 생성
            const popup = document.createElement("div");
            popup.classList.add("popup");
    
            // 수량을 저장할 변수
            let quantity = 1;
    
            // 팝업 내용 추가
            popup.innerHTML = `
                <div class="content">
                    <img src="${imageUrl}" alt="${menu}" />
                    <p>${menu}</p>
                    <div class="quantity-control">
                        <button id="decrease-btn">-</button>
                        <span id="quantity">${quantity}</span>
                        <button id="increase-btn">+</button>
                    </div>
                    <div class="buttons">
                        <button class="cancel-btn">취소</button>
                        <button id="order-btn">발주하기</button>
                    </div>
                </div>
            `;
    
            // 팝업을 본문에 추가
            document.body.appendChild(popup);
    
            // 팝업 표시
            popup.style.display = "block";
    
            // 버튼 이벤트 핸들러
            popup.addEventListener("click", (e) => {
                if (e.target.id === "increase-btn") {
                    quantity++;
                    popup.querySelector("#quantity").textContent = quantity;
                }
                if (e.target.id === "decrease-btn" && quantity > 1) {
                    quantity--;
                    popup.querySelector("#quantity").textContent = quantity;
                }
                if (e.target.classList.contains("cancel-btn")) {
                    closePopup();
                }
                if (e.target.id === "order-btn") {
                    alert(`발주 완료: ${branch} - ${menu} (수량: ${quantity})`);
                    closePopup();
                }
            });
    
            function closePopup() {
                popup.style.display = "none";
                document.body.removeChild(popup);
                document.body.removeChild(background);
            }
        });
    });
    
}

// 🔹 첫 번째 지점 데이터를 기본으로 로드
document.addEventListener("DOMContentLoaded", function () {
    const firstBranch = document.querySelector(".branch-session button");
    if (firstBranch) {
        firstBranch.click(); // 첫 번째 버튼 자동 클릭 (초기 데이터 로드)
    }
});
