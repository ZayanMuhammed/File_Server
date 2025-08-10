const { load } = require("firebase-tools/lib/commands");

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
            // Refresh the file list
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

document.addEventListener("DOMContentLoaded", (event) => {
    // Your code to execute after the DOM is fully loaded and parsed goes here
    alert("DOM fully loaded and parsed!");
    loadfiles();
});

function loadfiles() {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const fileListElement = document.getElementById('Mylist');
            files.forEach(file => {
                const listItem = document.createElement('li');

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

                listItem.appendChild(downloadLink);
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

function top() { scrollToTop(); }

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

document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('myBtn');
    if (backToTopButton) backToTopButton.style.display = 'none';
    toggleBackToTopButton();
});
