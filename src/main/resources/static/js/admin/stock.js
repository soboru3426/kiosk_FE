// 🔹 서버에서 지점별 데이터를 가져오는 함수
async function fetchBranchData(branch) {
    try {
        const response = await fetch(`/admin/stock/data/${branch}`);
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');

        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error("Error fetching branch data:", error);
    }
}

// 🔹 테이블 업데이트 함수
function updateTable(data) {
    const tableBody = document.querySelector(".stock-table-body");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    const maxRows = 10; // 최대 행 수

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>조회 내역이 없습니다.</td></tr>";
        return;
    }

    const validRows = Math.min(data.length, maxRows);

    // 실제 데이터 렌더링
    for (let i = 0; i < validRows; i++) {
        const row = data[i];
        const statusClass = getStatusClass(row.orderStatus);

        const newRow = `
            <tr data-stock-id="${row.stockId}">
                <td>${i + 1}</td>
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
                            <div class="select-container">
                                <div class="status-option orange" data-status="확인중">
                                    <span class="dot"></span> 확인중
                                </div>
                            </div>
                            <div class="select-container">
                                <div class="status-option green" data-status="배송완료">
                                    <span class="dot"></span> 배송완료
                                </div>
                            </div>
                            <div class="select-container">    
                                <div class="status-option pink" data-status="배송중">
                                    <span class="dot"></span> 배송중
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", newRow);
    }

    // 부족한 행 수만큼 빈 행 추가
    for (let i = validRows; i < maxRows; i++) {
        tableBody.insertAdjacentHTML("beforeend", `
            <tr class="empty-row">
                <td></td>
                <td colspan="6" style="color: #ccc; text-align: center;">-</td>
            </tr>
        `);
    }

    console.log("📣 테이블 렌더링 끝. 드롭다운 초기화 시작");
    initializeStatusDropdown();
}

// 🔹 상태에 맞는 색상 클래스 반환 함수
function getStatusClass(orderStatus) {
    // 상태에 맞는 색상 클래스 반환
    switch (orderStatus) {
        case "확인중":
            return "orange";  // 확인중 상태는 오렌지색
        case "배송완료":
            return "green";  // 배송완료 상태는 초록색
        case "배송중":
            return "pink";  // 배송중 상태는 핑크색
        default:
            return "";  // 상태가 없거나 일치하지 않으면 기본값
    }
}

// 🔹 드롭다운 초기화 함수
function initializeStatusDropdown() {
    const allDropdowns = document.querySelectorAll(".status-dropdown");

    // 상태 → 색상 클래스 매핑
    const statusClassMap = {
        "확인중": "orange",
        "배송완료": "green",
        "배송중": "pink"
    };

    allDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector(".status-btn");
        const menu = dropdown.querySelector(".status-menu");

        // 드롭다운 상태 버튼 클릭 시
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            menu.classList.toggle("active");
        });

        menu.querySelectorAll(".status-option").forEach(option => {
            option.addEventListener("click", () => {
                const status = option.dataset.status;

                // 상태 변경 확인 팝업
                showConfirmPopup(`정말 발주상태를 변경하시겠습니까?`, () => {
                    const stockId = dropdown.dataset.stockId;

                    fetch(`/admin/stock/update/${stockId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ orderStatus: status })
                    })
                        .then(res => res.json())
                        .then(result => {
                            const newClass = statusClassMap[status];
                            button.classList.remove("orange", "green", "pink");
                            button.classList.add(newClass);
                            button.innerHTML = `<span class="dot"></span> ${status}`;

                            menu.classList.remove("active");

                            const row = dropdown.closest("tr");
                            const statusTd = row.querySelector(".order-status");
                            if (statusTd) statusTd.textContent = status;

                            showPopup(`발주상태가 변경되었습니다.`);
                        })
                        .catch(err => {
                            console.error("상태 업데이트 실패", err);
                            showPopup("상태 변경 중 오류가 발생했습니다.");
                        });
                });
            });
        });
    });
}

// 🔹 바깥 클릭 시 드롭다운 닫기
document.addEventListener("click", closeAllDropdowns);
function closeAllDropdowns() {
    document.querySelectorAll(".status-menu").forEach(menu => {
        menu.classList.remove("active");
    });
}

// 🔹 상태 변경 완료 팝업
function showPopup(message) {
    const popup = document.getElementById("status-popup");
    const messageBox = document.getElementById("popup-message");
    messageBox.textContent = message;
    popup.classList.remove("hidden");
}

// 🔹 상태 변경 확인 팝업
function showConfirmPopup(message, onConfirm) {
    const popup = document.getElementById("confirm-popup");
    const messageBox = document.getElementById("confirm-message");
    const yesBtn = document.getElementById("confirm-yes");
    const noBtn = document.getElementById("confirm-no");

    messageBox.textContent = message;
    popup.classList.remove("hidden");

    // 이전 이벤트 제거 후 새로 등록 (중복 방지)
    const newYesBtn = yesBtn.cloneNode(true);
    const newNoBtn = noBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    noBtn.parentNode.replaceChild(newNoBtn, noBtn);

    newYesBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
        onConfirm(); // 상태 변경 실행
    });

    newNoBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
}

// 🔹 페이지 로드 후 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
    // 팝업 닫기 버튼
    const popupCloseBtn = document.getElementById("popup-close");
    popupCloseBtn.addEventListener("click", () => {
        document.getElementById("status-popup").classList.add("hidden");
    });

    const branchButtons = document.querySelectorAll(".branch-session .branch-btn");

    branchButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            branchButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const branch = btn.dataset.branch;
            fetchBranchData(branch);
        });
    });

    if (branchButtons.length > 0) {
        branchButtons[0].click();
    }
});
