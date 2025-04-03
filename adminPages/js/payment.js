document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "paymentData";
  
    // 예시 결제 데이터 초기화
    let paymentData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!paymentData) {
      paymentData = [
        {
          no: 1,
          method: "신용카드",
          detail: "사랑에 빠진 딸기",
          price: 5500,
          date: "2025-03-25 14:45:32",
          branch: "강서지점",
          payNo: 321
        },
        {
          no: 2,
          method: "카카오페이",
          detail: "딸기에 빠진 딸기",
          price: 12500,
          date: "2025-03-25 15:02:10",
          branch: "상봉지점",
          payNo: 322
        },
        {
          no: 3,
          method: "현금",
          detail: "딸기에 빠진 딸기",
          price: 26500,
          date: "2025-03-25 15:45:32",
          branch: "하남지점",
          payNo: 323
        },
        {
          no: 4,
          method: "신용카드",
          detail: "아몬드",
          price: 7500,
          date: "2025-03-25 16:12:55",
          branch: "강서지점",
          payNo: 324
        },
        {
          no: 5,
          method: "카카오페이",
          detail: "초코",
          price: 15500,
          date: "2025-03-25 17:00:11",
          branch: "상봉지점",
          payNo: 325
        },
        {
          no: 6,
          method: "현금",
          detail: "바람과 함께 사라지다",
          price: 9500,
          date: "2025-03-25 17:20:40",
          branch: "하남지점",
          payNo: 326
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentData));
    }
  
    const tableBody = document.getElementById("payment-table-body");
    const branchButtons = document.querySelectorAll(".branch-btn");
    const showAllButton = document.getElementById("show-all");
  
    // 테이블 렌더링 함수
    function renderTable(filterBranch = "전체") {
      tableBody.innerHTML = "";
      let filtered = paymentData;
  
      // 브랜치 필터
      if (filterBranch !== "전체") {
        filtered = paymentData.filter(item => item.branch === filterBranch);
      }
  
      if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7">조회 내역이 없습니다.</td></tr>`;
        return;
      }
  
      // 필터링된 데이터 테이블에 표시
      filtered.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.no}</td>
          <td>${item.method}</td>
          <td>${item.detail}</td>
          <td>${item.price}</td>
          <td>${item.date}</td>
          <td>${item.branch}</td>
          <td>${item.payNo}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
  
    // 초기 렌더링 (전체)
    renderTable();
  
    // 브랜치 버튼 클릭 이벤트
    branchButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        branchButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTable(btn.dataset.branch);
      });
    });
  
    // "전체" 버튼
    showAllButton.addEventListener("click", () => {
      branchButtons.forEach(b => b.classList.remove("active"));
      showAllButton.classList.add("active");
      renderTable("전체");
    });
  });
  