document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase(); // make lowercase
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const messageDiv = document.getElementById("regMessage");

    if (password !== confirmPassword) {
        messageDiv.textContent = "Passwords do not match!";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check for duplicate email (case-insensitive)
    if (users.some(u => u.email.toLowerCase() === email)) {
        messageDiv.textContent = "Email already registered!";
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Store active user
    localStorage.setItem("username", name);
    localStorage.setItem("userEmail", email);

    // redirect to login page
    window.location.href = "login.html";
});
