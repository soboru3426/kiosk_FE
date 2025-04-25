document.addEventListener("DOMContentLoaded", function () {
  // 버튼 핸들러
  document.querySelector('.prev-btn')?.addEventListener('click', () => {
      window.location.href = '/customer/kiosk4.html';
  });

  document.querySelector('.prev-btn2')?.addEventListener('click', () => {
      window.location.href = '/customer/kiosk5.html';
  });

  document.querySelector('.next-btn')?.addEventListener('click', () => {
      window.location.href = '/customer/kiosk6.html';
  });

  document.querySelector('.cancel-btn')?.addEventListener('click', () => {
      window.location.href = '/customer/kiosk1.html';
  });

  const cartOrdersRaw = localStorage.getItem("cartOrders");
  if (!cartOrdersRaw) {
      console.warn("❗ cartOrders 없음");
      return;
  }

  const cartOrders = JSON.parse(cartOrdersRaw || "[]");

  let selectedMenuPrice = [];
  let totalMenuPrice = 0;

  cartOrders.forEach(order => {
      if (!order.subItems || !Array.isArray(order.subItems)) return;

      order.subItems.forEach(sub => {
          const unitPrice = Number(sub.unitPrice) || 0;
          const quantity = Number(sub.quantity || 1);  // quantity가 없다면 기본값 1
          const price = unitPrice * quantity;

          selectedMenuPrice.push(price);
          totalMenuPrice += price;
      });
  });

  const discountPrice = 0;
  const finalAmount = totalMenuPrice - discountPrice;

  console.log("Selected subItem prices:", selectedMenuPrice);
  console.log("Total menu price:", totalMenuPrice);
  console.log("Final amount:", finalAmount);

  // ✅ paymentData도 자동 생성 (kiosk4 안 거쳐도 되도록)
  localStorage.setItem("paymentData", JSON.stringify({
      totalAmount: totalMenuPrice,
      discountAmount: discountPrice,
      finalAmount: finalAmount
  }));

  // 총 결제 금액 UI에 표시하기
  document.getElementById("order-total-price").textContent = "₩ " + totalMenuPrice.toLocaleString();
  document.getElementById("total-discount-price").textContent = "₩ " + discountPrice.toLocaleString();
  document.getElementById("final-total-amount").textContent = "₩ " + finalAmount.toLocaleString();
});
