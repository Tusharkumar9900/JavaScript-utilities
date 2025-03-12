// Modal DOM Elements
const modal = document.getElementById('bookingModal');
const closeModalBtn = document.querySelector('.close-modal');
const bookingForm = document.getElementById('bookingForm');
const cancelBookingBtn = document.getElementById('cancelBooking');
const confirmBookingBtn = document.getElementById('confirmBooking');
const chipsInput = document.querySelector('.chips-input');
const roomSelect = document.getElementById('roomSelect');

// Initialize Modal
document.addEventListener('DOMContentLoaded', () => {
    initializeModal();
    populateRoomSelect();
    initializeChipsInput();
});

function initializeModal() {
    // Close modal events
    closeModalBtn.addEventListener('click', closeModal);
    cancelBookingBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form submission
    confirmBookingBtn.addEventListener('click', handleBookingSubmit);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Room Select Population
function populateRoomSelect() {
    const rooms = [
        { id: 1, name: 'Conference Room A' },
        { id: 2, name: 'Meeting Room B' },
        { id: 3, name: 'Board Room' },
        { id: 4, name: 'Huddle Space' }
    ];

    roomSelect.innerHTML = `
        <option value="">Select a room</option>
        ${rooms.map(room => `
            <option value="${room.id}">${room.name}</option>
        `).join('')}
    `;
}

// Chips Input for Participants
function initializeChipsInput() {
    const input = chipsInput.querySelector('input');
    const chips = new Set();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            e.preventDefault();
            addChip(input.value.trim());
            input.value = '';
        }
    });

    function addChip(email) {
        if (validateEmail(email) && !chips.has(email)) {
            chips.add(email);
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.innerHTML = `
                ${email}
                <button type="button" onclick="removeChip(this)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            chipsInput.insertBefore(chip, input);
        }
    }

    window.removeChip = function(button) {
        const chip = button.parentElement;
        const email = chip.textContent.trim();
        chips.delete(email);
        chip.remove();
    };
}

// Form Handling
function handleBookingSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(bookingForm);
    const bookingData = {
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
        room: formData.get('room'),
        participants: Array.from(document.querySelectorAll('.chip')).map(chip => 
            chip.textContent.trim()
        ),
        description: formData.get('description')
    };

    // Validate form data
    if (validateBookingData(bookingData)) {
        // Submit booking (will be replaced with API call)
        console.log('Booking submitted:', bookingData);
        closeModal();
        // Refresh calendar
        if (window.refreshCalendar) {
            window.refreshCalendar();
        }
    }
}

// Validation
function validateBookingData(data) {
    if (!data.title) {
        showError('Please enter a meeting title');
        return false;
    }
    if (!data.date) {
        showError('Please select a date');
        return false;
    }
    if (!data.time) {
        showError('Please select a time');
        return false;
    }
    if (!data.room) {
        showError('Please select a room');
        return false;
    }
    return true;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Modal Controls
function closeModal() {
    modal.classList.remove('active');
    resetForm();
}

function resetForm() {
    bookingForm.reset();
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => chip.remove());
}

function showError(message) {
    // Implementation for showing error messages
    alert(message); // Replace with better UI feedback
}

// Export functions for use in other modules
window.showBookingModal = function(roomName) {
    modal.classList.add('active');
    if (roomName) {
        Array.from(roomSelect.options).forEach(option => {
            if (option.textContent === roomName) {
                option.selected = true;
            }
        });
    }
}; 