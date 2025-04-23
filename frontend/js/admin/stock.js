let currentPage = 1;
let stockData = [];

// 🔹 지점별 데이터 불러오기
async function fetchBranchData(branches) {
    if (!branches || branches.length === 0) return;

    try {
        const query = branches.join(",");
        const response = await fetch(`http://tomhoon.duckdns.org:8883/api/admin/stock/data?branches=${query}`);
        if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await response.json();
        stockData = data;
        updateTable(data, 1);  // 처음 1페이지 렌더링
    } catch (error) {
        console.error("❌ 지점 데이터 오류:", error);
    }
}

// 🔹 테이블 렌더링 (페이지 단위)
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
        const statusClass = getStatusClass(row.orderStatus);
        const newRow = `
            <tr data-stock-id="${row.stockId}">
                <td>${startIndex + index + 1}</td>
                <td>${row.branchName}</td>
                <td>${row.menuName}</td>
                <td>${row.quantity}</td>
                <td class="order-status">${row.productStatus}</td>
                <td>
                    <div class="status-dropdown" data-stock-id="${row.stockId}">
                        <div class="status-btn-container">
                            <button class="status-btn ${statusClass}">
                                <span class="dot"></span> ${row.orderStatus}
                            </button>
                            <div class="arrow">▼</div>
                        </div>
                        <div class="status-menu">
                            <div class="select-container"><div class="status-option orange" data-status="확인중"><span class="dot"></span> 확인중</div></div>
                            <div class="select-container"><div class="status-option green" data-status="배송완료"><span class="dot"></span> 배송완료</div></div>
                            <div class="select-container"><div class="status-option pink" data-status="배송중"><span class="dot"></span> 배송중</div></div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", newRow);
    });

    renderPagination(data.length, page);
    initializeStatusDropdown();
}

// 🔹 페이지네이션 렌더링
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

// 🔹 상태 색상 클래스 반환
function getStatusClass(orderStatus) {
    switch (orderStatus) {
        case "확인중": return "orange";
        case "배송완료": return "green";
        case "배송중": return "pink";
        default: return "";
    }
}

// 🔹 상태 드롭다운 초기화
function initializeStatusDropdown() {
    const dropdowns = document.querySelectorAll(".status-dropdown");
    const statusMap = { "확인중": "orange", "배송완료": "green", "배송중": "pink" };

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector(".status-btn");
        const menu = dropdown.querySelector(".status-menu");

        button.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            menu.classList.toggle("active");
        });

        menu.querySelectorAll(".status-option").forEach(option => {
            option.addEventListener("click", () => {
                const status = option.dataset.status;
                const stockId = dropdown.dataset.stockId;
                showConfirmPopup("발주상태를 변경하시겠습니까?", () => {
                    fetch(`http://tomhoon.duckdns.org:8883/api/admin/stock/update/${stockId}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderStatus: status })
                    })
                        .then(res => res.json())
                        .then(() => {
                            button.className = `status-btn ${statusMap[status]}`;
                            button.innerHTML = `<span class="dot"></span> ${status}`;
                            menu.classList.remove("active");
                            dropdown.closest("tr").querySelector(".order-status").textContent = status;
                            showPopup("발주상태가 변경되었습니다.");
                        })
                        .catch(() => showPopup("상태 변경 중 오류가 발생했습니다."));
                });
            });
        });
    });
}

// 🔹 팝업 관련
function showPopup(message) {
    const popup = document.getElementById("status-popup");
    document.getElementById("popup-message").textContent = message;
    popup.classList.remove("hidden");
}

function showConfirmPopup(message, onConfirm) {
    const popup = document.getElementById("confirm-popup");
    document.getElementById("confirm-message").textContent = message;
    popup.classList.remove("hidden");

    const yes = document.getElementById("confirm-yes").cloneNode(true);
    const no = document.getElementById("confirm-no").cloneNode(true);

    yes.addEventListener("click", () => { popup.classList.add("hidden"); onConfirm(); });
    no.addEventListener("click", () => popup.classList.add("hidden"));

    document.getElementById("confirm-yes").replaceWith(yes);
    document.getElementById("confirm-no").replaceWith(no);
}

function closeAllDropdowns() {
    document.querySelectorAll(".status-menu").forEach(menu => menu.classList.remove("active"));
}

// 🔹 DOM 로드 시 초기화
document.addEventListener("DOMContentLoaded", () => {
    setupBranchButtons(fetchBranchData);
    document.getElementById("popup-close")?.addEventListener("click", () => {
        document.getElementById("status-popup").classList.add("hidden");
    });
    document.addEventListener("click", closeAllDropdowns);
});
