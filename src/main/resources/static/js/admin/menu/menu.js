document.addEventListener("DOMContentLoaded", () => {
    fetchMenus();
});

export async function fetchMenus() {
    const response = await fetch("/admin/menus");
    const menus = await response.json();
    const tableBody = document.querySelector(".stock-table-body");
    const maxRows = 10;

    tableBody.innerHTML = "";

    menus.forEach((menu, index) => {
        const isActive = menu.productStatus && menu.productStatus.trim() === "판매중";

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${menu.menuName}</td>
                <td>${menu.menuCode}</td>
                <td>${menu.image || "없음"}</td>
                <td>
                    <img 
                        src="/menu/images/${isActive ? "check-on.png" : "check-off.png"}"
                        alt="${isActive ? "판매중" : "판매중단"}"
                        class="status-toggle"
                        data-menu-id="${menu.menuId}"
                        data-status="${isActive ? "판매중" : "판매중단"}"
                        style="width: 24px; cursor: pointer;" />
                </td>
                <td>${menu.other || ""}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });

    // ✅ 빈 행 추가
    const emptyRowCount = maxRows - menus.length;
    for (let i = 0; i < emptyRowCount; i++) {
        const emptyRow = `
            <tr class="empty-row">
                <td colspan="6" style="color: #ccc; text-align: center;">-</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", emptyRow);
    }

    // 상태 이미지 클릭 시 확인 팝업
    document.querySelectorAll(".status-toggle").forEach(img => {
        img.addEventListener("click", () => {
            const menuId = img.dataset.menuId;
            const currentStatus = img.dataset.status;
            showStatusConfirm(menuId, currentStatus); // 🔽 여기에 추가한 함수 호출
        });
    });
}

// ✅ 상태 변경 확인 팝업 함수
function showStatusConfirm(menuId, currentStatus) {
    const confirmPopup = document.getElementById("status-confirm-popup");
    if (!confirmPopup) return;

    confirmPopup.style.display = "flex";

    document.getElementById("confirm-yes").onclick = async () => {
        const newStatus = currentStatus === "판매중" ? "판매중단" : "판매중";

        await fetch(`/admin/${menuId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productStatus: newStatus })
        });

        confirmPopup.style.display = "none";
        await fetchMenus();
    };

    document.getElementById("confirm-no").onclick = () => {
        confirmPopup.style.display = "none";
    };
}
