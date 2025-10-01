const socket = io();

// Hardcoded login handler
function handleSubmit(event) {
    event.preventDefault(); // prevent page reload

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "Password123") {
        socket.emit("auth", 'true');           // notify server
        localStorage.setItem("auth", "true");  // mark as logged in locally
        window.location.href = "/loader.htm"; // redirect to loader
    } else {
        alert("Wrong credentials, please try again.");
    }
}

// Link to GitHub
function Starongithub() {
    window.open("https://github.com/ZayanMuhammed/fileshare", "_blank");
}

// Attach form submit
document.getElementById("loginForm").addEventListener("submit", handleSubmit);