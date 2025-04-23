// 🔹 서버에서 지점별 데이터 가져오기 (다중 지원)
async function fetchBranchData(branchIds) {
    if (!branchIds || branchIds.length === 0) return;

    try {
        const query = branchIds.join(",");
        const response = await fetch(`/branch/pay/branches?ids=${query}`);
        if (!response.ok) throw new Error("지점별 결제 내역을 불러오지 못했습니다.");
        const data = await response.json();
        updatePayTable(data);
    } catch (error) {
        console.error(`❌ Error fetching branch data:`, error);
    }
}

// 🔹 결제 내역 테이블 업데이트 + 클릭 시 상세보기
function updatePayTable(data) {
    const tableBody = document.querySelector(".stock-table-body");
    const emptyMessage = document.querySelector(".empty-message");
    const maxRows = 10;
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (data.length === 0) {
        emptyMessage.style.display = "block";
        return;
    } else {
        emptyMessage.style.display = "none";
    }

    const actualRows = data.length;

    data.slice(0, actualRows).forEach((pay, index) => {
        const paymentMethod = pay.paymentMethod || "N/A";
        const productName = pay.productName || "N/A";
        const totalPrice = pay.totalPrice ? `${pay.totalPrice.toLocaleString()}원` : "N/A";
        const paymentDate = pay.paymentDate
            ? new Date(pay.paymentDate).toLocaleString("ko-KR")
            : "N/A";
        const branchName = pay.branchName || "N/A";
        const serialNumber = pay.serialNumber || "N/A";

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${paymentMethod}</td>
            <td>${productName}</td>
            <td>${totalPrice}</td>
            <td>${paymentDate}</td>
            <td>${branchName}</td>
            <td>${serialNumber}</td>
        `;

        // ✅ 클릭 시 상세 모달 표시
        newRow.addEventListener("click", () => {
            const subItems = JSON.parse(pay.subItemsJson || "[]");
            showSubItemDetailModal(subItems);
        });

        tableBody.appendChild(newRow);
    });

    if (actualRows < maxRows) {
        for (let i = actualRows; i < maxRows; i++) {
            tableBody.insertAdjacentHTML("beforeend", `
                <tr class="empty-row">
                    <td colspan="7" style="color: #ccc; text-align: center;">-</td>
                </tr>
            `);
        }
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
            // ✅ 각 subItem에 productName 주입
            order.subItems.forEach(sub => {
              sub.productName = order.name;
              allSubItems.push(sub);
            });
          }
        });
      }
    }
  
    const html = allSubItems.map(sub => {
        const totalPrice = (sub.unitPrice || 0) * (sub.quantity || 1);
        return `
          <div class="subitem-row">
            <div><strong>${sub.productName || '상품명 없음'} [${getTypeLabel(sub.type)}]</strong></div>
            <div>수량: ${sub.quantity}개</div>
            <div>가격: ${totalPrice.toLocaleString()}원</div>
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
  
    modal.querySelector(".close-modal-btn").addEventListener("click", () => {
      modal.remove();
    });
}
  
// 🔹 모달 필터 로직
document.addEventListener("DOMContentLoaded", () => {
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
                                        <img src="/pay/images/calendar.png" alt="달력" class="calendar-icon">
                                    </div>
                                </div>
                                <div class="date-wrapper">
                                    <label>To</label>
                                    <div class="input-wrapper">
                                        <input type="date" class="date-input" value="2025-03-25">
                                        <img src="/pay/images/calendar.png" alt="달력" class="calendar-icon">
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

        modalContainer.querySelector(".apply-btn").addEventListener("click", async () => {
            const fromDate = modalContainer.querySelectorAll(".date-input")[0].value;
            const toDate = modalContainer.querySelectorAll(".date-input")[1].value;
            const activeBtn = modalContainer.querySelector(".date-btn.active")?.textContent || "선택 없음";
            const currentBranchBtn = document.querySelector(".branch-btn.active");
            const branchId = currentBranchBtn?.getAttribute("data-branch") || 1;

            try {
                const response = await fetch(`/branch/pay/branch/${branchId}/filter?start=${fromDate}&end=${toDate}`);
                if (!response.ok) throw new Error("필터링된 데이터를 가져오지 못했습니다.");

                const filteredData = await response.json();
                updatePayTable(filteredData);
            } catch (error) {
                console.error("❌ 필터 fetch 오류:", error);
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

    // ✅ 초기 지점 데이터 요청
    setupBranchButtons(fetchBranchData);
});
