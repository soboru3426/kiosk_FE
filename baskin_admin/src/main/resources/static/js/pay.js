document.addEventListener("DOMContentLoaded", () => {
    fetchBranchData(1); // 기본: 강서지점(branchId = 1)
    initBranchButtons();

    const openModalBtn = document.querySelector(".open-modal-btn");
    let modalContainer = null; // 모달 컨테이너 변수 (초기에는 null)

    function createModal() {
        if (modalContainer) return; // 이미 모달이 열려있다면 생성하지 않음

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
                                        <img src="/pay/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
                                    </div>
                                </div>
                                <div class="date-wrapper">
                                    <label>To</label>
                                    <div class="input-wrapper">
                                        <input type="date" class="date-input" value="2025-03-25">
                                        <img src="/pay/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
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
                                <select>
                                    <option>오름차순</option>
                                </select>
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

        // 🔹 이벤트 위임을 사용하여 date-btn 클릭 감지
        modalContainer.querySelector(".date-buttons").addEventListener("click", (event) => {
            if (event.target.classList.contains("date-btn")) {
                modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
                event.target.classList.add("active");
            }
        });

        // 모달 외부 클릭 시 닫기
        modalContainer.querySelector(".modal").addEventListener("click", (event) => {
            if (event.target === modalContainer.querySelector(".modal")) {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modalContainer) {
            modalContainer.remove();
            modalContainer = null; // 모달을 제거 후 null로 초기화
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener("click", createModal);
    }

    // ✅ 캘린더 아이콘 클릭 시 input[type="date"] 열기 (동적 바인딩)
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("calendar-icon")) {
            const dateInput = event.target.previousElementSibling;
            if (dateInput) {
                dateInput.showPicker();
            }
        }
    });

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("date-btn")) {
            document.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
            event.target.classList.add("active");
        }
    });

});

// 지점 버튼 클릭 이벤트 초기화
function initBranchButtons() {
    document.querySelectorAll(".branch-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".branch-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const branchId = btn.getAttribute("data-branch");
            fetchBranchData(branchId);
        });
    });
}

// 지점별 결제 내역 데이터 가져오기
async function fetchBranchData(branchId) {
    try {
        const response = await fetch(`/pay/api/branch/${branchId}`);
        if (!response.ok) throw new Error("지점별 결제 내역을 불러오지 못했습니다.");

        const data = await response.json();
        console.log(`💡 [지점 ${branchId}] 받은 데이터:`, JSON.stringify(data, null, 2));
        updatePayTable(data);
    } catch (error) {
        console.error(`❌ Error fetching branch ${branchId} data:`, error);
    }
}

// Pay 테이블 업데이트
function updatePayTable(data) {
    const tableBody = document.querySelector(".stock-table-body");

    if (!tableBody) {
        console.error("❌ .stock-table-body 요소를 찾을 수 없습니다.");
        return;
    }

    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">결제 내역이 없습니다.</td>
            </tr>
        `;
        return;
    }

    data.forEach((pay, index) => {
        const paymentMethod = pay.paymentMethod || "N/A";
        const menuName = pay.menuName || "N/A";
        const totalPrice = pay.totalPrice ? `${pay.totalPrice.toLocaleString()}원` : "N/A";

        const paymentDate = pay.paymentDate
            ? new Date(pay.paymentDate).toLocaleString("ko-KR")
            : "N/A";

        const branchName = pay.branchName || "N/A";
        const serialNumber = pay.serialNumber || "N/A";

        const newRow = `
            <tr>
                <td>${index + 1}</td>
                <td>${paymentMethod}</td>
                <td>${menuName}</td>
                <td>${totalPrice}</td>
                <td>${paymentDate}</td>
                <td>${branchName}</td>
                <td>${serialNumber}</td>
            </tr>
        `;

        tableBody.insertAdjacentHTML("beforeend", newRow);
    });
}
