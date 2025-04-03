// 🔹 지점 버튼 클릭 이벤트 설정
document.querySelectorAll(".branch-session button").forEach(button => {
    button.addEventListener("click", function() {
        // 모든 버튼의 active 클래스 제거 후 현재 버튼만 활성화
        document.querySelectorAll(".branch-session button").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        // 선택한 지점 ID 가져오기 (data-branch 속성 사용)
        const branch = this.dataset.branch;
        fetchBranchData(branch);
    });
});

// 🔹 서버에서 지점별 데이터를 가져오는 함수 (예: fetch API 사용)
async function fetchBranchData(branch) {
    try {
        const response = await fetch(`/stock/data/${branch}`); // 서버에서 데이터 요청
        if (!response.ok) throw new Error('데이터를 불러오지 못했습니다.');

        const data = await response.json(); // JSON 변환
        updateTable(data); // 테이블 업데이트
    } catch (error) {
        console.error("Error fetching branch data:", error);
    }
}

// 🔹 테이블 업데이트 함수 (Pay 버튼 추가)
function updateTable(data) {
    const tableBody = document.querySelector(".stock-table-body");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='7'>조회 내역이 없습니다.</td></tr>";
        return;
    }

    data.forEach((row, index) => {
        const newRow = `<tr>
            <td>${index + 1}</td>
            <td>${row.branchName}</td>
            <td>${row.menuName}</td>
            <td>${row.quantity}</td>
            <td>${row.productStatus}</td>
            <td>${row.orderStatus}</td>
            <td><a href="#" class="pay-btn" data-menu="${row.menuName}" data-branch="${row.branchName}">Pay</a></td>
        </tr>`;
        tableBody.innerHTML += newRow;
    });

    // 🔹 Pay 버튼 클릭 이벤트 추가
    document.querySelectorAll(".pay-btn").forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault(); // 기본 동작 방지 (페이지 이동 X)
            const menu = this.dataset.menu;
            const branch = this.dataset.branch;
            alert(`결제 진행: ${branch} - ${menu}`);
        });
    });
}

// 🔹 첫 번째 지점 데이터를 기본으로 로드
document.addEventListener("DOMContentLoaded", function () {
    const firstBranch = document.querySelector(".branch-session button");
    if (firstBranch) {
        firstBranch.click(); // 첫 번째 버튼 자동 클릭 (초기 데이터 로드)
    }
});
