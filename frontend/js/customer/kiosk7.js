document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const queueNumber = document.getElementById("queue-number");

  const receiptModal = document.getElementById("receipt-modal");
  const toggleBtn = document.getElementById("toggle-receipt");
  const closeBtn = document.getElementById("close-receipt");

  const orderIdSpan = document.getElementById("receipt-order-id");
  const approvedAtSpan = document.getElementById("receipt-approved-at");
  const providerSpan = document.getElementById("receipt-provider");
  const amountSpan = document.getElementById("receipt-amount");
  const menuList = document.getElementById("receipt-menu-list");

  toggleBtn?.addEventListener("click", () => {
    receiptModal.style.display = "flex";
  });

  closeBtn?.addEventListener("click", () => {
    receiptModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === receiptModal) {
      receiptModal.style.display = "none";
    }
  });

  function formatDateTime(isoDate) {
    const date = new Date(isoDate);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${MM}.${dd} ${hh}:${mm}`;
  }

  async function confirm() {
    const cartOrders = JSON.parse(localStorage.getItem("cartOrders") || "[]");
    const paymentData = JSON.parse(localStorage.getItem("paymentData") || "{}");

    const requestData = {
      paymentKey: urlParams.get("paymentKey"),
      orderId: urlParams.get("orderId"),
      amount: paymentData.finalAmount || Number(urlParams.get("amount")),
      subItems: cartOrders
    };

    try {
      const response = await fetch("http://tomhoon.duckdns.org:8883/api/widget/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      const json = await response.json();
      if (!response.ok) {
        const msg = encodeURIComponent(json.message || "에러 발생");
        const code = encodeURIComponent(json.code || "UNKNOWN");
        window.location.href = `/widget/fail.html?message=${msg}&code=${code}`;
        return;
      }

      if (queueNumber && json.orderId) {
        queueNumber.textContent = json.orderId.replace(/[^0-9]/g, "").slice(-3);
      }

      orderIdSpan.textContent = json.orderId;
      approvedAtSpan.textContent = json.approvedAt ? formatDateTime(json.approvedAt) : "-";
      providerSpan.textContent = json.easyPay?.provider || "-";
      amountSpan.textContent = json.easyPay?.amount?.toLocaleString() || json.totalAmount;

      const discountAmount = Number(paymentData.discountAmount || 0);
      if (discountAmount > 0) {
        const discountTag = document.createElement("p");
        discountTag.textContent = `할인 적용됨: -${discountAmount.toLocaleString()}원`;
        discountTag.style.color = "#F20C93";
        discountTag.style.fontSize = "14px";
        discountTag.style.marginTop = "4px";
        const amountWrapper = amountSpan.closest("p") || amountSpan.parentElement;
        if (amountWrapper) amountWrapper.appendChild(discountTag);
      }

      // ✅ 메뉴 리스트 상세 표시
      menuList.innerHTML = cartOrders.flatMap((item) =>
        item.subItems.map((sub) => {
          const name = item.name || "상품명 없음";
          const unitPrice = sub.unitPrice || 0;
          const flavors = sub.flavors?.join(", ") || "선택된 맛 없음";
          return `<p style="margin: 6px 0;"><strong>${name}</strong> (${unitPrice}원) ${flavors}</p>`;
        })
      ).join("");

      // ✅ 결제 저장 DTO
      const paymentDTO = {
        finalAmount: paymentData.finalAmount || Number(urlParams.get("amount")),
        cartOrders: cartOrders.map(order => ({
          name: order.name,
          totalQuantity: order.totalQuantity || order.subItems.reduce((sum, item) => sum + item.quantity, 0),
          subItems: order.subItems,
          paymentMethod: json.easyPay?.provider || "기타"
        }))
      };

      await fetch("http://tomhoon.duckdns.org:8883/api/customer/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentDTO)
      });

      // ✅ 프린터 전송용 데이터
      const printData = {
        store: "Cteam",
        details: [
          ...cartOrders.flatMap(order => order.subItems.map(sub => {
            const name = order.name;
            const unitPrice = sub.unitPrice || 0;
            const flavors = sub.flavors?.join(", ") || "선택된 맛 없음";
            return `${name}(${unitPrice}원) : ${flavors}`;
          })),
          ...(discountAmount > 0 ? [`할인된 금액: ${discountAmount.toLocaleString()}원`] : [])
        ],
        amount: paymentDTO.finalAmount
      };

      // ✅ 버튼 생성 및 출력 이벤트
      if (!document.getElementById("print-button")) {
        const printButton = document.createElement("button");
        printButton.id = "print-button";
        printButton.textContent = "영수증 출력";
        printButton.style.cssText = `
          margin-top: 8px;
          padding: 6px 12px;
          background: #F20C93;
          color: white;
          border: none;
          border-radius: 4px;
          float: right;
        `;
        printButton.addEventListener("click", async () => {
          try {
            await fetch("http://192.168.0.10:4242/print", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(printData)
            });
            alert("🧾 영수증 출력 요청 완료!");
          } catch (e) {
            console.error("❌ 출력 오류:", e);
            alert("영수증 출력 중 오류 발생!");
          }
        });
        menuList.parentElement.appendChild(printButton);
      }

      localStorage.removeItem("cartOrders");
      localStorage.removeItem("paymentData");

    } catch (error) {
      console.error("❌ 네트워크 오류:", error);
      alert("결제 확인 중 오류가 발생했습니다.");
    }
  }

  confirm();
});

// 👉 아니요 버튼 누르면 처음 화면으로 이동
document.querySelector('.no-btn')?.addEventListener('click', () => {
  window.location.href = '/customer/kioskintro.html';
});
