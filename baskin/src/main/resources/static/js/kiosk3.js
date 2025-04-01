// 전역 객체: 선택된 옵션, 수량, 맛, 단가, 그리고 선택된 맛 배열
  var orderData = {
    cupQuantity: 0,
    coneQuantity: 0,
    waffleQuantity: 0,
    price: 3200,         // 단가 (unit price)
    totalQuantity: 0,    // 초기값: 각 옵션 1개씩
    optionType: null,    // 사용자가 선택한 옵션 (cup, cone, waffle)
    flavor: null,        // 최근 선택된 맛 (참고용 단일 값)
    maxFlavors: 3,       // 기본값: 파인트(3개). 실제 값은 제품명에 따라 변경됨
    selectedFlavors: []  // 선택된 맛들을 순서대로 저장 (배열 길이 == maxFlavors)
  };
  
  var activeFlavorSlotIndex = 0; // 현재 활성화된 맛 슬롯 인덱스
  
  document.addEventListener("DOMContentLoaded", function () {
    // 헤더 동적 삽입 (header.html에 상단바 디자인 포함)
    fetch("header.html")
      .then(response => response.text())
      .then(data => {
        const headerContainer = document.getElementById("header-container");
        if (headerContainer) {
          headerContainer.innerHTML = data;
        }
      });
  
    // 푸터 동적 삽입 (필요 시 footer.html 사용)
    fetch("footer.html")
      .then(response => response.text())
      .then(data => {
        const footerContainer = document.getElementById("footer-container");
        if (footerContainer) {
          footerContainer.innerHTML = data;
        }
      });
  
    // 닫기 버튼 동작 추가 (header의 X 버튼)
    document.addEventListener("click", function (event) {
      if (event.target.classList.contains("close-btn")) {
        window.location.href = "kiosk1.html";
      }
    });
  
    // URL 파라미터에서 상품명, 가격 저장
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const price = params.get("price");
  
    if (name) {
      document.getElementById("product-name").textContent = name;
      orderData.name = name;
      updateOptionButtons();
  
      // 제품명에 따라 맛 선택 슬롯 개수를 결정
      if (name === "싱글레귤러" || name === "싱글킹") {
        orderData.maxFlavors = 1;
      } else if (name === "더블주니어" || name === "더블레귤러") {
        orderData.maxFlavors = 2;
      } else if (name === "파인트") {
        orderData.maxFlavors = 3;
      } else if (name === "쿼터") {
        orderData.maxFlavors = 4;
      } else if (name === "패밀리") {
        orderData.maxFlavors = 5;
      } else if (name === "하프갤런") {
        orderData.maxFlavors = 6;
      } else {
        orderData.maxFlavors = 3; // 기본값
      }
    }
  
    if (price) {
      const parsedPrice = parseInt(price, 10);
      document.getElementById("product-price").textContent = `₩${parsedPrice.toLocaleString('ko-KR')}`;
      orderData.price = parsedPrice; // 단가 저장
      // 총 가격은 나중에 updateTotalQuantityAndPrice()에서 계산
      updateTotalQuantityAndPrice();
    }
  
    // 맛 슬롯 생성: orderData.maxFlavors 개수만큼 동적으로 생성
    generateFlavorSlots();
  
    // 초기 페이지네이션 활성화 (플레이버 1페이지)
    document.querySelector('.pagination button[data-page="1"]').classList.add('active');
  });
  
  function goBackToTestPage() {
    window.location.href = "kiosk1.html";
  }
  
  function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(function(tab) {
      tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.getElementById("tabProduct").classList.toggle("active", tabId === "productTab");
    document.getElementById("tabFlavor").classList.toggle("active", tabId === "flavorTab");
  }
  
  function showFlavorPanel(page) {
    document.querySelectorAll('.flavor-panel').forEach(function(panel) {
      panel.classList.remove('active');
    });
    const targetPanel = document.getElementById('flavorPanel' + page);
    if (targetPanel) {
      targetPanel.classList.add('active');
    } else {
      console.error('flavorPanel' + page + ' 요소를 찾을 수 없습니다.');
    }
  
    // 페이지네이션 인디케이터 업데이트
    document.querySelectorAll('.pagination button').forEach((btn) => {
      if (btn.getAttribute('data-page') === page.toString()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  function selectFlavor(imgElement) {
    // 현재 활성 슬롯 가져오기
    let slot = document.querySelector(`.flavor-slot[data-slot-index="${activeFlavorSlotIndex}"]`);
    if (!slot) {
      alert("먼저 맛 선택 슬롯을 선택해 주세요.");
      return;
    }
  
    // 슬롯에 이미지 태그 채워넣기 (CSS에서 크기에 맞게 조정)
    slot.innerHTML = `<img src="${imgElement.src}" alt="${imgElement.alt}">`;
  
    // 선택된 맛을 orderData.selectedFlavors 배열에 저장
    orderData.selectedFlavors[activeFlavorSlotIndex] = imgElement.alt;
  
    // 최신 선택한 맛 (참고용) 업데이트
    orderData.flavor = imgElement.alt;
    console.log("선택된 맛 슬롯 업데이트:", orderData.selectedFlavors);
  }
  
  function selectOption(option) {
    if (!isOptionSelectable()) {
      alert("이 제품은 컵, 콘, 와플 선택이 불가능합니다.");
      return;
    }
    console.log("선택된 옵션:", option);
    orderData.optionType = option;
  }
  
  function isOptionSelectable() {
    return ["싱글레귤러", "싱글킹", "더블주니어", "더블레귤러"].includes(orderData.name);
  }
  
  function changeQuantityForOption(delta, option) {
    let spanId = "finalQuantity-" + option;
    let qtyElem = document.getElementById(spanId);
    let current = parseInt(qtyElem.textContent, 10);
    current = Math.max(0, current + delta); // 0부터 시작 (맛 선택 수량은 0부터)
    qtyElem.textContent = current;
  
    if (option === "cup") {
      orderData.cupQuantity = current;
    } else if (option === "cone") {
      orderData.coneQuantity = current;
    } else if (option === "waffle") {
      orderData.waffleQuantity = current;
    }
  
    updateTotalQuantityAndPrice();
  }
  
  function updateTotalQuantityAndPrice() {
    orderData.totalQuantity = orderData.cupQuantity + orderData.coneQuantity + orderData.waffleQuantity;
  
    // 총 가격(totalPrice)을 새로 계산해서 저장
    orderData.totalPrice = orderData.totalQuantity * orderData.price;
  
    document.getElementById("totalPrice").textContent =
      orderData.totalPrice.toLocaleString('ko-KR');
  }
  
  function updateOptionButtons() {
    const buttons = document.querySelectorAll(".option-button");
    const isSelectable = isOptionSelectable();
  
    buttons.forEach(button => {
      if (isSelectable) {
        button.removeAttribute("disabled");
      } else {
        button.setAttribute("disabled", "true");
      }
    });
  }
  
  // 맛 슬롯 생성 함수: flavor-slots-container 내에 orderData.maxFlavors 개의 슬롯 생성
  function generateFlavorSlots() {
    const container = document.querySelector('.flavor-slots-container');
    container.innerHTML = '';
    orderData.selectedFlavors = [];
  
    for (let i = 0; i < orderData.maxFlavors; i++) {
      orderData.selectedFlavors.push(null);
      const slot = document.createElement('div');
      slot.className = 'flavor-slot';
      slot.setAttribute('data-slot-index', i);
      slot.innerHTML = '<span class="slot-placeholder">+</span>';
      slot.addEventListener('click', function(e) {
        e.stopPropagation();
        setActiveFlavorSlot(i);
      });
      container.appendChild(slot);
    }
  
    // 기본 활성 슬롯 0
    setActiveFlavorSlot(0);
  }
  
  function setActiveFlavorSlot(index) {
    activeFlavorSlotIndex = index;
    document.querySelectorAll('.flavor-slot').forEach((slot, i) => {
      if (i === index) {
        slot.classList.add('active');
      } else {
        slot.classList.remove('active');
      }
    });
  }
  
  function saveOrderData() {
    console.log("최종 주문 데이터:", orderData);
  
    // price 값을 총가격(totalPrice)으로 덮어씁니다.
    orderData.price = orderData.totalPrice;
  
    // 기존 cartOrders 배열을 불러와 새 주문 데이터를 누적합니다.
    var cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");
    cartOrders.push(orderData);
    localStorage.setItem("cartOrders", JSON.stringify(cartOrders));
  
    // 별도의 alert 없이 test.html로 즉시 이동
    window.location.href = "kiosk1.html";
  }  