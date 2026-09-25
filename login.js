const ADMIN_EMAIL = "jadhav.piyush2107@gmail.com";
const ADMIN_PASSWORD = "21@piyush.";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.querySelector(".sign");

loginButton.addEventListener("click", function () {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === "" || password === "") {
    alert("Please enter email and password.");
    return;
  }

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    alert("Login successful!");

    window.location.href = "admin.html";
  } else {
    alert("Invalid email or password.");

    passwordInput.value = "";
    passwordInput.focus();
  }
});
