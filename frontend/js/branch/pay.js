
let currentPage = 1;
let payData = [];
let modalContainer = null;

// 🔹 서버에서 지점별 데이터 가져오기
async function fetchBranchData(branchIds) {
    if (!branchIds || branchIds.length === 0) return;

    try {
        const query = branchIds.join(",");
        const response = await fetch(`http://tomhoon.duckdns.org:8883/api/admin/pay/branches?ids=${query}`);
        if (!response.ok) throw new Error("지점별 결제 내역을 불러오지 못했습니다.");
        const data = await response.json();
        payData = data;
        updatePayTable(data, 1);
    } catch (error) {
        console.error(`❌ Error fetching branch data:`, error);
    }
}

// 🔹 결제 내역 테이블 업데이트 (페이지 단위)
function updatePayTable(data, page = 1) {
    currentPage = page;
    const tableBody = document.querySelector(".stock-table-body");
    const emptyMessage = document.querySelector(".empty-message");
    const maxRows = 10;

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }

    emptyMessage.style.display = "none";

    const startIndex = (page - 1) * maxRows;
    const currentItems = data.slice(startIndex, startIndex + maxRows);

    currentItems.forEach((pay, index) => {
        const paymentMethod = pay.paymentMethod || "N/A";
        const productName = pay.productName || "N/A";
        const finalAmount = pay.finalAmount ? `${pay.finalAmount.toLocaleString()}원` : "N/A";
        const paymentDate = pay.paymentDate ? new Date(pay.paymentDate).toLocaleString("ko-KR") : "N/A";
        const branchName = pay.branchName || "N/A";
        const serialNumber = pay.serialNumber || "N/A";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${paymentMethod}</td>
            <td>${productName}</td>
            <td>${finalAmount}</td>
            <td>${paymentDate}</td>
            <td>${branchName}</td>
            <td>${serialNumber}</td>
        `;

        row.addEventListener("click", () => {
            const subItems = JSON.parse(pay.subItemsJson || "[]");
            showSubItemDetailModal(subItems);
        });

        tableBody.appendChild(row);
    });

    renderPagination(data.length, page);
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
        btn.addEventListener("click", () => updatePayTable(payData, i));
        wrapper.appendChild(btn);
    }
}

// 🔹 상세보기 모달
function showSubItemDetailModal(subItems) {
    const getTypeLabel = (type) => {
        switch (type) {
            case 'cup': return '컵';
            case 'cone': return '콘';
            case 'waffle': return '와플콘';
            case 'noOption': return '단품';
            default: return type;
        }
    };

    let allSubItems = [];

    if (Array.isArray(subItems) && subItems.length > 0) {
        if (subItems[0]?.flavors) {
            allSubItems = subItems;
        } else if (subItems[0]?.subItems) {
            subItems.forEach(order => {
                if (order.subItems) {
                    order.subItems.forEach(sub => {
                        sub.productName = order.name;
                        allSubItems.push(sub);
                    });
                }
            });
        }
    }

    const html = allSubItems.map(sub => {
        const finalAmount = (sub.unitPrice || 0) * (sub.quantity || 1);
        return `
            <div class="subitem-row">
                <div><strong>${sub.productName || '상품명 없음'} [${getTypeLabel(sub.type)}]</strong></div>
                <div>수량: ${sub.quantity}개</div>
                <div>가격: ${finalAmount.toLocaleString()}원</div>
                <div>${sub.flavors.join(" / ")}</div>
            </div>
        `;
    }).join("");

    const modal = document.createElement("div");
    modal.className = "subitem-modal";
    modal.innerHTML = `
        <div class="subitem-modal-content">
            <h3>선택한 맛 정보</h3>
            <div class="subitem-list">${html}</div>
            <button class="close-modal-btn">닫기</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-modal-btn").addEventListener("click", () => modal.remove());
}

// 🔹 필터 모달 생성
function createFilterModal() {
    if (modalContainer) return;
    modalContainer = document.createElement("div");
    modalContainer.classList.add("modalContainer");
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <div class="modal-wrapper">
                    <div class="modal-body">
                        <div class="date-picker">
                            <div class="date-wrapper">
                                <label>From</label>
                                <div class="input-wrapper">
                                    <input type="date" class="date-input" value="2025-03-25">
                                    <img src="/pay/images/calendar.png" class="calendar-icon">
                                </div>
                            </div>
                            <div class="date-wrapper">
                                <label>To</label>
                                <div class="input-wrapper">
                                    <input type="date" class="date-input" value="2025-03-25">
                                    <img src="/pay/images/calendar.png" class="calendar-icon">
                                </div>
                            </div>
                        </div>
                        <div class="date-buttons">
                            <button class="date-btn">Today</button>
                            <button class="date-btn">This Week</button>
                            <button class="date-btn">This Month</button>
                        </div>
                        <div class="sort-section">
                            <label>Sort by</label>
                            <select><option>오름차순</option></select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="reset-btn">리셋</button>
                        <button class="apply-btn">적용하기</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalContainer);
    attachModalEvents();
}

// 🔹 필터 모달 이벤트
function attachModalEvents() {
    modalContainer.querySelectorAll(".calendar-icon").forEach(icon => {
        icon.addEventListener("click", () => {
            const input = icon.previousElementSibling;
            input?.showPicker();
        });
    });

    modalContainer.querySelector(".date-buttons").addEventListener("click", (e) => {
        if (e.target.classList.contains("date-btn")) {
            modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
        }
    });

    modalContainer.querySelector(".reset-btn").addEventListener("click", () => {
        modalContainer.querySelectorAll(".date-input").forEach(input => input.value = "2025-03-25");
        modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
    });

    modalContainer.querySelector(".apply-btn").addEventListener("click", async () => {
        const from = modalContainer.querySelectorAll(".date-input")[0].value;
        const to = modalContainer.querySelectorAll(".date-input")[1].value;
        const currentBranch = document.querySelector(".branch-btn.active")?.dataset.branch || 1;
        try {
            const res = await fetch(`http://tomhoon.duckdns.org:8883/api/admin/pay/filter?ids=${currentBranch}&from=${from}&to=${to}`);
            if (!res.ok) throw new Error("필터 데이터를 불러올 수 없습니다.");
            const filteredData = await res.json();
            payData = filteredData;
            updatePayTable(filteredData, 1);
        } catch (e) {
            console.error("❌ 필터 fetch 오류:", e);
        }
        closeModal();
    });

    modalContainer.addEventListener("click", (e) => {
        if (!modalContainer.querySelector(".modal-content").contains(e.target)) closeModal();
    });
}

function closeModal() {
    modalContainer?.remove();
    modalContainer = null;
}

// 🔹 지점 버튼 초기화
function setupBranchButtons(fetchCallback) {
    const buttons = document.querySelectorAll(".branch-session button");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const isActive = this.classList.contains("active");
            const activeButtons = document.querySelectorAll(".branch-session button.active");
            const isAutoClick = this.dataset.autoClick === "true";
            if (!isAutoClick && isActive && activeButtons.length === 1) {
                alert("최소 하나의 지점은 선택되어 있어야 합니다.");
                return;
            }
            this.classList.toggle("active");
            const selectedBranches = Array.from(document.querySelectorAll(".branch-session button.active")).map(btn => btn.dataset.branch);
            if (fetchCallback) fetchCallback(selectedBranches);
        });
    });
    const first = document.querySelector(".branch-session button");
    if (first) {
        first.dataset.autoClick = "true";
        first.classList.add("active");
        if (fetchCallback) fetchCallback([first.dataset.branch]);
        delete first.dataset.autoClick;
    }
}

// 🔹 페이지 이동
document.querySelector('.stock-link')?.addEventListener('click', () => {
    window.location.href = '/branch/stock.html';
});
document.querySelector('.pay-link')?.addEventListener('click', () => {
    window.location.href = '/branch/pay.html';
});

// 🔹 DOM 로딩 완료 시 실행
document.addEventListener("DOMContentLoaded", () => {
    setupBranchButtons(fetchBranchData);
    document.querySelector(".open-modal-btn")?.addEventListener("click", createFilterModal);

    const searchInput = document.querySelector(".filter-input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const keyword = this.value.toLowerCase();
            const rows = document.querySelectorAll(".stock-table-body tr");
            rows.forEach(row => {
                if (row.cells.length < 3) return;
                const method = row.cells[1]?.textContent.toLowerCase();
                const product = row.cells[2]?.textContent.toLowerCase();
                const isMatch = method.includes(keyword) || product.includes(keyword);
                row.style.display = isMatch ? "" : "none";
            });
        });
    }
});
