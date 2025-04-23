document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');

  loginBtn.addEventListener('click', async function () {
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!username || !password) {
      showError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch("http://tomhoon.duckdns.org:8883/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const result = await response.json();
        const role = result.role;

        if (role === "admin") {
          window.location.href = "/admin/stock.html";
        } else {
          window.location.href = "/branch/stock.html";
        }
      } else {
        const errorText = await response.text();
        showError(errorText || '아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error("❌ 서버 오류:", error);
      showError('서버와의 통신에 실패했습니다.');
    }
  });
});

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}
