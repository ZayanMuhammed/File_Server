const socket = io();

// Check local auth first
let auth = localStorage.getItem("auth") === 'true';

if (auth) {
    window.location.replace("/fileshare.htm");
}

document.addEventListener('DOMContentLoaded', function () {
    // Socket auth listener
    socket.on("auth", (data) => {
        auth = data === 'true';
        localStorage.setItem("auth", data);

        if (auth) {
            window.location.replace("/fileshare.htm");
        }
    });

    // Buttons
    const link = document.getElementById('link');
    const reload_btn = document.getElementById('reload');

    if (reload_btn) {
        reload_btn.addEventListener('click', () => window.location.replace('/loader.htm'));
    }

    if (link) {
        link.addEventListener('click', () => {
            alert("Go to web: http://localhost:3000/login/login.htm");
        });
    }
});
