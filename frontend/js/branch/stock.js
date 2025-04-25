let currentPage = 1;
let stockData = [];
let currentFilter = "menuName"; // 기본 필터

// 🔹 지점 데이터 가져오기
async function fetchBranchData(branches) {
    if (!branches || branches.length === 0) return;

    try {
        const query = branches.join(",");
        const response = await fetch(`http://tomhoon.duckdns.org:8883/api/branch/stock/data?branches=${query}`);
        if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await response.json();
        stockData = data;
        updateTable(data, 1);
    } catch (error) {
        console.error("❌ 지점별 데이터 오류:", error);
    }
}

// 🔹 테이블 렌더링
function updateTable(data, page = 1) {
    currentPage = page;
    const tableBody = document.querySelector(".stock-table-body");
    const emptyMessage = document.querySelector(".empty-message");
    const maxRows = 10;
    const startIndex = (page - 1) * maxRows;
    const pageItems = data.slice(startIndex, startIndex + maxRows);

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyMessage.style.display = "block";
        return;
    } else {
        emptyMessage.style.display = "none";
    }

    pageItems.forEach((row, index) => {
        const imagePath = row.image || "경로 없음";
        tableBody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${startIndex + index + 1}</td>
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
    });

    if (pageItems.length < maxRows) {
        for (let i = pageItems.length; i < maxRows; i++) {
            tableBody.insertAdjacentHTML("beforeend", `
                <tr class="empty-row">
                    <td colspan="8" style="color: #ccc; text-align: center;">-</td>
                </tr>
            `);
        }
    }

    renderPagination(data.length, page);

    document.querySelectorAll(".pay-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            showOrderPopup(this.dataset.menu, this.dataset.branch);
        });
    });
}

// 🔹 페이지네이션
function renderPagination(totalItems, currentPage) {
    let wrapper = document.querySelector(".pagination-wrapper");
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "pagination-wrapper";
        document.querySelector(".stock-session").appendChild(wrapper);
    }
    wrapper.innerHTML = "";

    const totalPages = Math.ceil(totalItems / 10);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.classList.add("pagination-btn");
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => updateTable(stockData, i));
        wrapper.appendChild(btn);
    }
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

// 🔹 필터 설정 및 반응
document.addEventListener("DOMContentLoaded", () => {
    setupBranchButtons(fetchBranchData);

    const filterSelect = document.querySelector(".filter-select");
    const filterInput = document.querySelector(".filter-input");

    // 필터 select 변경 시
    filterSelect.addEventListener("change", () => {
        currentFilter = filterSelect.value;
        const label = filterSelect.options[filterSelect.selectedIndex].textContent;
        filterInput.placeholder = `${label}을 입력해주세요`;
        filterTable(filterInput.value);
    });

    // 검색어 입력 시
    filterInput.addEventListener("input", (e) => {
        filterTable(e.target.value);
    });
});

// 🔹 테이블 필터링
function filterTable(keyword) {
    const filtered = stockData.filter(item => {
        if (!keyword.trim()) return true;
        const value = item[currentFilter] || "";
        return value.toLowerCase().includes(keyword.toLowerCase());
    });
    updateTable(filtered, 1);
}
