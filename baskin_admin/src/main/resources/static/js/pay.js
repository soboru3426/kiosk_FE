document.addEventListener("DOMContentLoaded", () => {
    const modalContainer = document.getElementById("modalHere");
    const openModalBtn = document.querySelector(".open-modal-btn");

    // 모달을 동적으로 생성하는 함수
    function createModal() {
        if (document.querySelector(".modal")) return;

        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-wrapper">
                        <div class="modal-body">
                            <div class="date-picker">
                                <div class="date-wrapper">
                                    <label>From</label>
                                    <div class="input-wrapper">
                                        <input type="date" value="2025-03-25">
                                        <img src="/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
                                    </div>
                                </div>
                                <div class="date-wrapper">
                                    <label>To</label>
                                    <div class="input-wrapper">
                                        <input type="date" value="2025-03-25">
                                        <img src="/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
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

        // 외부 클릭 시 모달 닫기
        document.querySelector(".modal").addEventListener("click", (event) => {
            if (event.target === document.querySelector(".modal")) {
                closeModal();
            }
        });
    }

    if (openModalBtn) {
        openModalBtn.addEventListener("click", createModal);
    }

    function closeModal() {
        modalContainer.innerHTML = "";
    }

    fetchPayData();

    // Pay 테이블 데이터 가져오기
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

    // Pay 테이블 업데이트
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
                <td>${pay.paymentMethod || "N/A"}</td> <!-- 결제수단 추가 -->
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
