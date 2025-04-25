document.addEventListener("DOMContentLoaded", () => {
  const methodButtons = document.querySelectorAll(".payment-method");

  methodButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedMethod = button.dataset.method;

      if (!selectedMethod) {
        alert("결제 수단 정보가 없습니다.");
        return;
      }

      const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");

      // ✅ 최소 결제 금액 검사 먼저!
      if (!paymentData.finalAmount || paymentData.finalAmount < 1000) {
        alert("최소 결제 금액은 1,000원 이상이어야 합니다.");
        return;
      }

      console.log("💳 선택된 결제수단:", selectedMethod);

      if (selectedMethod === "신용카드") {
        // ✅ 조건 통과 후에 Toss 결제 페이지로 이동
        window.location.href = "/widget/checkout.html";
        return;
      }

      // 다른 결제 방식은 이후 구현
      alert(`${selectedMethod} 결제는 아직 준비 중입니다.`);
    });
  });
});
