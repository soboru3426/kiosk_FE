document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "stockData";
  
    // 예시 데이터 초기화
    let stockData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stockData) {
      stockData = [
        { no: 1, branch: "강서지점", menu: "민트초코", orderQty: 10, productState: "판매중", orderStatus: "확인중" },
        { no: 2, branch: "강서지점", menu: "사랑에 빠진 딸기", orderQty: 5, productState: "판매중", orderStatus: "배송중" },
        { no: 3, branch: "상봉지점", menu: "소금 우유", orderQty: 8, productState: "판매중단", orderStatus: "배송완료" },
        { no: 4, branch: "상봉지점", menu: "엄마는 외계인", orderQty: 12, productState: "판매중", orderStatus: "확인중" },
        { no: 5, branch: "하남지점", menu: "아빠는 지구인", orderQty: 6, productState: "판매중단", orderStatus: "배송중" },
        { no: 6, branch: "하남지점", menu: "부활절 계란 아이스크림", orderQty: 7, productState: "판매중", orderStatus: "배송완료" }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockData));
    }
  
    const tableBody = document.getElementById("stock-table-body");
    const branchButtons = document.querySelectorAll(".branch-btn");
    const showAllButton = document.getElementById("show-all");
    const summaryDiv = document.getElementById("summary");
    const rightPopup = document.getElementById("rightPopup");
    const confirmModal = document.getElementById("confirmModal");
  
    // 발주상태 색상 결정 함수
    function getOrderStatusColor(status) {
      switch (status) {
        case "확인중": return "yellow";
        case "배송완료": return "lightgreen";
        case "배송중": return "lightpink";
        default: return "grey";
      }
    }
  
    // 테이블 렌더링 함수
    function renderTable(filterBranch = "전체") {
      tableBody.innerHTML = "";
      let filteredData = stockData;
      if (filterBranch !== "전체") {
        filteredData = stockData.filter(item => item.branch === filterBranch);
      }
      if (filteredData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">조회 내역이 없습니다.</td></tr>`;
        return;
      }
      filteredData.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.no}</td>
          <td>${item.branch}</td>
          <td>${item.menu}</td>
          <td>${item.orderQty}</td>
          <td class="${item.productState === "판매중" ? "product-sale" : "product-discontinued"}">${item.productState}</td>
          <td>
            <button class="order-status-btn" style="background-color:${getOrderStatusColor(item.orderStatus)};">
              ${item.orderStatus}
            </button>
          </td>
          <td>
            <button class="change-status-btn" data-no="${item.no}">발주하기</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    // 초기 렌더링
    renderTable();
  
    // 브랜치 필터 버튼 이벤트 등록
    branchButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        branchButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTable(btn.dataset.branch);
      });
    });
  
    showAllButton.addEventListener("click", () => {
      branchButtons.forEach(b => b.classList.remove("active"));
      showAllButton.classList.add("active");
      renderTable("전체");
    });
  
    // "발주하기" 버튼 클릭 이벤트 (이벤트 위임)
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("change-status-btn")) {
        const no = parseInt(e.target.dataset.no);
        openRightPopup(no);
      }
    });
  
    // 오른쪽 팝업 열기 (발주 상태 선택)
    function openRightPopup(no) {
      rightPopup.innerHTML = `
        <div class="right-popup-content" style="
          position: fixed; top: 20%; right: 0; width: 300px; background-color: white;
          border: 2px solid #333; padding: 10px; box-shadow: -4px 4px 8px rgba(0,0,0,0.2); z-index: 1000;">
          <h4>발주 상태 변경</h4>
          <p style="font-size:14px; color:#666;">발주상태를 선택하세요</p>
          <button class="status-option" data-status="확인중" data-no="${no}" style="background-color: yellow; margin-right:5px;">확인중</button>
          <button class="status-option" data-status="배송완료" data-no="${no}" style="background-color: lightgreen; margin-right:5px;">배송완료</button>
          <button class="status-option" data-status="배송중" data-no="${no}" style="background-color: lightpink; margin-right:5px;">배송중</button>
          <button class="status-cancel" style="margin-left:10px;">취소</button>
        </div>
      `;
      // 취소 버튼 이벤트
      document.querySelector(".status-cancel").addEventListener("click", closeRightPopup);
      // 상태 옵션 버튼 이벤트
      document.querySelectorAll(".status-option").forEach(btn => {
        btn.addEventListener("click", () => {
          const newStatus = btn.dataset.status;
          const itemNo = parseInt(btn.dataset.no);
          closeRightPopup();
          // 바로 업데이트하지 않고 중앙 확인 모달을 열기
          openConfirmModal(itemNo, newStatus);
        });
      });
    }
  
    // 오른쪽 팝업 닫기
    function closeRightPopup() {
      rightPopup.innerHTML = "";
    }
  
    // 중앙 확인 모달 열기
    function openConfirmModal(no, newStatus) {
      confirmModal.innerHTML = `
        <div class="confirm-modal" style="
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background-color: white; border: 2px solid #333; padding: 20px; border-radius: 8px;
          text-align: center; z-index: 2000;">
          <p style="font-size:16px; margin-bottom:10px;">발주상태를 '${newStatus}'(으)로 변경하시겠습니까?</p>
          <button id="confirm-yes" style="margin-right:10px;">예</button>
          <button id="confirm-no">아니오</button>
        </div>
      `;
      document.getElementById("confirm-yes").addEventListener("click", () => {
        updateOrderStatus(no, newStatus);
        closeConfirmModal();
        showFinalMessage("발주상태가 변경되었습니다.");
        // 필터 상태에 맞춰 테이블 다시 렌더링 (현재 active된 버튼의 data-branch 값 활용)
        const activeBtn = document.querySelector(".branch-btn.active");
        const branchFilter = activeBtn ? activeBtn.dataset.branch : "전체";
        renderTable(branchFilter);
      });
      document.getElementById("confirm-no").addEventListener("click", () => {
        closeConfirmModal();
      });
    }
  
    // 중앙 확인 모달 닫기
    function closeConfirmModal() {
      confirmModal.innerHTML = "";
    }
  
    // 발주상태 업데이트 및 localStorage 저장
    function updateOrderStatus(no, newStatus) {
      stockData = stockData.map(item => {
        if (item.no === no) {
          item.orderStatus = newStatus;
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stockData));
    }
  
    // 변경 완료 메시지 표시 (페이지 하단)
    function showFinalMessage(msg) {
      summaryDiv.innerHTML = `<p style="color:green; font-weight:bold;">${msg}</p>`;
      setTimeout(() => {
        summaryDiv.innerHTML = "";
      }, 3000);
    }
  });
  