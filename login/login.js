const socket = io();

function handleSubmit(event) {
    event.preventDefault(); // Stop form from reloading the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username == "admin" && password == "Password123") { //make sure to change this

        console.log('=== DEBUG: Starting script execution ===');

        fetch('/run-script') // Send request to a server endpoint
            .then(response => {
                console.log('Response status:', response.status);
                return response.text();
            })
            .then(data => {
                console.log('Script output:', data);
                alert('Script executed: ' + data);
                // Redirect after script completes
                window.location.replace("http://localhost:3000/fileshare.htm");
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('Error running script: ' + error.message);
            });
    }
    else {
        alert("Wrong,pls Try again")
    }


}

function Starongithub() {
    window.location.replace("https://github.com/ZayanMuhammed/fileshare");
}
