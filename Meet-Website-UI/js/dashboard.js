document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Project Review',
                start: '2024-03-20T09:00:00',
                end: '2024-03-20T10:30:00',
                color: '#4f46e5'
            },
            {
                title: 'Team Standup',
                start: '2024-03-20T11:00:00',
                end: '2024-03-20T12:00:00',
                color: '#4f46e5'
            },
            {
                title: 'Client Presentation',
                start: '2024-03-20T14:00:00',
                end: '2024-03-20T15:30:00',
                color: '#4f46e5'
            }
        ],
        eventClick: function(info) {
            // Handle event click
            alert('Meeting: ' + info.event.title);
        },
        dateClick: function(info) {
            // Handle date click
            alert('Would you like to book a meeting on ' + info.dateStr + '?');
        }
    });
    calendar.render();

    // Handle notifications
    const notificationsBtn = document.querySelector('.notifications');
    notificationsBtn.addEventListener('click', function() {
        alert('Notifications panel will be implemented soon!');
    });

    // Handle user profile dropdown
    const userProfile = document.querySelector('.user-profile');
    userProfile.addEventListener('click', function() {
        alert('User profile menu will be implemented soon!');
    });

    // Handle room booking buttons
    const bookButtons = document.querySelectorAll('.room-card button');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!button.disabled) {
                const roomName = e.target.closest('.room-card').querySelector('h4').textContent;
                alert(`Booking form for ${roomName} will open soon!`);
            }
        });
    });

    // Handle search functionality
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', function(e) {
        // Implement search functionality
        console.log('Searching for:', e.target.value);
    });
}); 