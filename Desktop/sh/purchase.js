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