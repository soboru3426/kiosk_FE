// 로그인 처리 함수
function validateLogin(event) {
    event.preventDefault(); // 폼이 제출되는 것을 막습니다.

    // 입력된 아이디와 비밀번호
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // admin/admin1234로 로그인할 때만 성공, 그 외에는 오류 메시지
    if (username === 'admin' && password === 'admin1234') {
        alert('로그인 성공!');
        // 성공 시 다른 페이지로 이동
        window.location.href = '/pay.html';



    } else {
        alert('회원정보가 없습니다.');
    }
}
