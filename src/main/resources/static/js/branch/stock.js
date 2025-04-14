// 🔹 서버에서 지점별 데이터 가져오기 (다중 지원)
async function fetchBranchData(branches) {
    if (!branches || branches.length === 0) return;

    try {
        const query = branches.join(",");
        console.log("📡 요청:", `/stock/data?branches=${query}`);
        const response = await fetch(`/stock/data?branches=${query}`);
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');
        const data = await response.json();
        console.log("✅ 응답:", data);
        updateTable(data);
    } catch (error) {
        console.error("❌ Error fetching branch data:", error);
    }
}

// 🔹 테이블 렌더링
function updateTable(data) {
    const tableBody = document.querySelector(".stock-table-body");
    const emptyMessage = document.querySelector(".empty-message");
    tableBody.innerHTML = "";

    const maxRows = 10;
    const dataLength = data.length;
    if (data.length === 0) {
        emptyMessage.style.display = "block";
        return;
    } else {
        emptyMessage.style.display = "none";
    }    
    const validRows = Math.min(dataLength, maxRows);

    // 데이터 있는 행 렌더링
    for (let i = 0; i < validRows; i++) {
        const row = data[i];
        const imagePath = row.image || "경로 없음";
        tableBody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${i + 1}</td>
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
            </tr>
        `);
    }

    // 나머지 빈 행 렌더링
    for (let i = validRows; i < maxRows; i++) {
        tableBody.insertAdjacentHTML("beforeend", `
            <tr class="empty-row">
                <td></td>
                <td colspan="7" style="color: #ccc; text-align: center;">-</td>
            </tr>
        `);
    }

    // 발주 팝업 이벤트 등록 (있는 데이터만)
    document.querySelectorAll(".pay-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const menu = this.dataset.menu;
            const branch = this.dataset.branch;
            showOrderPopup(menu, branch);
        });
    });
}


// 🔹 발주 팝업
function showOrderPopup(menu, branch) {
    const imageUrl = `/flavor-images/${menu}.png`;
    const background = document.createElement("div");
    background.classList.add("popup-background");
    document.body.appendChild(background);

    const popup = document.createElement("div");
    popup.classList.add("popup");

    let quantity = 1;

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
    document.body.appendChild(popup);

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
        popup.remove();
        background.remove();
    }
}

// 🔹 페이지 로딩 시 실행
document.addEventListener("DOMContentLoaded", () => {
    setupBranchButtons(fetchBranchData); // common.js에서 전달받은 콜백
});