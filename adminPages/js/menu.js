document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "menuData";
  
    // 1) 예시 데이터 초기화 (없으면 기본 데이터 생성)
    let menuData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!menuData) {
      menuData = [
        { no: 1, menuName: "아메리카노", menuCode: "BR101", menuImage: "C:/PROJECT/IMAGES/AMERICANO.PNG", saleStatus: true, remark: "" },
        { no: 2, menuName: "라떼",     menuCode: "BR102", menuImage: "", saleStatus: false, remark: "" },
        { no: 3, menuName: "카푸치노", menuCode: "BR103", menuImage: "", saleStatus: true,  remark: "" },
        { no: 4, menuName: "딸기에빠진딸기", menuCode: "BR104", menuImage: "", saleStatus: true, remark: "" }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    }
  
    const tableBody = document.getElementById("menu-table-body");
    const menuAddBtn = document.getElementById("menuAddBtn");
    const menuAddModal = document.getElementById("menuAddModal");
    const confirmModal = document.getElementById("confirmModal");
    const summaryDiv = document.getElementById("summary");
  
    // 2) 테이블 렌더링
    function renderTable() {
      tableBody.innerHTML = "";
      if (menuData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">조회 내역이 없습니다.</td></tr>`;
        return;
      }
      menuData.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.no}</td>
          <td>${item.menuName}</td>
          <td>${item.menuCode}</td>
          <td>${item.menuImage ? item.menuImage : ""}</td>
          <td>
            <input type="checkbox" class="sale-status" data-no="${item.no}" ${item.saleStatus ? "checked" : ""}>
          </td>
          <td>${item.remark || ""}</td>
        `;
        tableBody.appendChild(tr);
      });
    }
    renderTable();
  
    // 3) 판매상태 체크박스 변경 이벤트
    document.addEventListener("change", (e) => {
      if (e.target.classList.contains("sale-status")) {
        const no = parseInt(e.target.dataset.no);
        const newStatus = e.target.checked;
        updateSaleStatus(no, newStatus);
        showFinalMessage(`판매상태가 변경되었습니다.`);
      }
    });
  
    // 4) "메뉴추가" 버튼 → 메뉴 추가 모달 열기
    menuAddBtn.addEventListener("click", openMenuAddModal);
  
    function openMenuAddModal() {
      menuAddModal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-box">
            <h4>메뉴 추가</h4>
            <div class="drag-area" id="dragArea" style="padding:80px;">
              <p>Drag & drop files or <span class="browse-btn">Browse</span></p>
              <input type="file" id="fileInput" accept="image/*">
            </div>
            <div style="margin-bottom:10px;">
              <label>메뉴명</label><br>
              <input type="text" id="newMenuName" placeholder="메뉴명을 입력하세요" style="width:200px;">
            </div>
            <div style="margin-bottom:10px;">
              <label>메뉴코드</label><br>
              <input type="text" id="newMenuCode" placeholder="예: BR###" style="width:200px;">
            </div>
            <button id="menu-add-submit" style="margin-right:10px;">등록하기</button>
            <button id="menu-add-cancel">취소</button>
          </div>
        </div>
      `;
      // 취소 버튼
      document.getElementById("menu-add-cancel").addEventListener("click", closeMenuAddModal);
      // 등록하기 버튼
      document.getElementById("menu-add-submit").addEventListener("click", () => {
        const newMenuName = document.getElementById("newMenuName").value.trim();
        const newMenuCode = document.getElementById("newMenuCode").value.trim();
        if (!newMenuName || !newMenuCode) {
          alert("메뉴명과 메뉴코드는 필수입니다.");
          return;
        }
        // 파일명 가져오기
        const fileInput = document.getElementById("fileInput");
        let fileName = "";
        if (fileInput.files && fileInput.files.length > 0) {
          fileName = fileInput.files[0].name;
        }
        closeMenuAddModal();
        // 중앙 확인 모달 열기
        openConfirmModalForNewMenu(newMenuName, newMenuCode, fileName);
      });
  
      // 드래그 앤 드롭 처리
      const dragArea = document.getElementById("dragArea");
      const fileInput = document.getElementById("fileInput");
      const browseBtn = dragArea.querySelector(".browse-btn");
  
      browseBtn.addEventListener("click", () => {
        fileInput.click();
      });
  
      // 드래그 영역 이벤트
      dragArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dragArea.style.borderColor = "#5a3e96";
      });
      dragArea.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragArea.style.borderColor = "#ccc";
      });
      dragArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dragArea.style.borderColor = "#ccc";
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          fileInput.files = files;
        }
      });
    }
  
    function closeMenuAddModal() {
      menuAddModal.innerHTML = "";
    }
  
    // 5) 중앙 확인 모달 (신규 메뉴 등록)
    function openConfirmModalForNewMenu(newMenuName, newMenuCode, fileName) {
      confirmModal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-box">
            <p>정말 메뉴 "${newMenuName}"(코드: ${newMenuCode})를 등록하시겠습니까?</p>
            <button id="confirm-new-yes" style="margin-right:10px;">예</button>
            <button id="confirm-new-no">아니오</button>
          </div>
        </div>
      `;
      document.getElementById("confirm-new-yes").addEventListener("click", () => {
        addNewMenu(newMenuName, newMenuCode, fileName);
        closeConfirmModal();
        showFinalMessage("메뉴가 등록되었습니다.");
        renderTable();
      });
      document.getElementById("confirm-new-no").addEventListener("click", () => {
        closeConfirmModal();
      });
    }
  
    function closeConfirmModal() {
      confirmModal.innerHTML = "";
    }
  
    // 6) 신규 메뉴 추가
    function addNewMenu(menuName, menuCode, fileName) {
      const newNo = menuData.length > 0 ? Math.max(...menuData.map(item => item.no)) + 1 : 1;
      const newMenu = {
        no: newNo,
        menuName: menuName,
        menuCode: menuCode,
        menuImage: fileName, // 업로드한 파일명
        saleStatus: true,
        remark: ""
      };
      menuData.push(newMenu);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    }
  
    // 7) 판매상태 업데이트 (체크박스)
    function updateSaleStatus(no, newStatus) {
      menuData = menuData.map(item => {
        if (item.no === no) {
          item.saleStatus = newStatus;
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    }
  
    // 8) 변경 완료 메시지
    function showFinalMessage(message) {
        let messageBox = document.getElementById("finalMessage");
      
        if (!messageBox) {
          messageBox = document.createElement("div");
          messageBox.id = "finalMessage";
          document.body.appendChild(messageBox);
        }
      
        messageBox.textContent = message;
        messageBox.style.display = "block";
      
        setTimeout(() => {
          messageBox.style.display = "none";
        }, 5000); // 3초 후 메시지 사라짐
      }
      
  });
  