/************************************************************
 * kiosk4.js
 * 장바구니 페이지. 서브아이템(subItems) 기반
 * 수량 변경 / 삭제 / flavor combo 표시/선택 등
 * 
 * (수정일: 2025-04-16, 변경자: 강정모)
 ************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.querySelector(".close-button");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      window.location.href = "/customer/kiosk1.html";
    });
  }

  const customBtn = document.querySelector(".custom-button");
  if (customBtn) {
    customBtn.addEventListener("click", () => {
      window.location.href = "/customer/kiosk5.html";
    });
  }

  loadOrdersFromStorage();
  loadPaymentData();
  setupPayBtn();

  // flavor 모달 취소
  const modalCancel = document.getElementById("modalCancelBtn");
  if (modalCancel) {
    modalCancel.addEventListener("click", closeFlavorChoiceModal);
  }
});

/************************************************************
 * 상품명 → 이미지 & 가격 매핑 (임시)
 ************************************************************/
const imageMapping = {
  "더블주니어": "/icon-images/double1.png",
  "더블레귤러": "/icon-images/double2.png",
  "싱글레귤러": "/icon-images/single1.png",
  "싱글킹": "/icon-images/single2.png",
  "쿼터": "/icon-images/quarter.png",
  "파인트": "/icon-images/pint.png",
  "패밀리": "/icon-images/family.png",
  "하프갤런": "/icon-images/half.png"
};
const priceMapping = {
  "더블레귤러": 6200,
  "더블주니어": 4300,
  "싱글레귤러": 3200,
  "싱글킹": 4000,
  "쿼터": 15500,
  "파인트": 8200,
  "패밀리": 22000,
  "하프갤런": 26500
};
function getImageByName(name) {
  return imageMapping[name] || "/icon-images/noimage.png";
}
function getPriceByName(name) {
  return priceMapping[name] || 0;
}

/************************************************************
 * 장바구니 Load → subItems 펼쳐서 UI 생성
 ************************************************************/
function loadOrdersFromStorage() {
  const data = localStorage.getItem("cartOrders");
  if (!data) return;
  const orders = JSON.parse(data);
  if (!Array.isArray(orders)) return;

  orders.forEach(order => {
    if (!order.subItems || order.subItems.length === 0) return;
    order.subItems.forEach(subItem => {
      addOrderItem(order.name, subItem);
    });
  });

  updateTotalPriceUI();
}

/************************************************************
 * addOrderItem : subItem 단위 항목 생성
 ************************************************************/
function addOrderItem(orderName, subItem) {
  const orderList = document.querySelector(".order-list");
  if (!orderList) return;

  const flavorText = subItem.flavors.join(", ");
  const itemInfoText = `(${subItem.type}) ${flavorText}`;
  const currentQuantity = subItem.quantity || 1;

  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.productName = subItem.productName;
  orderItem.dataset.type = subItem.type;
  orderItem.dataset.flavors = subItem.flavors.join("|");

  orderItem.innerHTML = `
    <div class="item-image-wrap">
      <img src="${getImageByName(subItem.productName)}" alt="${subItem.productName}" class="item-image">
    </div>
    <div class="item-details">
      <div class="details-wrap">
        <p class="item-name">${subItem.productName}</p>
        <p class="item-info" style="display:none;">${itemInfoText}</p>
      </div>
    </div>
    <div class="item-quantity">
      <button class="quantity-button decrease">-</button>
      <span class="quantity">${currentQuantity}</span>
      <button class="quantity-button increase">+</button>
    </div>
    <div class="order-wrap">
      <button class="update-button">
        <i class="fa-solid fa-file-pen order-update"></i>
      </button>
    </div>
    <div class="delete-wrap">
      <button class="delete-button">
        <img src="/icon-images/X.png" alt="삭제" class="delete-icon">
      </button>
    </div>
  `;

  const flavorDropdown = document.createElement("div");
  flavorDropdown.classList.add("flavor-dropdown");
  flavorDropdown.style.display = "none";
  flavorDropdown.innerHTML = `
    <p>유형: ${getTypeLabel(subItem.type)}</p>
    <p>맛: ${flavorText}</p>
    <p>수량: ${currentQuantity}개</p>
  `;

  // ✅ 드롭다운을 수정버튼 아래에 삽입
  const orderWrap = orderItem.querySelector(".order-wrap");
  orderWrap.appendChild(flavorDropdown);

  // ✅ 수정 버튼 클릭 시 토글
  const updateBtn = orderItem.querySelector(".update-button");
  updateBtn.addEventListener("click", () => {
    flavorDropdown.style.display = flavorDropdown.style.display === "none" ? "block" : "none";

    if (window.FontAwesome && window.FontAwesome.dom) {
      FontAwesome.dom.i2svg();
    }
  });

  const qtyEl = orderItem.querySelector(".quantity");
  const decBtn = orderItem.querySelector(".decrease");
  const incBtn = orderItem.querySelector(".increase");

  decBtn.addEventListener("click", () => {
    let q = parseInt(qtyEl.textContent, 10);
    if (q > 1) {
      q--;
      qtyEl.textContent = q;
      handleUpdateItemQuantity(subItem.productName, subItem.type, subItem.flavors, q);
      flavorDropdown.innerHTML = `
        <p>유형: ${subItem.type}</p>
        <p>맛: ${flavorText}</p>
        <p>수량: ${q}개</p>
      `;
    }
  });

  incBtn.addEventListener("click", () => {
    let q = parseInt(qtyEl.textContent, 10);
    q++;
    qtyEl.textContent = q;
    handleUpdateItemQuantity(subItem.productName, subItem.type, subItem.flavors, q);
    flavorDropdown.innerHTML = `
      <p>유형: ${subItem.type}</p>
      <p>맛: ${flavorText}</p>
      <p>수량: ${q}개</p>
    `;
  });

  const delBtn = orderItem.querySelector(".delete-button");
  delBtn.addEventListener("click", () => {
    qtyEl.textContent = 0;
    handleUpdateItemQuantity(subItem.productName, subItem.type, subItem.flavors, 0);
    orderItem.remove();
  });

  orderList.appendChild(orderItem);
}


/************************************************************
 * 수량 변경 (subItem 식별)
 ************************************************************/
function handleUpdateItemQuantity(productName, type, flavors, newQty) {
  const data = localStorage.getItem("cartOrders");
  if (!data) return;
  let orders = JSON.parse(data);

  orders = orders.map(order => {
    if (order.name === productName && order.subItems) {
      // 찾기
      const matched = order.subItems.filter(
        si => si.type === type && JSON.stringify(si.flavors) === JSON.stringify(flavors)
      );
      if (matched.length >= 1) {
        matched[0].quantity = newQty;
      }
      // 0이면 제거
      order.subItems = order.subItems.filter(si => si.quantity > 0);
      // 총합 업데이트
      order.totalQuantity = order.subItems.reduce((s, si) => s + si.quantity, 0);
      order.totalPrice = order.subItems.reduce((s, si) => s + (si.unitPrice * si.quantity), 0);
    }
    return order;
  });
  // 수량 0인 order 제거
  orders = orders.filter(o => (o.subItems && o.subItems.length > 0));

  localStorage.setItem("cartOrders", JSON.stringify(orders));
  updateTotalPriceUI();
}

/************************************************************
 * 총 가격 계산 (모든 subItems 합)
 ************************************************************/
function updateTotalPriceUI() {
  const data = localStorage.getItem("cartOrders");
  if (!data) return;
  const orders = JSON.parse(data);

  let total = 0;
  orders.forEach(o => {
    if (!o.subItems) return;
    o.subItems.forEach(si => {
      total += (si.unitPrice * si.quantity);
    });
  });
  const totalPriceEl = document.querySelector(".total-price");
  if (totalPriceEl) {
    totalPriceEl.textContent = `₩${total.toLocaleString()}`;
  }
  const paymentData = {
    totalAmount: total,
    discountAmount: 0,
    finalAmount: total
  };
  localStorage.setItem("paymentData", JSON.stringify(paymentData));
}

/************************************************************
 * 결제 정보 로드 (필요시 UI 사용)
 ************************************************************/
function loadPaymentData() {
  const pay = localStorage.getItem("paymentData");
  if (!pay) return;
  // 필요하면 UI 표시
}

/************************************************************
 * 결제 버튼 처리
 ************************************************************/
function setupPayBtn() {
  const payBtn = document.querySelector(".pay-btn");
  if (!payBtn) return;
  payBtn.addEventListener("click", (e) => {
    const pay = localStorage.getItem("paymentData");
    const paymentData = pay ? JSON.parse(pay) : { finalAmount: 0 };
    if (paymentData.finalAmount < 1000) {
      e.preventDefault();
      showAlert("결제 금액이 0원 또는 1000원 미만인 거래는 처리할 수 없습니다.");
      return;
    }
    window.location.href = "/customer/kiosk5.html";
  });
}

/************************************************************
 * flavor combo 모달 (추후)
 ************************************************************/
function showFlavorChoiceModal(flavorCombos) {
  const modal = document.getElementById("flavorChoiceModal");
  const listDiv = modal.querySelector(".flavor-choice-list");
  listDiv.innerHTML = "";
  flavorCombos.forEach(fc => {
    const div = document.createElement("div");
    div.classList.add("flavor-choice-item");
    div.textContent = `[${fc.type}] ${fc.flavors.join(", ")}`;
    div.addEventListener("click", () => {
      console.log("선택됨:", fc);
      closeFlavorChoiceModal();
    });
    listDiv.appendChild(div);
  });
  modal.classList.remove("hidden");
}
function closeFlavorChoiceModal() {
  const modal = document.getElementById("flavorChoiceModal");
  modal.classList.add("hidden");
}

/************************************************************
 * 알림 메시지
 ************************************************************/
function showAlert(msg) {
  let exist = document.querySelector(".alert-message");
  if (exist) exist.remove();
  let div = document.createElement("div");
  div.className = "alert-message";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = 1; }, 100);
  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 300);
  }, 1000);
}

function getTypeLabel(type) {
  switch (type) {
    case 'cup': return '컵';
    case 'cone': return '콘';
    case 'waffle': return '와플콘';
    case 'noOption': return '단품';
    default: return type;
  }
}