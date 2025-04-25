let widgetId;

function onRecaptchaLoad() {
  widgetId = grecaptcha.render('recaptcha-popup', {
    sitekey: '6LcxWhwrAAAAAOWzawUK53kcycZg8UmdSDetP8oF',
    callback: onRecaptchaSuccess
  });
}

function onRecaptchaSuccess(token) {
  console.log("✅ reCAPTCHA 토큰:", token);
  document.getElementById('recaptchaModal').classList.add('hidden');
  submitLoginWithCaptcha(token);
}

async function submitLoginWithCaptcha(token) {
  const username = document.querySelector('input[name="username"]').value.trim();
  const password = document.querySelector('input[name="password"]').value.trim();

  try {
    const response = await fetch("http://tomhoon.duckdns.org:8883/api/login/recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, token })
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
}

document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('loginBtn');
  const modal = document.getElementById('recaptchaModal');

  loginBtn.addEventListener('click', function () {
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!username || !password) {
      showError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    modal.classList.remove('hidden');
    grecaptcha.reset(widgetId);
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.add('hidden');
      grecaptcha.reset(widgetId);
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
