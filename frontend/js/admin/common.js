// 🔹 페이지 이동 기능
document.querySelector('.stock-link')?.addEventListener('click', () => {
    window.location.href = '/admin/stock.html';
});

document.querySelector('.pay-link')?.addEventListener('click', () => {
    window.location.href = '/admin/pay.html';
});

document.querySelector('.menu-link')?.addEventListener('click', () => {
    window.location.href = '/admin/menu.html';
});

/**
 * 🔹 지점 버튼 로직 초기화 (다중 선택 지원)
 * @param {Function} fetchCallback - 버튼 클릭 시 호출할 함수 (지점 ID 배열 넘겨줌)
 */
function setupBranchButtons(fetchCallback) {
    const buttons = document.querySelectorAll(".branch-session button");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const isActive = this.classList.contains("active");
            const activeButtons = document.querySelectorAll(".branch-session button.active");
            const isAutoClick = this.dataset.autoClick === "true";

            // ❗ 마지막 active 해제 방지
            if (!isAutoClick && isActive && activeButtons.length === 1) {
                alert("최소 하나의 지점은 선택되어 있어야 합니다.");
                return;
            }

            // ✅ 상태 토글
            this.classList.toggle("active");

            // 🔄 선택된 지점들 모아 fetch
            const selectedBranches = Array.from(document.querySelectorAll(".branch-session button.active"))
                .map(btn => btn.dataset.branch);

            if (fetchCallback) fetchCallback(selectedBranches);
        });
    });

    // 🔹 기본 선택 (강서지점)
    const first = document.querySelector(".branch-session button");
    if (first) {
        first.dataset.autoClick = "true";
        first.classList.add("active");
        if (fetchCallback) fetchCallback([first.dataset.branch]);
        delete first.dataset.autoClick;
    }
}

// export 함수로 등록 (ES Module 방식)
window.setupBranchButtons = setupBranchButtons;