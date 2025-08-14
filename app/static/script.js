document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const previewArea = document.getElementById('preview-area');
    const imagePreview = document.getElementById('image-preview');
    const resultArea = document.getElementById('result-area');
    const resultText = document.getElementById('result-text');
    const resetButton = document.getElementById('reset-button');
    const fileNameDisplay = document.getElementById('file-name-display');

    // Handle file selection
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '#ecf0f1';
    });

    uploadArea.addEventListener('dragleave', (event) => {
        event.preventDefault();
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = 'transparent';
    });

    uploadArea.addEventListener('drop', (event) => {
        event.preventDefault();
        uploadArea.style.borderColor = '#bdc3c7';
        uploadArea.style.backgroundColor = 'transparent';
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        } else {
            showError("Please drop an image file.");
        }
    });

    resetButton.addEventListener('click', resetUI);

    function handleFile(file) {
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            previewArea.style.display = 'block';
            fileNameDisplay.textContent = `File: ${file.name}`;
            uploadArea.style.display = 'none'; // Hide upload area
        };
        reader.readAsDataURL(file);

        // Show loading state
        showLoading();
        
        // Prepare data for API request
        const formData = new FormData();
        formData.append('request_img', file);
        // Perform the POST request to the backend
        fetch('/api', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                // Try to parse a JSON error response from the server
                return response.json().then(err => {
                    throw new Error(err.error || `Server responded with status ${response.status}`);
                }).catch(() => {
                    // Fallback if the error response is not JSON
                    throw new Error(`Server responded with status ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.prediction) {
                showSuccess(`Identified Cartoon: <strong>${data.prediction}</strong>`);
            } else if (data.error) {
                showError(data.error);
            } else {
                showError("Could not identify the cartoon. Invalid response from server.");
            }
        })
        .catch(error => {
            console.error('Error during analysis:', error);
            showError(error.message || 'An unknown error occurred.');
        })
        .finally(() => {
            // Show the reset button regardless of success or failure
            resetButton.style.display = 'inline-block';
        });
    }

    function showLoading() {
        resultArea.classList.remove('success', 'error');
        resultArea.classList.add('loading');
        resultText.innerHTML = '<div class="loader"></div>';
    }
    
    function showSuccess(message) {
        resultArea.classList.remove('loading', 'error');
        resultArea.classList.add('success');
        resultText.innerHTML = message;
    }

    function showError(message) {
        resultArea.classList.remove('loading', 'success');
        resultArea.classList.add('error');
        resultText.innerHTML = message;
    }

    function resetUI() {
        // Reset file input
        imageUpload.value = '';

        // Hide preview and show upload area
        previewArea.style.display = 'none';
        imagePreview.src = '#';
        fileNameDisplay.textContent = '';
        uploadArea.style.display = 'block';

        // Reset result area
        resultArea.classList.remove('success', 'error', 'loading');
        resultText.innerHTML = 'The result will appear here.';
        
        // Hide reset button
        resetButton.style.display = 'none';
    }
});