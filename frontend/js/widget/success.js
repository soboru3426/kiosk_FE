document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);

    // DOM 요소에 결제 기본 정보 출력
    const paymentKeyElement = document.getElementById("paymentKey");
    const orderIdElement = document.getElementById("orderId");
    const amountElement = document.getElementById("amount");

    const paymentKey = urlParams.get("paymentKey");
    const orderId = urlParams.get("orderId");
    const amount = urlParams.get("amount");

    paymentKeyElement.textContent = paymentKey;
    orderIdElement.textContent = orderId;
    amountElement.textContent = amount + "원";

    // 결제 승인 및 서버로 전송
    async function confirm() {
      // ✅ 로컬 스토리지에서 주문 정보 불러오기
      const cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");

      const requestData = {
        paymentKey,
        orderId,
        amount,
        subItems: cartOrders // ✅ 주문한 맛 JSON 같이 전송
      };

      try {
        const response = await fetch("http://tomhoon.duckdns.org:8883/api/widget/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestData)
        });

        const json = await response.json();

        if (!response.ok) {
          console.error("❌ 결제 실패:", json);
          window.location.href = `/widget/fail.html?message=${json.message}&code=${json.code}`;
          return;
        }

        // ✅ 서버 응답 전체 표시 (확인용)
        document.getElementById("response").innerHTML = `<pre>${JSON.stringify(json, null, 4)}</pre>`;

      } catch (error) {
        console.error("❌ 네트워크 오류:", error);
        alert("결제 승인 처리 중 문제가 발생했습니다.");
      }
    }

    confirm();
  });