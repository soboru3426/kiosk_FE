document.querySelector('.stock-link').addEventListener('click', function() {
    window.location.href = '/admin/stock';
});

document.querySelector('.pay-link').addEventListener('click', function() {
    window.location.href = '/admin/pay';
});

// 🔹 지점 버튼 클릭 이벤트 설정
document.querySelectorAll(".branch-session button").forEach(button => {
    button.addEventListener("click", function () {
        const isActive = this.classList.contains("active");
        const activeButtons = document.querySelectorAll(".branch-session button.active");

        const isAutoClick = this.dataset.autoClick === "true"; // ✅ 자동 클릭 여부 확인

        // ❗ 수동 클릭일 때만 제한
        if (!isAutoClick && isActive && activeButtons.length === 1) {
            alert("최소 하나의 지점은 선택되어 있어야 합니다.");
            return;
        }

        this.classList.toggle("active");

        const selectedBranch = this.dataset.branch;
        fetchBranchData(selectedBranch);
    });
});
