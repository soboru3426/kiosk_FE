// Stock 클릭 시 이동
document.querySelector('.stock-link').addEventListener('click', function() {
    window.location.href = 'stock';
});

// Pay 클릭 시 이동
document.querySelector('.pay-link').addEventListener('click', function() {
    window.location.href = 'pay';
});

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
