document.addEventListener("DOMContentLoaded", () => {
    // === 모달 필터 ===
    const openModalBtn = document.querySelector(".open-modal-btn");
    let modalContainer = null;

    function createModal() {
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
        attachModalEvents();
    }

    function attachModalEvents() {
        modalContainer.querySelectorAll(".calendar-icon").forEach(icon => {
            icon.addEventListener("click", () => {
                const input = icon.previousElementSibling;
                if (input) input.showPicker();
            });
        });

        modalContainer.querySelector(".date-buttons").addEventListener("click", (e) => {
            if (e.target.classList.contains("date-btn")) {
                modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
                e.target.classList.add("active");
            }
        });
        
        modalContainer.addEventListener("click", (e) => {
            const modalContent = modalContainer.querySelector(".modal-content");
            // modal-content 바깥을 클릭했는지 확인
            if (!modalContent.contains(e.target)) {
                closeModal();
            }
        });

        modalContainer.querySelector(".reset-btn").addEventListener("click", () => {
            modalContainer.querySelectorAll(".date-input").forEach(input => {
                input.value = "2025-03-25";
            });
            modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
        });

        modalContainer.querySelector(".apply-btn").addEventListener("click", () => {
            const fromDate = modalContainer.querySelectorAll(".date-input")[0].value;
            const toDate = modalContainer.querySelectorAll(".date-input")[1].value;
            const activeBtn = modalContainer.querySelector(".date-btn.active")?.textContent || "선택 없음";
            console.log("📌 필터 적용:", { fromDate, toDate, activeBtn });

            closeModal();
        });
    }

    function closeModal() {
        if (modalContainer) {
            modalContainer.remove();
            modalContainer = null;
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener("click", createModal);
    }

    // === 지점별 결제 내역 ===
    fetchBranchData(1); // 기본: 강서지점(branchId = 1)
    initBranchButtons();

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

    async function fetchBranchData(branchId) {
        try {
            const response = await fetch(`/branch/api/branch/${branchId}`);
            if (!response.ok) throw new Error("지점별 결제 내역을 불러오지 못했습니다.");

            const data = await response.json();
            console.log(`💡 [지점 ${branchId}] 받은 데이터:`, JSON.stringify(data, null, 2));
            updatePayTable(data);
        } catch (error) {
            console.error(`❌ Error fetching branch ${branchId} data:`, error);
        }
    }

    function updatePayTable(data) {
        const tableBody = document.querySelector(".stock-table-body");
        const emptyMessage = document.querySelector(".empty-message");
    
        tableBody.innerHTML = "";
    
        if (data.length === 0) {
            emptyMessage.style.display = "block";
            return;
        } else {
            emptyMessage.style.display = "none";
        }
        
        const maxRows = 10;
    
        if (!data || data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">결제 내역이 없습니다.</td>
                </tr>
            `;
            return;
        }
    
        const validRows = Math.min(data.length, maxRows);
    
        data.slice(0, maxRows).forEach((pay, index) => {
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
    
        // 부족한 만큼 빈 행 추가
        for (let i = validRows; i < maxRows; i++) {
            tableBody.insertAdjacentHTML("beforeend", `
                <tr class="empty-row">
                    <td></td>
                    <td colspan="7" style="color: #ccc; text-align: center;">-</td>
                </tr>
            `);
        }
    }  
});