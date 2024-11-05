// Biến toàn cục để lưu token
let globalToken = null;

// Hàm lấy token sau khi đăng nhập
async function getToken(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  try {
    const response = await fetch("http://157.66.27.28:3000/api/login", requestOptions);
    const data = await response.json();

    if (response.ok) {
      // Lưu token vào biến toàn cục
      globalToken = data.token;
      console.log("Token đã lưu:", globalToken);

      // Có thể lưu vào localStorage nếu cần
      localStorage.setItem('auth-token', globalToken);

      return globalToken;
    } else {
      alert(data.message || "Đăng nhập không thành công!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy token:", error);
    return null;
  }
}

// Chuyển đổi giữa form Đăng nhập và Đăng ký
document.getElementById("show-register").addEventListener("click", function () {
  document.getElementById("login-form-box").style.display = "none";
  document.getElementById("register-form-box").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function () {
  document.getElementById("register-form-box").style.display = "none";
  document.getElementById("login-form-box").style.display = "block";
});

// Xử lý sự kiện đăng ký
document.getElementById("register-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = document.getElementById("register-username").value;
  const password = document.getElementById("register-password").value;

  try {
    const response = await fetch("http://157.66.27.28:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    alert(data.message);
    if (response.ok) {
      document.getElementById("show-login").click(); // Chuyển về trang đăng nhập
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
  }
});

// Xử lý sự kiện đăng nhập
document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  try {
    const token = await getToken(username, password);
    if (token) {
      alert("Đăng nhập thành công!");
      document.getElementById("login-form-box").style.display = "none";
      document.getElementById("update-form-box").style.display = "block";
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
  }
});

// Xử lý sự kiện cập nhật thông tin
document.getElementById("update-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const fullname = document.getElementById("fullname").value;
  const className = document.getElementById("class").value;
  const studentId = document.getElementById("studentId").value;

  try {
    const response = await fetch("http://157.66.27.28:3000/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${globalToken}` // Gửi token trong header
      },
      body: JSON.stringify({ fullname, class: className, studentId })
    });
    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Lỗi cập nhật thông tin:", error);
  }
});
