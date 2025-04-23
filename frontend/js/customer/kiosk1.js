/************************************************************
 * kiosk1.js
 *  - header.html, footer.html 동적 삽입
 *  - localStorage(cartOrders, paymentData)에서
 *    1) 장바구니 버튼에 서브 아이스크림 총 갯수 표시
 *    2) 결제 버튼에 paymentData.finalAmount 표시
 ************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  // 1) header.html 동적 삽입
  fetch("header.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
    })
    .catch(err => console.error("header.html 로드 실패:", err));

  // 2) footer.html 동적 삽입
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;

      const cart = document.querySelector('.cart');
      const payBtn = document.querySelector('.pay-btn');

      // 장바구니 버튼 클릭 -> kiosk4.html 이동
      if (cart) {
        cart.addEventListener('click', () => {
          console.log('🛒 장바구니 클릭됨');
          window.location.href = '/customer/kiosk4.html';
        });
      }

      // 결제 버튼 클릭 -> kiosk5.html 이동
      if (payBtn) {
        payBtn.addEventListener('click', () => {
          console.log('💳 결제 버튼 클릭됨');
          window.location.href = '/customer/kiosk5.html';
        });
      }

      // UI 업데이트
      updateCartAndPayUI();
    })
    .catch(err => console.error("footer.html 로드 실패:", err));

  // 3) 닫기 버튼 → localStorage 초기화 후 재로딩
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-btn")) {
      localStorage.clear();
      window.location.href = "kiosk1.html";
    }
  });

  // 4) 상품 클릭 시 kiosk2-3.html 이동
  const products = document.querySelectorAll(".product");
  products.forEach(product => {
    product.addEventListener("click", function () {
      const name = product.querySelector(".name").textContent.trim();
      const priceText = product.querySelector(".price").textContent.replace("₩", "").replace(",", "");
      const price = parseInt(priceText, 10) || 0;
      window.location.href = `kiosk2-3.html?name=${encodeURIComponent(name)}&price=${price}`;
    });
  });
});

// 페이지 포커스 시에도 최신 UI 반영
window.addEventListener("focus", function() {
  updateCartAndPayUI();
});

/************************************************************
 * 장바구니 버튼 배지 표시 + 결제 버튼에 paymentData.finalAmount 표시
 ************************************************************/
function updateCartAndPayUI() {
  try {
    const cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");
    let totalQuantity = 0;
    let computedTotal = 0;

    cartOrders.forEach(order => {
      if (order.subItems && Array.isArray(order.subItems)) {
        const qty = order.subItems.length;
        totalQuantity += qty;
        computedTotal += (order.price || 0) * qty;
      }
    });

    let finalAmount = computedTotal;
    const storedPayment = localStorage.getItem("paymentData");
    if (storedPayment) {
      try {
        const paymentData = JSON.parse(storedPayment);
        finalAmount = paymentData.finalAmount || computedTotal;
      } catch (e) {
        console.warn("paymentData 파싱 오류:", e);
      }
    }

    // 장바구니 배지
    const cart = document.querySelector(".cart");
    if (cart) {
      const oldBadge = cart.querySelector(".cart-badge");
      if (oldBadge) oldBadge.remove();

      if (totalQuantity > 0) {
        const badge = document.createElement("div");
        badge.classList.add("cart-badge");
        badge.textContent = totalQuantity;
        cart.appendChild(badge);
      }
    }

    // 결제 버튼 UI
    const payBtn = document.querySelector(".pay-btn");
    if (payBtn) {
      payBtn.classList.add('pay-btn');
      if (totalQuantity > 0) {
        const displayPrice = `₩${finalAmount.toLocaleString()}`;
        payBtn.innerHTML = `${displayPrice} 결제하기 <img src="/purchase-images/arrow_forward_ios2.png" alt="결제">`;
      } else {
        payBtn.innerHTML = `결제하기 <img src="/purchase-images/arrow_forward_ios2.png" alt="결제">`;
      }
    }

  } catch (err) {
    console.error("updateCartAndPayUI 오류:", err);
  }
}

