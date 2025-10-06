const socket = io();

// Generate random string for recovery
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

document.addEventListener('DOMContentLoaded', function () {
    // Default recovery flag
    if (localStorage.getItem("recovery-auth") === null) {
        localStorage.setItem("recovery-auth", "false");
    }

    console.log("recovery-auth:", localStorage.getItem("recovery-auth"));

    const forgot = document.getElementById('Forget');
    const notification = document.getElementById('notification');
    const dismiss = document.getElementById('Dismiss');
    const form = document.getElementById('login-form');

    // Handle Forgot password
    forgot.addEventListener('click', function () {
        notification.style.display = "flex";
        const random = generateRandomString(25);
        socket.emit("forget", random);
        globalThis.randomvar = random; // store globally
    });

    dismiss.addEventListener('click', function () {
        notification.style.display = "none";
    });

    // Handle login form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const savedUser = localStorage.getItem("username");
        const savedPass = localStorage.getItem("password");

        if (username === savedUser && password === savedPass) {
            socket.emit("auth", 'true');
            localStorage.setItem("auth", 'true');
            window.location.href = "/loader.htm";
        }
        else if (username === "recoveryadmin" && password === globalThis.randomvar) {
            console.log("Recovery login successful");
            socket.emit("recovery-auth", 'true');
            localStorage.setItem("recovery-auth", 'true');
            window.location.replace("/login/showPassword.htm");
        }
        else {
            alert("Username or password is incorrect!");
            console.log("Invalid credentials");
        }
    });
});

// GitHub link
function Starongithub() {
    window.open("https://github.com/ZayanMuhammed/fileshare", "_blank");
}
