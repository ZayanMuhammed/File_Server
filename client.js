const socket = io();

let localauth = localStorage.getItem("auth");

if (!localauth || localauth === 'false') {
    window.location.replace("/auth-failed.htm");
}

let auth = localauth;
socket.on("auth", (data) => {
    auth = data;
    localStorage.setItem("auth", data); // store updated auth
});


async function uploadFile() {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('uploadedFile', file); // 'uploadedFile' is the field name on the server

    try {
        const response = await fetch('upload', { // Send to your Node.js endpoint
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('File uploaded successfully!');
            loadfiles();
        } else {
            alert('File upload failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error)
        alert('An error occurred during upload.');
    }
}





addEventListener("DOMContentLoaded", function () {

    // Logout button
    const logoutBtn = document.getElementById('logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            window.location.replace("/warning.htm");
        });
    }

    const power = document.getElementById('power');
    power.addEventListener('click', function () {
        alert('shutting down fileserver (not machine)');
        socket.emit("shutdown", true);
        window.location.reload();
    })
    // Your code to execute after the DOM is fully loaded and parsed goes here
    loadfiles();
});

function loadfiles() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const fileListElement = document.getElementById('Mylist');
            // Clear existing list items
            fileListElement.innerHTML = '';

            files.forEach(file => {
                const listItem = document.createElement('li');
                const Button = document.createElement('button');
                const Button1 = document.createElement('button')

                // Create download link
                const downloadLink = document.createElement('a');
                downloadLink.href = `/uploads/${file}`;
                downloadLink.textContent = file;
                downloadLink.download = file; // This forces download instead of opening in browser
                downloadLink.style.textDecoration = 'none';
                downloadLink.style.color = 'inherit';

                // Add some styling to make it look like a download button
                downloadLink.addEventListener('mouseenter', function () {
                    this.style.textDecoration = 'underline';
                });
                downloadLink.addEventListener('mouseleave', function () {
                    this.style.textDecoration = 'none';
                });

                // Style and configure the download button
                Button.textContent = 'Download';
                Button1.textContent = 'Remove';
                Button.className = 'list-item-btn';
                Button1.className = 'list-item-btn';
                Button.setAttribute('data-filename', file);

                // Add download functionality


                Button.addEventListener('click', function () {
                    // Create a temporary link and trigger download
                    const tempLink = document.createElement('a');
                    tempLink.href = `/uploads/${file}`;
                    tempLink.download = file;
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                });

                Button1.addEventListener('click', function () {
                    socket.emit("delete", file);
                    loadfiles();
                });

                listItem.appendChild(downloadLink);
                listItem.appendChild(Button);
                listItem.appendChild(Button1);
                fileListElement.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));

}


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function scrollTopButton() {
    scrollToTop();
}

function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('myBtn');
    if (!backToTopButton) return;
    if (window.pageYOffset > 100) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
}

window.addEventListener('scroll', toggleBackToTopButton, { passive: true });

document.addEventListener('DOMContentLoaded', function () {
    const backToTopButton = document.getElementById('myBtn');
    if (backToTopButton) backToTopButton.style.display = 'none';
    toggleBackToTopButton();
});