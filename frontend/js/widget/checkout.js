document.addEventListener("DOMContentLoaded", () => {
  main();

  async function main() {
    const button = document.getElementById("payment-button");
    const coupon = document.getElementById("coupon-box");

    const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");
    const rawAmount = paymentData.totalAmount || 50000;
    let discountAmount = paymentData.discountAmount || 0;
    let finalAmount = paymentData.finalAmount || rawAmount;

    const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
    const customerKey = generateRandomString();
    const tossPayments = TossPayments(clientKey);
    const widgets = tossPayments.widgets({ customerKey });

    await widgets.setAmount({
      currency: "KRW",
      value: finalAmount,
    });

    await widgets.renderPaymentMethods({
      selector: "#payment-method",
      variantKey: "DEFAULT",
    });

    await widgets.renderAgreement({
      selector: "#agreement",
      variantKey: "AGREEMENT",
    });

    // ✅ 쿠폰 체크 시 할인 적용
    coupon?.addEventListener("change", async function () {
      if (coupon.checked) {
        // ✅ 5000원 이상일 때만 적용 가능
        if (rawAmount <= 5000) {
          alert("5,000원 쿠폰은 5,000원 초과 결제시에만 사용 가능합니다.");
          coupon.checked = false; // ✅ 자동 체크 해제
          return;
        }
    
        discountAmount = 5000;
        finalAmount = rawAmount - discountAmount;
      } else {
        discountAmount = 0;
        finalAmount = rawAmount;
      }
    
      // ✅ 위젯에 할인 반영
      await widgets.setAmount({
        currency: "KRW",
        value: finalAmount,
      });
    
      // ✅ paymentData 다시 저장
      localStorage.setItem("paymentData", JSON.stringify({
        totalAmount: rawAmount,
        finalAmount: finalAmount,
        discountAmount: discountAmount,
        orderName: "배스킨라빈스 주문"
      }));
    });
    
    // ✅ 결제 요청
    button?.addEventListener("click", async function () {
      // 👉 마지막으로 amount 다시 적용
      await widgets.setAmount({
        currency: "KRW",
        value: finalAmount,
      });

      localStorage.setItem("paymentData", JSON.stringify({
        totalAmount: rawAmount,
        finalAmount,
        discountAmount,
        orderName: "배스킨라빈스 주문"
      }));

      await widgets.requestPayment({
        orderId: generateRandomString(),
        orderName: "배스킨라빈스 주문",
        successUrl: window.location.origin + "/widget/success.html",
        failUrl: window.location.origin + "/widget/fail.html",
        customerEmail: "customer123@gmail.com",
        customerName: "테스트",
        customerMobilePhone: "01012341234",
      });
    });
  }

  function generateRandomString() {
    return window.btoa(Math.random()).slice(0, 20);
  }
});
