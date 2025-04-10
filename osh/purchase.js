document.addEventListener("DOMContentLoaded", function() {
    // 로컬 스토리지에서 주문 데이터(cartOrders)를 불러옴 (저장된 데이터가 없으면 빈 배열)
    let storedOrders = localStorage.getItem("cartOrders");
    let cartOrders = [];
    
    if (storedOrders) {
        try {
            cartOrders = JSON.parse(storedOrders);
        } catch (e) {
            console.error("Error parsing cartOrders:", e);
        }
    }

    // 주문 데이터 배열에서 가격 값만 추출
    let selectedMenuPrice = cartOrders.map(order => order.price || order.totalPrice || 0);

    // 선택된 메뉴들의 가격 합산
    let totalMenuPrice = selectedMenuPrice.reduce((sum, price) => sum + price, 0);
    let discountPrice = 0; // 할인이 적용된 금액 (예시로 0으로 설정, 실제로는 별도의 로직이 필요)

    // 가격 출력 부분 (예: 결제하기 버튼 옆에 표시)
    const priceIndicator = document.querySelector("#order-total-price"); // id 변경된 부분
    if (priceIndicator) {
        priceIndicator.textContent = "₩" + Number(totalMenuPrice).toLocaleString('ko-KR');
    }

    // 할인 금액 표시 (예시로 0원)
    const discountIndicator = document.querySelector("#total-discount-price"); // id 변경된 부분
    if (discountIndicator) {
        discountIndicator.textContent = "₩" + Number(discountPrice).toLocaleString('ko-KR');
    }

    // 최종 결제 금액 표시
    const finalAmountIndicator = document.querySelector("#final-total-amount"); // id 변경된 부분
    if (finalAmountIndicator) {
        finalAmountIndicator.textContent = "₩" + Number(totalMenuPrice - discountPrice).toLocaleString('ko-KR');
    }

    // 선택된 메뉴들의 가격을 콘솔에 출력 (디버깅용)
    console.log("Selected menu prices:", selectedMenuPrice);
    console.log("Total menu price:", totalMenuPrice);
});


/*
// 결제 정보를 로컬 스토리지에 저장 (예시)
const totalAmount = 12800;
const discountAmount = 1200;

const paymentData = {
    totalAmount: totalAmount,
    discountAmount: discountAmount,
    finalAmount: totalAmount - discountAmount
};

// 로컬 스토리지에 결제 정보 저장
localStorage.setItem('paymentData', JSON.stringify(paymentData));

document.addEventListener('DOMContentLoaded', function() {
    // 로컬 스토리지에서 결제 정보 가져오기
    const paymentData = JSON.parse(localStorage.getItem('paymentData'));

    // 금액을 3자리마다 쉼표로 구분하는 함수
    function formatAmount(amount) {
        return amount.toLocaleString(); // 숫자를 쉼표로 구분된 문자열로 변환
    }

    if (paymentData) {
        // 결제 금액, 총 금액, 할인 금액을 3자리마다 쉼표를 넣어서 HTML에 동적으로 삽입
        document.getElementById('final-amount').textContent = `₩ ${formatAmount(paymentData.finalAmount)}`;
        document.getElementById('total-price').textContent = `₩ ${formatAmount(paymentData.totalAmount)}`;
        document.getElementById('discount-price').textContent = `₩ ${formatAmount(paymentData.discountAmount)}`;
    } else {
        // 저장된 결제 정보가 없는 경우 (예: 잘못된 경로로 접근한 경우)
        console.error('결제 정보가 없습니다.');
    }
});
*/

/*
// 전 페이지에서 결제 정보를 URL 쿼리로 전달
const paymentData = {
    totalAmount: 12800,
    discountAmount: 0,
    finalAmount: 12800
};

// 쿼리 파라미터로 결제 정보를 전달
const queryString = `?totalAmount=${paymentData.totalAmount}&discountAmount=${paymentData.discountAmount}&finalAmount=${paymentData.finalAmount}`;
window.location.href = `nextpage.html${queryString}`;


document.addEventListener('DOMContentLoaded', function() {
    // URL에서 쿼리 파라미터 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);

    const totalAmount = urlParams.get('totalAmount');
    const discountAmount = urlParams.get('discountAmount');
    const finalAmount = urlParams.get('finalAmount');

    if (totalAmount && discountAmount && finalAmount) {
        // 결제 금액, 총 금액, 할인 금액을 HTML에 동적으로 삽입
        document.getElementById('final-amount').textContent = `₩ ${finalAmount}`;
        document.getElementById('total-price').textContent = `₩ ${totalAmount}`;
        document.getElementById('discount-price').textContent = `₩ ${discountAmount}`;
    } else {
        console.error('잘못된 URL입니다.');
    }
});

*/