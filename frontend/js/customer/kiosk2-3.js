var orderData = {
  cupQuantity: 0,
  coneQuantity: 0,
  waffleQuantity: 0,
  noOptionQuantity: 1,
  price: 0,
  name: '',
  optionType: null,
  maxFlavors: 1,
  selectedFlavors: [],
  subItems: [],
  activeSubItemIndex: -1
};

let activeFlavorSlotIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productName = params.get("name");
  const productPrice = params.get("price");
  const triangle = document.createElement('div');
  triangle.id = 'slot-arrow';
  triangle.classList.add('hidden');

  const container = document.querySelector('.bottom-slot-container');
  const subItemsArea = document.querySelector('.subItems-area');
  container.insertBefore(triangle, subItemsArea);

  if (productName) {
    orderData.name = productName;
    document.getElementById("product-name").textContent = productName;
    setMaxFlavorsByName(productName);

    const productImgBox = document.getElementById("product-img-box");
    productImgBox.innerHTML = '';
    if (["싱글레귤러", "싱글킹", "더블주니어", "더블레귤러"].includes(productName)) {
      productImgBox.classList.add('rotated');
      productImgBox.innerHTML = `
        <img src="/icon-images/pd_cone.png" alt="콘" style="width:70px;">
        <img src="/icon-images/pd_cup.png" alt="컵" style="width:70px;">
      `;
    } else {
      productImgBox.classList.remove('rotated');
      productImgBox.innerHTML = `<img src="/icon-images/pd_cup.png" alt="컵" style="width:80px;">`;
    }
  }

  if (productPrice) {
    orderData.price = parseInt(productPrice, 10) || 0;
    document.getElementById("product-price").textContent =
      `₩${orderData.price.toLocaleString('ko-KR')}`;
  }

  if (isOptionSelectable(orderData.name)) {
    document.querySelector('.selection').style.display = 'flex';
    document.querySelector('.no-option-quantity').style.display = 'none';
  } else if (isCupOnlyOption(orderData.name)) {
    document.querySelector('.selection').style.display = 'flex';
    document.querySelector('.no-option-quantity').style.display = 'none';
    document.querySelector("[onclick*='cone']").style.display = 'none';
    document.querySelector("[onclick*='waffle']").style.display = 'none';
  } else {
    document.querySelector('.selection').style.display = 'none';
    document.querySelector('.no-option-quantity').style.display = 'block';
  }

  showTab('productTab');
  renderSubItems();
  updateNavigationButton();
  showFlavorPanel(1);
});

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.getElementById("tabProduct").classList.toggle("active", tabId === 'productTab');
  document.getElementById("tabFlavor").classList.toggle("active", tabId === 'flavorTab');
  updateNavigationButton();
}

function updateNavigationButton() {
  const btnCart = document.getElementById("btnCart");
  if (document.getElementById("flavorTab").classList.contains("active")) {
    btnCart.textContent = "담기";
    btnCart.setAttribute("onclick", "saveOrderData()");
  } else {
    btnCart.textContent = "플레이버(맛) 선택";
    btnCart.setAttribute("onclick", "showTab('flavorTab')");
  }
}

function showFlavorPanel(page) {
  document.querySelectorAll('.flavor-panel').forEach(panel => panel.classList.remove('active'));
  const target = document.getElementById(`flavorPanel${page}`);
  if (target) target.classList.add('active');
  document.querySelectorAll('.pagination button').forEach(btn => btn.classList.remove('active'));
  const currentBtn = document.querySelector(`.pagination button[data-page="${page}"]`);
  if (currentBtn) currentBtn.classList.add('active');
}

function isOptionSelectable(name) {
  return ["싱글레귤러", "싱글킹", "더블주니어", "더블레귤러"].includes(name);
}
function isCupOnlyOption(name) {
  return ["파인트", "쿼터", "패밀리", "하프갤런"].includes(name);
}

function setMaxFlavorsByName(name) {
  const map = {
    "싱글레귤러": 1, "싱글킹": 1,
    "더블주니어": 2, "더블레귤러": 2,
    "파인트": 3, "쿼터": 4,
    "패밀리": 5, "하프갤런": 6
  };
  orderData.maxFlavors = map[name] || 1;
}

function changeQuantityForOption(delta, option) {
  const span = document.getElementById("finalQuantity-" + option);
  let current = parseInt(span.textContent) || 0;
  current = Math.max(0, current + delta);
  span.textContent = current;
  orderData[option + "Quantity"] = current;
  renderSubItems();
}

function changeProductQuantity(delta) {
  const span = document.getElementById("noOptionQuantity");
  let current = parseInt(span.textContent) || 0;
  current = Math.max(0, current + delta);
  span.textContent = current;
  orderData.noOptionQuantity = current;
  renderSubItems();
}

function selectOption(option) {
  orderData.optionType = option;
}

function renderSubItems() {
  const arr = [];
  for (let i = 0; i < orderData.cupQuantity; i++) {
    arr.push(createSubItem("cup"));
  }
  for (let i = 0; i < orderData.coneQuantity; i++) {
    arr.push(createSubItem("cone"));
  }
  for (let i = 0; i < orderData.waffleQuantity; i++) {
    arr.push(createSubItem("waffle"));
  }
  if (!isOptionSelectable(orderData.name) && !isCupOnlyOption(orderData.name)) {
    for (let i = 0; i < orderData.noOptionQuantity; i++) {
      arr.push(createSubItem("noOption"));
    }
  }
  orderData.subItems = arr;

  if (orderData.activeSubItemIndex >= arr.length) {
    orderData.activeSubItemIndex = -1;
  }

  renderSubItemsArea();
  generateFlavorSlots();
  updateArrowPosition();
}

function createSubItem(type) {
  return {
    type,
    flavors: [],
    maxFlavors: orderData.maxFlavors,
    unitPrice: orderData.price,
    productName: orderData.name,
    quantity: 1
  };
}

function renderSubItemsArea() {
  const container = document.querySelector('.subItems-area');
  if (!container) return;
  container.innerHTML = '';

  orderData.subItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'subItem-card';

    // ✅ 이미지 소스와 라벨 설정
    let label = '';
    let icon = '';
    let imgWidth = '65px';
    let imgHeight = '65px';

    switch (item.type) {
      case 'cup':
        label = '컵';
        icon = '/icon-images/pd_cup.png';
        imgWidth = '65px';
        imgHeight = '65px';
        break;
      case 'cone':
        label = '콘';
        icon = '/icon-images/pd_cone.png';
        imgWidth = '55px';
        imgHeight = '65px';
        break;
      case 'waffle':
        label = '와플콘';
        icon = '/icon-images/pd_cone.png';
        imgWidth = '55px';
        imgHeight = '65px';
        break;
      case 'noOption':
      default:
        label = '단품';
        icon = '/icon-images/pd_cup.png';
        imgWidth = '65px';
        imgHeight = '65px';
    }

    div.innerHTML = `
      <img src="${icon}" style="width:${imgWidth}; height:${imgHeight};">
      <p>${label}</p>
    `;

    if (idx === orderData.activeSubItemIndex) div.classList.add('active');
    div.addEventListener('click', () => {
      setActiveSubItemIndex(idx);
    });

    container.appendChild(div);
  });
}


function setActiveSubItemIndex(idx, flavorIdxToFocus = null) {
  orderData.activeSubItemIndex = idx;
  const item = orderData.subItems[idx];

  const hasNoFlavorSelected = item.flavors.every(f => !f);
  const nextEmptyIndex = item.flavors.findIndex(f => !f);

  // ✅ 항상 먼저 초기화
  activeFlavorSlotIndex = 0;

  // 다음 활성화될 슬롯 조건 처리
  if (flavorIdxToFocus !== null) {
    activeFlavorSlotIndex = flavorIdxToFocus;
  } else if (hasNoFlavorSelected) {
    activeFlavorSlotIndex = 0;
  } else if (nextEmptyIndex >= 0) {
    activeFlavorSlotIndex = nextEmptyIndex;
  } else {
    activeFlavorSlotIndex = item.maxFlavors - 1;
  }

  renderSubItemsArea();
  generateFlavorSlots();
  updateArrowPosition();
}

function generateFlavorSlots() {
  const container = document.querySelector('.flavor-slots-container');
  if (!container) return;
  container.innerHTML = '';
  if (orderData.activeSubItemIndex < 0) return;

  const subItem = orderData.subItems[orderData.activeSubItemIndex];
  for (let i = 0; i < subItem.maxFlavors; i++) {
    const div = document.createElement('div');
    div.className = 'flavor-slot';
    div.setAttribute('data-slot-index', i);
    div.innerHTML = subItem.flavors[i]
      ? `<img src="/flavor-images/${subItem.flavors[i]}.png" alt="${subItem.flavors[i]}" style="width:70px; height:70px; object-fit:cover;">`
      : `<span class="slot-placeholder">${i + 1}</span>`;
    div.addEventListener('click', () => setActiveFlavorSlot(i));

    // ✅ 이 부분이 핵심! activeFlavorSlotIndex 기준으로 테두리 적용
    if (i === activeFlavorSlotIndex) {
      div.classList.add('active');
    }

    container.appendChild(div);
  }
}


function setActiveFlavorSlot(idx) {
  activeFlavorSlotIndex = idx;
  document.querySelectorAll('.flavor-slot').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });
}

function selectFlavor(element) {
  if (orderData.activeSubItemIndex < 0) {
    alert("상품을 먼저 선택해주세요!");
    return;
  }
  let img = element.querySelector('img');
  let flavor = img.alt;
  animateFlavorClick(img);
  orderData.subItems[orderData.activeSubItemIndex].flavors[activeFlavorSlotIndex] = flavor;
  if (activeFlavorSlotIndex < orderData.subItems[orderData.activeSubItemIndex].maxFlavors - 1) {
    setActiveFlavorSlot(activeFlavorSlotIndex + 1);
  }
  renderSubItemsArea();
  generateFlavorSlots();
}

function saveOrderData() {
  if (orderData.subItems.length < 1) {
    alert("최소 1개 이상 아이스크림을 선택해주세요!");
    showTab('productTab');
    return;
  }

  for (let i = 0; i < orderData.subItems.length; i++) {
    const item = orderData.subItems[i];
    const selectedCount = item.flavors.filter(f => !!f).length;

    if (selectedCount < item.maxFlavors) {
      alert(`아이스크림의 맛을 ${item.maxFlavors}개 모두 선택해주세요!`);
      showTab('flavorTab');

      // ✅ 정확한 빈 슬롯 위치로 포커싱
      const nextEmptyIndex = item.flavors.findIndex(f => !f);
      const slotToFocus = nextEmptyIndex >= 0 ? nextEmptyIndex : 0;

      setActiveSubItemIndex(i, slotToFocus);  // 정확한 포커스 위치 전달
      return;
    }
  }

  let cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");
  cartOrders.push({ ...orderData });
  localStorage.setItem("cartOrders", JSON.stringify(cartOrders));

  alert("장바구니에 담았습니다!");
  window.location.href = "/customer/kiosk1.html";
}


function animateFlavorClick(imgElement) {
  imgElement.classList.add("flavor-zoom-anim");
  setTimeout(() => {
    imgElement.classList.remove("flavor-zoom-anim");
  }, 300);
}

function goBackToTestPage() {
  window.location.href = "/customer/kiosk1.html";
}

function btnCartAction() {
  if (document.getElementById("flavorTab").classList.contains("active")) {
    saveOrderData();
  } else {
    showTab('flavorTab');
  }
}

function updateArrowPosition() {
  const triangle = document.getElementById('slot-arrow');
  const cards = document.querySelectorAll('.subItem-card');
  const targetCard = cards[orderData.activeSubItemIndex];
  if (!triangle || !targetCard || orderData.activeSubItemIndex === -1) {
    if (triangle) triangle.classList.add('hidden');
    return;
  }
  const cardRect = targetCard.getBoundingClientRect();
  const containerRect = document.querySelector('.slots-container').getBoundingClientRect();
  const offset = cardRect.left - containerRect.left + cardRect.width / 2 - 10;
  triangle.style.left = `${offset}px`;
  triangle.classList.remove('hidden');
}
