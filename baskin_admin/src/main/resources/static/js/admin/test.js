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

                const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
                if (e.target.textContent === "Today") {
                    const dateInputs = modalContainer.querySelectorAll(".date-input");
                    dateInputs[0].value = today; // From
                    dateInputs[1].value = today; // To
                }
            }
        });

        modalContainer.addEventListener("click", (e) => {
            if (e.target === modalContainer) {
                closeModal();
            }
        });

        modalContainer.querySelector(".reset-btn").addEventListener("click", () => {
            modalContainer.querySelectorAll(".date-input").forEach(input => {
                input.value = "2025-03-25";
            });
            modalContainer.querySelectorAll(".date-btn").forEach(btn => btn.classList.remove("active"));
        });

        modalContainer.querySelector(".apply-btn").addEventListener("click", async () => {
            const fromDate = modalContainer.querySelectorAll(".date-input")[0].value;
            const toDate = modalContainer.querySelectorAll(".date-input")[1].value;
            const activeBtn = modalContainer.querySelector(".date-btn.active")?.textContent || "선택 없음";
        
            console.log("📌 필터 적용:", { fromDate, toDate, activeBtn });
        
            // 현재 선택된 지점들 가져오기
            const selectedBranchIds = Array.from(document.querySelectorAll(".branch-btn.active"))
                .map(b => b.getAttribute("data-branch"));
        
            if (selectedBranchIds.length === 0) {
                clearPayTable();
                closeModal();
                return;
            }
        
            try {
                const query = selectedBranchIds.join(",");
                const response = await fetch(
                    `/admin/pay/api/filter?ids=${query}&from=${fromDate}&to=${toDate}`
                );
        
                if (!response.ok) throw new Error("필터링된 결제 내역을 불러올 수 없습니다.");
        
                const data = await response.json();
                console.log("📅 필터링된 데이터:", data);
                updatePayTable(data);
            } catch (error) {
                console.error("❌ 필터링 fetch 실패:", error);
            }
        
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

    // === 다중 지점 결제 내역 ===
    initBranchButtons();

    function initBranchButtons() {
        document.querySelectorAll(".branch-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                btn.classList.toggle("active"); // ✅ 중복 선택 가능

                const selectedBranchIds = Array.from(document.querySelectorAll(".branch-btn.active"))
                    .map(b => b.getAttribute("data-branch"));

                if (selectedBranchIds.length === 0) {
                    clearPayTable();
                    return;
                }

                fetchMultipleBranchData(selectedBranchIds);
            });
        });
    }

    async function fetchMultipleBranchData(branchIds) {
        try {
            const query = branchIds.join(",");
            const response = await fetch(`/admin/pay/api/branches?ids=${query}`);

            if (!response.ok) throw new Error("다중 지점 결제 내역을 불러오지 못했습니다.");

            const data = await response.json();
            console.log("💡 [선택된 지점들] 데이터:", JSON.stringify(data, null, 2));
            updatePayTable(data);
        } catch (error) {
            console.error("❌ 다중 지점 데이터 fetch 실패:", error);
        }
    }

    function clearPayTable() {
        const tableBody = document.querySelector(".stock-table-body");
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">선택된 지점이 없습니다.</td>
                </tr>
            `;
        }
    }

    function updatePayTable(data) {
        const tableBody = document.querySelector(".stock-table-body");

        if (!tableBody) {
            console.error("❌ .stock-table-body 요소를 찾을 수 없습니다.");
            return;
        }

        tableBody.innerHTML = "";

        if (!data || data.length === 0) {
            clearPayTable();
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
});
