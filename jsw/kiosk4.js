document.addEventListener("DOMContentLoaded", function () {
    loadOrdersFromStorage();
});

// **************************
// 1. 옵션 구분 함수들
// **************************

// 컵/콘/와플 옵션이 필요한 제품인지 판별
function isOptionSelectable(name) {
    return ["싱글레귤러", "싱글킹", "더블주니어", "더블레귤러"].includes(name);
}

// (선택) 파인트, 쿼터, 패밀리, 하프갤런처럼 옵션이 없는지 판별
// 여기선 사용 예시를 위해 함수로 분리했으나, 필요 없다면 생략 가능
function isOptionless(name) {
    return ["파인트", "쿼터", "패밀리", "하프갤런"].includes(name);
}

// **************************
// 2. 상품명 → 이미지, 가격 매핑
// **************************

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

// 가격 매핑 객체
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
    return imageMapping[name];
}

function getPriceByName(name) {
    return priceMapping[name];
}

// **************************
// 3. LocalStorage → 장바구니 UI 생성
// **************************

function loadOrdersFromStorage() {
    const storedOrders = localStorage.getItem("cartOrders");
    if (!storedOrders) return;  // 저장된 데이터가 없으면 종료

    const orders = JSON.parse(storedOrders); // JSON 문자열을 객체로 변환

    // 총 가격을 초기화
    let totalPriceSum = 0;

    orders.forEach(order => {
        // (A) 옵션 불가 제품(파인트, 쿼터, 패밀리, 하프갤런 등)
        if (isOptionless(order.name)) {
            // 수량이 0 초과일 때만 장바구니에 표시
            if ((order.noOptionQuantity || 0) > 0) {
                const itemPrice = order.noOptionQuantity * getPriceByName(order.name);
                totalPriceSum += itemPrice;
                
                addOrderItem({
                    name: order.name,
                    // 파인트, 쿼터, 패밀리, 하프갤런 등은 옵션이 없으므로 info를 "(단품)" 등으로 구분
                    // 혹은 info를 빈문자열로 두어도 괜찮습니다.
                    info: "(단품)",  
                    quantity: order.noOptionQuantity,
                    price: order.price,        // 장바구니에 넘어온 price (혹은 getPriceByName(order.name))
                    image: getImageByName(order.name)
                });
            }
        } 
        // (B) 옵션 가능 제품(컵, 콘, 와플 수량)
        else {
            // 컵 항목
            if (order.cupQuantity > 0) {
                const cupPrice = order.cupQuantity * getPriceByName(order.name);
                totalPriceSum += cupPrice;
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
                const conePrice = order.coneQuantity * getPriceByName(order.name);
                totalPriceSum += conePrice;
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
                const wafflePrice = order.waffleQuantity * getPriceByName(order.name);
                totalPriceSum += wafflePrice;
                addOrderItem({
                    name: order.name,
                    info: "(와플)",
                    quantity: order.waffleQuantity,
                    price: order.price,
                    image: getImageByName(order.name)
                });
            }
        }
    });

    // total-price 부분 업데이트
    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `₩${totalPriceSum.toLocaleString()}`;
    }
}

// **************************
// 4. 장바구니 아이템 DOM 생성
// **************************
function addOrderItem(order) {
    const orderList = document.querySelector(".order-list");

    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");
    orderItem.setAttribute("data-name", order.name);
    orderItem.setAttribute("data-info", order.info);

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

    decreaseButton.addEventListener("click", () => {
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantity -= 1;
            quantityElement.textContent = quantity;
            updateOrderInStorage(order.name, order.info, quantity);
        }
    });

    increaseButton.addEventListener("click", () => {
        let quantity = parseInt(quantityElement.textContent);
        quantity += 1;
        quantityElement.textContent = quantity;
        updateOrderInStorage(order.name, order.info, quantity);
    });

    // 삭제 버튼 이벤트
    const deleteButton = orderItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        // 수량 0으로 만들어서 update → 최종적으로 DOM에서도 제거
        quantityElement.textContent = 0;
        updateOrderInStorage(order.name, order.info, 0);
    });

    orderList.appendChild(orderItem);
}

// **************************
// 5. 수량 변경 시 LocalStorage 업데이트
// **************************
function updateOrderInStorage(name, info, quantity) {
    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];

    orders = orders.map(order => {
        // 해당 상품 찾기
        if (order.name === name) {
            // (A) 옵션 없이 noOptionQuantity 사용하는 제품
            if (isOptionless(order.name)) {
                // info: "(단품)" (혹은 다른 표시)
                // 수량 업데이트
                if (info === "(단품)") {
                    order.noOptionQuantity = quantity;
                }
                order.totalQuantity = order.noOptionQuantity; // 동일
                order.totalPrice = order.noOptionQuantity * getPriceByName(order.name);
            }
            // (B) 컵/콘/와플 옵션이 있는 제품
            else {
                if (info === "(컵)") {
                    order.cupQuantity = quantity;
                } else if (info === "(콘)") {
                    order.coneQuantity = quantity;
                } else if (info === "(와플)") {
                    order.waffleQuantity = quantity;
                }
                // totalQuantity & totalPrice
                order.totalQuantity = order.cupQuantity + order.coneQuantity + order.waffleQuantity;
                order.totalPrice = order.totalQuantity * getPriceByName(order.name);
            }
        }
        return order;
    });

    localStorage.setItem("cartOrders", JSON.stringify(orders));

    // 전체 주문 총 가격 업데이트
    updateTotalPriceUI();

    // 수량이 0이면 DOM에서도 제거
    removeZeroQuantityItems();
}

// **************************
// 6. 전체 총 가격 업데이트
// **************************
function updateTotalPriceUI() {
    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];
    
    let totalPriceSum = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    const totalPriceElement = document.querySelector('.total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `₩${totalPriceSum.toLocaleString()}`;
    }
}

// **************************
// 7. 수량이 0이 된 항목 제거
// **************************
function removeZeroQuantityItems() {
    const orderList = document.querySelector(".order-list");
    const items = orderList.querySelectorAll(".order-item");

    let storedOrders = localStorage.getItem("cartOrders");
    let orders = storedOrders ? JSON.parse(storedOrders) : [];

    items.forEach(item => {
        const itemName = item.getAttribute("data-name");
        const itemInfo = item.getAttribute("data-info");
        const quantityElement = item.querySelector(".quantity");
        const quantity = parseInt(quantityElement.textContent);

        if (quantity === 0) {
            orders = orders.map(order => {
                if (order.name === itemName) {
                    if (isOptionless(order.name) && itemInfo === "(단품)") {
                        order.noOptionQuantity = 0;
                        order.totalQuantity = 0;
                        order.totalPrice = 0;
                        order.price = 0; // ✅ 추가
                    } else {
                        if (itemInfo === "(컵)") order.cupQuantity = 0;
                        if (itemInfo === "(콘)") order.coneQuantity = 0;
                        if (itemInfo === "(와플)") order.waffleQuantity = 0;
                    
                        order.totalQuantity = order.cupQuantity + order.coneQuantity + order.waffleQuantity;
                        order.totalPrice = order.totalQuantity * getPriceByName(order.name);
                    
                        if (order.totalQuantity === 0) {
                            order.price = 0;
                            order.totalPrice = 0; // ✅ 이거 꼭 필요!
                        }
                    }
                }
                return order;
            });

            orderList.removeChild(item); // DOM에서 제거
        }
    });

    localStorage.setItem("cartOrders", JSON.stringify(orders));
    updateTotalPriceUI();
}
