document.addEventListener("DOMContentLoaded", () => {
    fetchBranchData(1); // 기본: 강서지점(branchId = 1)
    initBranchButtons();
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
        const response = await fetch(`/admin/api/branch/${branchId}`);
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
