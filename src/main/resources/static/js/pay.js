document.addEventListener("DOMContentLoaded", () => {
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
                            <div class="filter-buttons">
                                <button class="filter-btn">Today</button>
                                <button class="filter-btn">This Week</button>
                                <button class="filter-btn">This Month</button>
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

        // 🔹 이벤트 위임을 사용하여 filter-btn 클릭 감지
        modalContainer.querySelector(".filter-buttons").addEventListener("click", (event) => {
            if (event.target.classList.contains("filter-btn")) {
                // 모든 버튼에서 'active' 클래스 제거
                modalContainer.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));

                // 클릭된 버튼에 'active' 클래스 추가
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
        if (event.target.classList.contains("filter-btn")) {
            console.log("🔹 클릭된 버튼:", event.target); // 클릭된 버튼 확인
    
            // 기존 active 클래스 제거
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            console.log("🔹 기존 active 클래스 제거 완료");
    
            // 클릭된 버튼에 active 클래스 추가
            event.target.classList.add("active");
            console.log("🔹 active 클래스 추가됨?", event.target.classList.contains("active"));
    
            // 🔥 버튼의 현재 스타일 확인
            console.log("🔹 현재 버튼 배경색:", window.getComputedStyle(event.target).backgroundColor);
        }
    });
    

    fetchPayData();

    async function fetchPayData() {
        try {
            const response = await fetch("/api/pay");
            if (!response.ok) throw new Error("결제 내역을 불러오지 못했습니다.");

            const data = await response.json();
            updatePayTable(data);
        } catch (error) {
            console.error("Error fetching pay data:", error);
        }
    }

    function updatePayTable(data) {
        const tableBody = document.querySelector(".stock-table-body");
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="no-data">결제 내역이 없습니다.</td></tr>`;
            return;
        }

        data.forEach((pay, index) => {
            const newRow = `<tr>
                <td>${index + 1}</td>
                <td>${pay.paymentMethod || "N/A"}</td>
                <td>${pay.menu ? pay.menu.menuName : "N/A"}</td>
                <td>${pay.totalPrice}원</td>
                <td>${new Date(pay.paymentDate).toLocaleString()}</td>
                <td>${pay.branch ? pay.branch.branchName : "N/A"}</td>
                <td>${pay.serialNumber}</td>
                <td>
                    <button class="delete-btn" data-id="${pay.paymentId}">삭제</button>
                </td>
            </tr>`;
            tableBody.innerHTML += newRow;
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const payId = this.dataset.id;
                if (confirm("정말로 삭제하시겠습니까?")) {
                    try {
                        const response = await fetch(`/api/pay/${payId}`, {
                            method: "DELETE"
                        });

                        if (response.ok) {
                            alert("결제 내역이 삭제되었습니다.");
                            fetchPayData();
                        } else {
                            alert("삭제 실패! 다시 시도해주세요.");
                        }
                    } catch (error) {
                        console.error("Error deleting pay data:", error);
                    }
                }
            });
        });
    }
});
