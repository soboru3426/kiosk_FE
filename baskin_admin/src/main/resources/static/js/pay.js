document.addEventListener("DOMContentLoaded", () => {
    const modalContainer = document.getElementById("modalHere");
    const openModalBtn = document.querySelector(".open-modal-btn");

    // 모달을 동적으로 생성하는 함수
    function createModal() {
        modalContainer.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-wrapper">
                        <div class="modal-body">
                            <div class="date-picker">
                                <div class="date-wrapper">
                                    <label>From</label>
                                    <div class="input-wrapper">
                                        <input type="date" value="2025-03-25">
                                        <img src="/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
                                    </div>
                                </div>
                                <div class="date-wrapper">
                                    <label>To</label>
                                    <div class="input-wrapper">
                                        <input type="date" value="2025-03-25">
                                        <img src="/images/calendar.png" alt="달력 아이콘" class="calendar-icon">
                                    </div>
                                </div>
                            </div>
                            <div class="filter-buttons">
                                <button class="filter-btn">Today</button>
                                <button class="filter-btn">This Week</button>
                                <button class="filter-btn">This Month</button>
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
        
         // 외부 클릭 시 모달 닫기
         document.querySelector(".modal").addEventListener("click", (event) => {
             if (event.target === document.querySelector(".modal")) {
                 closeModal();
             }
         });
    }

    // 모달 열기
    openModalBtn.addEventListener("click", createModal);

    // 모달 닫기 함수
    function closeModal() {
        modalContainer.innerHTML = ""; // 모달 삭제
    }
});
