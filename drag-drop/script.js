document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.querySelector('.upload-area');
    const fileList = document.querySelector('.file-list');
    const fileInput = document.querySelector('input[type="file"]');
    const stats = document.querySelector('.stats');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);

    // Prevent default drag behaviors
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone
    function highlight(e) {
        uploadArea.classList.add('drag-over');
    }

    // Unhighlight drop zone
    function unhighlight(e) {
        uploadArea.classList.remove('drag-over');
    }

    // Handle dropped files
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files: files } });
    }

    // Handle files
    function handleFiles(e) {
        const files = [...e.target.files];
        files.forEach(file => {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
            simulateUpload(fileItem);
            updateStats();
        });
    }

    // Create file item element
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas ${getFileIcon(file.type)}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
            <button class="delete-btn" onclick="removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        return fileItem;
    }

    // Get file icon based on type
    function getFileIcon(type) {
        if (type.startsWith('image/')) return 'fa-image';
        if (type.startsWith('video/')) return 'fa-video';
        if (type.startsWith('audio/')) return 'fa-music';
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word')) return 'fa-file-word';
        if (type.includes('excel')) return 'fa-file-excel';
        return 'fa-file';
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Simulate file upload
    function simulateUpload(fileItem) {
        const progress = fileItem.querySelector('.progress');
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                fileItem.classList.add('uploaded');
            } else {
                width += Math.random() * 10;
            }
            progress.style.width = width + '%';
        }, 200);
    }

    // Update statistics
    function updateStats() {
        const files = fileList.querySelectorAll('.file-item');
        const totalFiles = files.length;
        const totalSize = Array.from(files).reduce((acc, file) => {
            const size = file.querySelector('.file-size').textContent;
            return acc + parseFloat(size);
        }, 0);

        stats.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-file"></i>
                <span>${totalFiles} Files</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-hdd"></i>
                <span>${formatFileSize(totalSize * 1024)} Total</span>
            </div>
        `;
    }

    // Make removeFile function globally available
    window.removeFile = function(button) {
        const fileItem = button.closest('.file-item');
        fileItem.remove();
        updateStats();
    };
}); 