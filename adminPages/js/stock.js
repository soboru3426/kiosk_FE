document.querySelectorAll(".branch-session button").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".branch-session button").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active"); // 클릭한 버튼에만 active 추가

        // 선택한 지점 데이터 가져오기 (서버 연동 가능)
        const branch = button.dataset.branch;
        fetchBranchData(branch);
    });
});

function fetchBranchData(branch) {
    // 서버에서 지점별 데이터를 가져오는 함수 (예제)
    const data = getBranchData(branch); // API 연동 가능
    updateTable(data); // 테이블 업데이트
}

function updateTable(data) {
    const tableBody = document.querySelector(".data-table tbody");
    tableBody.innerHTML = ""; // 기존 데이터 삭제

    data.forEach(row => {
        const newRow = `<tr>
            <td>${row.no}</td>
            <td>${row.branchName}</td>
            <td>${row.menuName}</td>
            <td>${row.stockAmount}</td>
            <td>${row.productStatus}</td>
            <td>${row.orderStatus}</td>
            <td>${row.orderAction}</td>
        </tr>`;
        tableBody.innerHTML += newRow;
    });
}
