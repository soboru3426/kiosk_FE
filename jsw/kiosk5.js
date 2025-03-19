// 수량 증가/감소 버튼 및 수량 표시 요소 선택
const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');
const quantityElement = document.querySelector('.quantity');

// 감소 버튼 클릭 이벤트
decreaseButton.addEventListener('click', function() {
    let quantity = parseInt(quantityElement.textContent); // 현재 수량 가져오기
    if (quantity > 1) { // 최소 1개 이하로 내려가지 않도록
        quantity -= 1;
        quantityElement.textContent = quantity; // 수량 업데이트
    }
});

// 증가 버튼 클릭 이벤트
increaseButton.addEventListener('click', function() {
    let quantity = parseInt(quantityElement.textContent); // 현재 수량 가져오기
    quantity += 1;
    quantityElement.textContent = quantity; // 수량 업데이트
});

