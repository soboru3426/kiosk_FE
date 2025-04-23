document.addEventListener("DOMContentLoaded", () => {
  const methodButtons = document.querySelectorAll(".payment-method");

  methodButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedMethod = button.dataset.method;

      if (!selectedMethod) {
        alert("결제 수단 정보가 없습니다.");
        return;
      }

      console.log("💳 선택된 결제수단:", selectedMethod);

      const cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");
      const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");

      if (!paymentData.finalAmount || paymentData.finalAmount < 1000) {
        alert("최소 결제 금액은 1,000원 이상이어야 합니다.");
        return;
      }

      const updatedOrders = cartOrders.map(order => ({
        name: order.name,
        totalQuantity: order.totalQuantity || order.subItems.reduce((sum, item) => sum + item.quantity, 0),
        subItems: order.subItems,
        paymentMethod: selectedMethod
      }));

      console.log("🧾 [전송 데이터]", updatedOrders);

      fetch("http://tomhoon.duckdns.org:8883/api/customer/pay", {  // ✅ 경로 수정
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedOrders)
      })
        .then(response => {
          if (response.ok) {
            console.log("✅ 결제 완료!");
            localStorage.removeItem("cartOrders");
            localStorage.removeItem("paymentData");
            window.location.href = "/customer/kiosk7.html";
          } else {
            console.error("❌ 결제 실패! 응답 코드:", response.status);
            alert("결제 처리 실패 (코드: " + response.status + ")");
          }
        })
        .catch(error => {
          console.error("❌ 네트워크 또는 서버 오류:", error);
          alert("결제 중 문제가 발생했습니다. 네트워크 상태를 확인해주세요.");
        });
    });
  });
});
