document.addEventListener('DOMContentLoaded', async () => {
  const USERNAME = 'admin';
  const PASSWORD = '180608';

  const loginForm = document.getElementById('loginForm');
  const loginBox = document.querySelector('.login-box');
  const contentContainer = document.getElementById('content-container');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    // Perform authentication
    if (username === USERNAME && password === PASSWORD) {
      loginForm.reset();
      loginBox.style.display = 'none';
      contentContainer.classList.add('show');
      await fetchDirectories();
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.');
    }
  });

  // Fetch functions and other logic...
});
