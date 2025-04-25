import { fetchMenus } from './menu.js';

export function showStatusConfirm(menuId, currentStatus) {
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
