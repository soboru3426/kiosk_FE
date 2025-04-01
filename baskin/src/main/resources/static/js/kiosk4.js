document.addEventListener("DOMContentLoaded", function () {
    loadOrdersFromStorage();
});

// 이미지 매핑 객체
const imageMapping = {
    "더블레귤러": "4images/더블레귤러.png",
    "더블주니어": "4images/더블주니어.png",
    "싱글레귤러": "4images/싱글레귤러.png",
    "싱글킹": "4images/싱글킹.png",
    "쿼터": "4images/쿼터.png",
    "파인트": "4images/파인트.png",
    "패밀리": "4images/패밀리.png",
    "하프갤런": "4images/하프갤런.png"
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
    return imageMapping[name]; // 기본 이미지 반환
}

function getPriceByName(name) {
    return priceMapping[name]; // 기본 이미지 반환
}

function loadOrdersFromStorage() {
    const storedOrders = localStorage.getItem("cartOrders");
    if (!storedOrders) return;  // 저장된 데이터가 없으면 종료

    const orders = JSON.parse(storedOrders); // JSON 문자열을 객체로 변환

    // 총 가격을 초기화
    let totalPriceSum = 0;

    orders.forEach(order => {
        // 각 항목에 대한 가격 계산
        const cupPrice = order.cupQuantity * getPriceByName(order.name);
        const conePrice = order.coneQuantity * getPriceByName(order.name);
        const wafflePrice = order.waffleQuantity * getPriceByName(order.name);
        
        totalPriceSum += cupPrice + conePrice + wafflePrice;

        // 컵 항목
        if (order.cupQuantity > 0) {
            addOrderItem({
                name: order.name,
                info: "(컵)",
                quantity: order.cupQuantity,
                price: order.price,
                image: getImageByName(order.name)
            });
        }

        // 콘 항목
        if (order.coneQuantity > 0) {
            addOrderItem({
                name: order.name,
                info: "(콘)",
                quantity: order.coneQuantity,
                price: order.price,
                image: getImageByName(order.name)
            });
        }

        // 와플 항목
        if (order.waffleQuantity > 0) {
            addOrderItem({
                name: order.name,
                info: "(와플)",
                quantity: order.waffleQuantity,
                price: order.price,
                image: getImageByName(order.name)
            });
        }
    });

    // total-price 부분 업데이트
    const totalPriceElement = document.querySelector('.total-price');
    totalPriceElement.textContent = `₩${totalPriceSum.toLocaleString()}`; // 천 단위로 구분하여 표시
}

function addOrderItem(order) {
    const orderList = document.querySelector(".order-list");

    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");
    orderItem.setAttribute("data-name", order.name);

    orderItem.innerHTML = `
        <div class="item-image-wrap">
            <img src="${order.image}" alt="${order.name}" class="item-image">
        </div>

        <div class="item-details">
            <div class="details-wrap">
                <p class="item-name">${order.name}</p>
                <p class="item-info">${order.info}</p>
            </div>
        </div>

        <div class="item-quantity">
            <button class="quantity-button decrease">-</button>
            <span class="quantity">${order.quantity}</span>
            <button class="quantity-button increase">+</button>
        </div>

        <div class="order-wrap">
            <button class="update-button">
                <i class="fa-solid fa-file-pen order-update"></i>
            </button>
        </div>

        <div class="delete-wrap">
            <button class="delete-button">
                <img src="4images/X.png" alt="닫기 아이콘" class="close-icon">
            </button>
        </div>
    `;

    // 수량 증가/감소 버튼 이벤트
    const decreaseButton = orderItem.querySelector(".decrease");
    const increaseButton = orderItem.querySelector(".increase");
    const quantityElement = orderItem.querySelector(".quantity");

    decreaseButton.addEventListener("click", function () {
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantity -= 1;
            quantityElement.textContent = quantity;
            updateOrderInStorage(order.name, order.info, quantity);
        }
    });

    increaseButton.addEventListener("click", function () {
        let quantity = parseInt(quantityElement.textContent);
        quantity += 1;
        quantityElement.textContent = quantity;
        updateOrderInStorage(order.name, order.info, quantity);
    });

    // 삭제 버튼 이벤트
    const deleteButton = orderItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", function () {
        let quantity = parseInt(quantityElement.textContent);
        quantity = 0;
        quantityElement.textContent = quantity;
        updateOrderInStorage(order.name, order.info, quantity);
    });

    orderList.appendChild(orderItem);
}

function updateOrderInStorage(name, info, quantity) {
    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];

    orders = orders.map(order => {
        if (order.name === name) {  
            if (info === "(컵)") order.cupQuantity = quantity;
            if (info === "(콘)") order.coneQuantity = quantity;
            if (info === "(와플)") order.waffleQuantity = quantity;

            // totalQuantity 업데이트
            order.totalQuantity = order.cupQuantity + order.coneQuantity + order.waffleQuantity;

            // totalPrice 업데이트
            order.totalPrice = order.totalQuantity * getPriceByName(order.name);
        }
        return order;
    });

    localStorage.setItem("cartOrders", JSON.stringify(orders));

    // 전체 주문 총 가격 업데이트
    updateTotalPrice();
}

// 전체 주문 총 가격을 업데이트하는 함수 추가
function updateTotalPrice() {
    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];
    
    let totalPriceSum = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // total-price 요소 업데이트
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `₩${totalPriceSum.toLocaleString()}`;
        if(totalPriceElement.textContent==="0"){
            orderItem.remove(); // 해당 요소만 제거
            removeOrderFromStorage(order.name, order.info); // 로컬 스토리지에서도 삭제
        }
    }
}

function removeOrderFromStorage(name, info) {
    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];

    // 삭제할 항목을 제외한 나머지 주문만 유지
    orders = orders.filter(order => !(order.name === name && order.info === info));

    // 변경된 목록을 다시 저장
    localStorage.setItem("cartOrders", JSON.stringify(orders));

    // 총 가격 업데이트
    updateTotalPrice();
}