document.addEventListener("DOMContentLoaded", () => {
    fetchMenus();
});

export async function fetchMenus() {
    const response = await fetch("http://tomhoon.duckdns.org:8883/api/admin/menus");
    const menus = await response.json();
    const tableBody = document.querySelector(".stock-table-body");
    const maxRows = 10;
    const emptyMessage = document.querySelector(".empty-message");
    const filterInput = document.querySelector(".filter-input");

    tableBody.innerHTML = "";

    if (menus.length === 0) {
        emptyMessage.style.display = "block";
        return;
    } else {
        emptyMessage.style.display = "none";
    }

    // 🔸 한글 포함 여부 판단 함수
    function isKorean(str) {
        return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(str);
    }

    menus.forEach((menu, index) => {
        const isActive = menu.productStatus && menu.productStatus.trim() === "판매중";

        let imagePath = "없음";
        if (menu.image) {
            imagePath = isKorean(menu.image)
                ? `/flavor-images/${menu.image}`
                : `/flavor-images/${encodeURIComponent(menu.image)}`;
        }

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td class="menu-name-cell">${menu.menuName}</td>
                <td>${menu.menuCode}</td>
                <td>
                    ${
                        menu.image
                            ? `<img src="${imagePath}" alt="${menu.menuName}" style="width: 80px; border-radius: 8px;">`
                            : "없음"
                    }
                </td>
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

    // ✅ 메뉴명 필터링 이벤트
    if (filterInput) {
        filterInput.addEventListener("input", () => {
            const keyword = filterInput.value.toLowerCase().trim();
            const rows = document.querySelectorAll(".stock-table-body tr");

            rows.forEach(row => {
                const cell = row.querySelector(".menu-name-cell");
                const text = cell?.textContent?.toLowerCase() || "";
                row.style.display = text.includes(keyword) ? "" : "none";
            });
        });
    }

    // 상태 이미지 클릭 이벤트
    document.querySelectorAll(".status-toggle").forEach(img => {
        img.addEventListener("click", () => {
            const menuId = img.dataset.menuId;
            const currentStatus = img.dataset.status;
            showStatusConfirm(menuId, currentStatus);
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

        await fetch(`http://tomhoon.duckdns.org:8883/api/admin/menus/${menuId}/status`, {
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
