// DOM Elements
const quickBookBtn = document.getElementById('quickBookBtn');
const searchInput = document.querySelector('.search-bar input');
const notificationsBtn = document.querySelector('.notifications');
const roomCardsContainer = document.getElementById('roomCards');
const meetingsListContainer = document.getElementById('meetingsList');
const navLinks = document.querySelectorAll('.nav-links a');
const mobileMenuBtn = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');

// Sample Data (Will be replaced with API calls)
const rooms = [
    { id: 1, name: 'Conference Room A', capacity: 20, facilities: ['Projector', 'Whiteboard'], status: 'available' },
    { id: 2, name: 'Meeting Room B', capacity: 8, facilities: ['TV Screen', 'Video Conference'], status: 'busy' },
    { id: 3, name: 'Board Room', capacity: 12, facilities: ['Projector', 'Video Conference'], status: 'available' },
    { id: 4, name: 'Huddle Space', capacity: 4, facilities: ['Whiteboard'], status: 'maintenance' }
];

const upcomingMeetings = [
    { id: 1, title: 'Project Review', room: 'Conference Room A', time: '10:00 AM', date: '2024-03-12' },
    { id: 2, title: 'Team Standup', room: 'Meeting Room B', time: '2:30 PM', date: '2024-03-12' },
    { id: 3, title: 'Client Meeting', room: 'Board Room', time: '11:00 AM', date: '2024-03-13' }
];

// Sample data for teams
const teams = [
    { id: 1, name: 'Development Team', lead: 'Tushar Kumar', members: 8, description: 'Main development team' },
    { id: 2, name: 'Design Team', lead: 'Sahil Bansal', members: 5, description: 'UI/UX design team' },
    { id: 3, name: 'Marketing Team', lead: 'Shubham', members: 6, description: 'Marketing and communications' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting initialization');
    
    // Get the current page name from URL or default to dashboard
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().replace('.html', '') || 'dashboard';
    console.log('Current page:', pageName);
    
    // Initialize core components
    try {
        console.log('Initializing core components...');
        initializeNavigation();
        initializeEventListeners();
        initializeMobileMenu();
        
        // Initialize page-specific content with a slight delay to ensure DOM is ready
        setTimeout(() => {
            if (pageName === 'dashboard' || pageName === '') {
                console.log('Loading dashboard page...');
                initializeDashboard();
            } else if (pageName === 'schedule') {
                console.log('Loading schedule page...');
                initializeSchedule();
            } else if (pageName === 'rooms') {
                console.log('Loading rooms page...');
                initializeRooms();
            } else if (pageName === 'teams') {
                console.log('Loading teams page...');
                initializeTeams();
            } else if (pageName === 'analytics') {
                console.log('Loading analytics page...');
                initializeAnalytics();
            }
        }, 100);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Quick Book Button
    const quickBookBtn = document.getElementById('quickBookBtn');
    if (quickBookBtn) {
        quickBookBtn.addEventListener('click', () => {
            console.log('Quick book button clicked');
            showBookingModal();
        });
    }

    // Search Input
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Notifications Button
    const notificationsBtn = document.querySelector('.notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', toggleNotifications);
    }
}

// Navigation Handling
function initializeNavigation() {
    console.log('Initializing navigation');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Navigation link clicked:', link.href);
            
            // Remove active class from all li elements
            document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
            
            // Add active class to parent li of clicked link
            link.closest('li').classList.add('active');
            
            // Get the page name from href
            const href = link.getAttribute('href');
            const page = href.replace('.html', '');
            
            try {
                await loadPageContent(page);
            } catch (error) {
                console.error('Error loading page:', error);
            }
        });
    });
}

async function loadPageContent(page) {
    console.log('Loading page content for:', page);
    try {
        const response = await fetch(`../pages/${page}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // Create a temporary container
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Get the main content
        const newContent = temp.querySelector('.main-content');
        if (!newContent) {
            throw new Error('Main content not found in loaded page');
        }
        
        // Replace the main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = newContent.innerHTML;
            
            // Reinitialize components based on the page
            if (page === 'dashboard') {
                console.log('Reinitializing dashboard');
                initializeDashboard();
            } else if (page === 'schedule') {
                console.log('Reinitializing schedule');
                initializeSchedule();
            } else if (page === 'rooms') {
                console.log('Reinitializing rooms');
                initializeRooms();
            } else if (page === 'teams') {
                console.log('Reinitializing teams');
                initializeTeams();
            } else if (page === 'analytics') {
                console.log('Reinitializing analytics');
                initializeAnalytics();
            }
            
            // Reinitialize common event listeners
            initializeEventListeners();
        } else {
            throw new Error('Main content container not found in current page');
        }
    } catch (error) {
        console.error('Error loading page:', error);
        alert('Error loading page. Please try again.');
    }
}

function initializeDashboard() {
    console.log('Starting dashboard initialization...');
    
    try {
        // Ensure containers exist before rendering
        const roomCardsContainer = document.getElementById('roomCards');
        const meetingsListContainer = document.getElementById('meetingsList');
        const calendarContainer = document.getElementById('calendar');
        
        if (!roomCardsContainer) {
            console.error('Room cards container not found');
            return;
        }
        
        // First render the static components
        console.log('Rendering room cards...');
        renderRoomCards();
        
        if (meetingsListContainer) {
            console.log('Rendering upcoming meetings...');
            renderUpcomingMeetings();
        }
        
        // Then initialize the calendar if it exists
        if (calendarContainer) {
            console.log('Initializing calendar component...');
            initializeCalendar();
        }
        
        // Add event listeners to room cards
        const bookButtons = document.querySelectorAll('.room-card .btn-primary');
        bookButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!button.disabled) {
                    const roomName = e.target.closest('.room-card').querySelector('h4').textContent;
                    showBookingModal(roomName);
                }
            });
        });
        
        console.log('Dashboard initialization completed');
    } catch (error) {
        console.error('Error in dashboard initialization:', error);
        // Try to recover by reinitializing components after a delay
        setTimeout(() => {
            console.log('Attempting to recover dashboard components...');
            if (!document.querySelector('.room-cards')) renderRoomCards();
            if (!document.querySelector('.meetings-list')) renderUpcomingMeetings();
            if (!document.querySelector('.fc')) initializeCalendar();
        }, 500);
    }
}

function initializeSchedule() {
    console.log('Initializing schedule page');
    try {
        initializeCalendar();
        console.log('Schedule page initialized successfully');
    } catch (error) {
        console.error('Error initializing schedule:', error);
    }
}

function initializeRooms() {
    console.log('Initializing rooms page');
    try {
        // Sample room data (using the existing rooms array from the top of the file)
        const container = document.getElementById('roomsContainer');
        if (!container) {
            console.error('Rooms container not found, trying roomCards container');
            const roomCardsContainer = document.getElementById('roomCards');
            if (roomCardsContainer) {
                renderRoomCards();
                return;
            }
            throw new Error('No valid container found for rooms');
        }

        // Initialize room display
        displayRooms(rooms);
        
        // Initialize filters if they exist
        const capacityFilter = document.getElementById('capacityFilter');
        const facilityFilter = document.getElementById('facilityFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (capacityFilter && facilityFilter && statusFilter) {
            initializeFilters(rooms);
        }

        // Initialize view toggle if it exists
        const viewToggle = document.querySelector('.view-toggle');
        if (viewToggle) {
            initializeViewToggle();
        }

        // Initialize modal if it exists
        const roomModal = document.getElementById('roomModal');
        if (roomModal) {
            initializeModal();
        }

        console.log('Rooms page initialized successfully');
    } catch (error) {
        console.error('Error initializing rooms:', error);
        // Try to recover by attempting to render basic room cards
        const roomCardsContainer = document.getElementById('roomCards');
        if (roomCardsContainer) {
            console.log('Attempting to recover by rendering basic room cards');
            renderRoomCards();
        }
    }
}

function displayRooms(rooms) {
    const container = document.getElementById('roomsContainer') || document.getElementById('roomCards');
    if (!container) {
        console.error('No container found for displaying rooms');
        return;
    }

    container.innerHTML = rooms.map(room => `
        <div class="room-card ${room.status}">
            <div class="room-header">
                <h3 class="room-name">${room.name}</h3>
                <span class="status-badge">${room.status}</span>
            </div>
            <div class="room-info">
                <div class="room-capacity">
                    <i class="fas fa-users"></i>
                    <span>${room.capacity} People</span>
                </div>
                <p>${room.description || ''}</p>
                <div class="facilities-list">
                    ${room.facilities.map(facility => `
                        <span class="facility-tag">
                            <i class="fas fa-${getFacilityIcon(facility)}"></i>
                            ${facility}
                        </span>
                    `).join('')}
                </div>
            </div>
            <button class="btn-primary" ${room.status !== 'available' ? 'disabled' : ''}>
                <i class="fas fa-calendar-plus"></i> Quick Book
            </button>
        </div>
    `).join('');
}

function initializeCalendar() {
    console.log('Initializing calendar...');
    
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) {
            console.error('Calendar element not found');
            return;
        }

        try {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                },
                height: '100%',
                contentHeight: 'auto',
                handleWindowResize: true,
                expandRows: true,
                firstDay: 1,
                displayEventTime: true,
                nowIndicator: true,
                dayMaxEvents: true,
                events: generateSampleEvents(new Date()),
                datesSet: function(info) {
                    console.log('Calendar dates changed:', info.start, info.end);
                    calendar.removeAllEvents();
                    calendar.addEventSource(generateSampleEvents(info.start));
                },
                eventDidMount: function(info) {
                    info.el.title = `${info.event.title}\n${info.event.start.toLocaleTimeString()} - ${info.event.end.toLocaleTimeString()}`;
                }
            });

            calendar.render();
            console.log('Calendar rendered successfully');

        } catch (error) {
            console.error('Error initializing calendar:', error);
        }
    }, 0);
}

function generateSampleEvents(targetDate = new Date()) {
    console.log('Generating events for date:', targetDate);
    const date = new Date(targetDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const events = [];
    
    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    console.log('Generating events for month:', {
        year: year,
        month: month + 1,
        firstDay: firstDay.toISOString(),
        lastDay: lastDay.toISOString()
    });
    
    // Add recurring team meetings every Monday and Wednesday
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        
        // Monday team standups
        if (currentDate.getDay() === 1) {
            events.push({
                title: 'Team Standup',
                start: new Date(year, month, day, 10, 0),
                end: new Date(year, month, day, 11, 0),
                color: '#4f46e5',
                allDay: false
            });
        }
        
        // Wednesday project reviews
        if (currentDate.getDay() === 3) {
            events.push({
                title: 'Project Review',
                start: new Date(year, month, day, 14, 0),
                end: new Date(year, month, day, 15, 30),
                color: '#4f46e5',
                allDay: false
            });
        }
    }
    
    // Add some specific meetings for the current month
    const midMonth = Math.ceil(lastDay.getDate() / 2);
    
    events.push(
        {
            title: 'Client Meeting',
            start: new Date(year, month, midMonth, 11, 0),
            end: new Date(year, month, midMonth, 12, 30),
            color: '#4f46e5',
            allDay: false
        },
        {
            title: 'Sprint Planning',
            start: new Date(year, month, midMonth + 5, 9, 0),
            end: new Date(year, month, midMonth + 5, 11, 0),
            color: '#4f46e5',
            allDay: false
        },
        {
            title: 'Product Demo',
            start: new Date(year, month, midMonth + 10, 15, 0),
            end: new Date(year, month, midMonth + 10, 16, 30),
            color: '#4f46e5',
            allDay: false
        }
    );
    
    console.log(`Generated ${events.length} events`);
    return events;
}

// Room Cards Rendering
function renderRoomCards() {
    const roomCardsContainer = document.getElementById('roomCards');
    if (!roomCardsContainer) {
        console.error('Room cards container not found');
        return;
    }
    
    console.log('Rendering room cards...');
    roomCardsContainer.innerHTML = rooms.map(room => `
        <div class="room-card ${room.status}">
            <div class="room-header">
                <h4>${room.name}</h4>
                <span class="status-badge">${room.status}</span>
            </div>
            <div class="room-details">
                <p><i class="fas fa-users"></i> Capacity: ${room.capacity}</p>
                <div class="facilities-list">
                    ${room.facilities.map(facility => `<span>${facility}</span>`).join('')}
                </div>
            </div>
            <button class="btn-primary" ${room.status !== 'available' ? 'disabled' : ''}>
                <i class="fas fa-calendar-plus"></i> Quick Book
            </button>
        </div>
    `).join('');
    
    console.log('Room cards rendered successfully');
}

// Upcoming Meetings Rendering
function renderUpcomingMeetings() {
    const meetingsListContainer = document.getElementById('meetingsList');
    if (!meetingsListContainer) {
        console.error('Meetings list container not found');
        return;
    }
    
    console.log('Rendering upcoming meetings...');
    meetingsListContainer.innerHTML = upcomingMeetings.map(meeting => `
        <div class="meeting-item">
            <div class="meeting-time">
                <i class="fas fa-clock"></i>
                <span>${meeting.time}</span>
            </div>
            <div class="meeting-info">
                <h4>${meeting.title}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${meeting.room}</p>
            </div>
        </div>
    `).join('');
    
    console.log('Upcoming meetings rendered successfully');
}

// Search Functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRooms = rooms.filter(room => 
        room.name.toLowerCase().includes(searchTerm) ||
        room.facilities.some(facility => facility.toLowerCase().includes(searchTerm))
    );
    renderFilteredRooms(filteredRooms);
}

function renderFilteredRooms(filteredRooms) {
    const roomCardsContainer = document.getElementById('roomCards');
    if (!roomCardsContainer) return;
    
    roomCardsContainer.innerHTML = filteredRooms.map(room => `
        <div class="room-card ${room.status}">
            <div class="room-header">
                <h4>${room.name}</h4>
                <span class="status-badge">${room.status}</span>
            </div>
            <div class="room-details">
                <p><i class="fas fa-users"></i> Capacity: ${room.capacity}</p>
                <div class="facilities-list">
                    ${room.facilities.map(facility => `<span>${facility}</span>`).join('')}
                </div>
            </div>
            <button class="btn-primary" ${room.status !== 'available' ? 'disabled' : ''}>
                <i class="fas fa-calendar-plus"></i> Quick Book
            </button>
        </div>
    `).join('');
}

// Notifications Toggle
function toggleNotifications() {
    console.log('Notifications toggled');
}

// Export functions for use in other modules
window.showBookingModal = function(roomName) {
    const modal = document.getElementById('bookingModal');
    const roomSelect = document.getElementById('roomSelect');
    if (modal) modal.classList.add('active');
    if (roomSelect && roomName) {
        Array.from(roomSelect.options).forEach(option => {
            if (option.textContent === roomName) {
                option.selected = true;
            }
        });
    }
};

function renderAllRooms() {
    console.log('Rendering all rooms');
    const roomCardsContainer = document.getElementById('roomCards');
    if (!roomCardsContainer) {
        console.error('Room cards container not found');
        return;
    }
    renderRoomCards();
}

// Room Management
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.rooms-content')) {
        initializeRooms();
    }
});

function initializeRooms() {
    // Sample room data
    const rooms = [
        {
            id: 1,
            name: 'Conference Room A',
            capacity: 10,
            status: 'available',
            facilities: ['projector', 'whiteboard', 'videoconf'],
            description: 'Main conference room with full video conferencing setup'
        },
        {
            id: 2,
            name: 'Meeting Room B',
            capacity: 6,
            status: 'busy',
            facilities: ['whiteboard', 'tv'],
            description: 'Medium-sized meeting room for team discussions'
        },
        {
            id: 3,
            name: 'Brainstorm Room',
            capacity: 4,
            status: 'maintenance',
            facilities: ['whiteboard'],
            description: 'Small room ideal for brainstorming sessions'
        }
    ];

    // Initialize room display
    displayRooms(rooms);
    initializeFilters(rooms);
    initializeViewToggle();
    initializeModal();
}

function createRoomCard(room) {
    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
        <div class="room-header">
            <h3 class="room-name">${room.name}</h3>
            <span class="room-status ${room.status}">${room.status}</span>
        </div>
        <div class="room-info">
            <div class="room-capacity">
                <i class="fas fa-users"></i>
                <span>${room.capacity} People</span>
            </div>
            <p>${room.description}</p>
            <div class="room-facilities">
                ${room.facilities.map(facility => `
                    <span class="facility-tag">
                        <i class="fas fa-${getFacilityIcon(facility)}"></i>
                        ${facility}
                    </span>
                `).join('')}
            </div>
        </div>
    `;
    return card;
}

function getFacilityIcon(facility) {
    const icons = {
        projector: 'projector',
        whiteboard: 'chalkboard',
        videoconf: 'video',
        tv: 'tv'
    };
    return icons[facility] || 'cube';
}

function initializeFilters(rooms) {
    const capacityFilter = document.getElementById('capacityFilter');
    const facilityFilter = document.getElementById('facilityFilter');
    const statusFilter = document.getElementById('statusFilter');

    [capacityFilter, facilityFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', () => {
            const filteredRooms = filterRooms(rooms, {
                capacity: capacityFilter.value,
                facility: facilityFilter.value,
                status: statusFilter.value
            });
            displayRooms(filteredRooms);
        });
    });
}

function filterRooms(rooms, filters) {
    return rooms.filter(room => {
        const capacityMatch = !filters.capacity || filterByCapacity(room.capacity, filters.capacity);
        const facilityMatch = !filters.facility || room.facilities.includes(filters.facility);
        const statusMatch = !filters.status || room.status === filters.status;
        return capacityMatch && facilityMatch && statusMatch;
    });
}

function filterByCapacity(roomCapacity, filter) {
    const ranges = {
        '1-4': [1, 4],
        '5-8': [5, 8],
        '9-12': [9, 12],
        '13+': [13, Infinity]
    };
    const [min, max] = ranges[filter] || [0, Infinity];
    return roomCapacity >= min && roomCapacity <= max;
}

function initializeViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle button');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const view = button.dataset.view;
            const container = document.getElementById('roomsContainer');
            container.className = view === 'grid' ? 'rooms-grid' : 'rooms-list';
        });
    });
}

function initializeModal() {
    const modal = document.getElementById('roomModal');
    const addRoomBtn = document.getElementById('addRoomBtn');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelRoom');
    const form = document.getElementById('roomForm');

    addRoomBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            form.reset();
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        // Here you would typically send the data to your backend
        console.log('New room data:', Object.fromEntries(formData));
        modal.classList.remove('active');
        form.reset();
    });
}

// Mobile Menu Handling
function initializeMobileMenu() {
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-active') &&
                !sidebar.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                toggleMobileMenu();
            }
        });

        // Close mobile menu when window is resized to desktop view
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && sidebar.classList.contains('mobile-active')) {
                sidebar.classList.remove('mobile-active');
            }
        });
    }
}

function toggleMobileMenu() {
    if (sidebar) {
        sidebar.classList.toggle('mobile-active');
        mobileMenuBtn.innerHTML = sidebar.classList.contains('mobile-active') ?
            '<i class="fas fa-times"></i>' :
            '<i class="fas fa-bars"></i>';
    }
}

// Teams Management
function initializeTeams() {
    console.log('Initializing teams page');
    try {
        renderTeams();
        initializeTeamModal();
        console.log('Teams page initialized successfully');
    } catch (error) {
        console.error('Error initializing teams:', error);
    }
}

function renderTeams() {
    const teamsContainer = document.getElementById('teamsContainer');
    if (!teamsContainer) {
        console.error('Teams container not found');
        return;
    }
    
    teamsContainer.innerHTML = teams.map(team => `
        <div class="team-card">
            <div class="team-header">
                <h3>${team.name}</h3>
                <span class="member-count">${team.members} members</span>
            </div>
            <div class="team-info">
                <p><i class="fas fa-user-tie"></i> Lead: ${team.lead}</p>
                <p>${team.description}</p>
            </div>
            <div class="team-actions">
                <button class="btn-secondary">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-secondary">
                    <i class="fas fa-users"></i> Manage Members
                </button>
            </div>
        </div>
    `).join('');
}

function initializeTeamModal() {
    const createTeamBtn = document.getElementById('createTeamBtn');
    const teamModal = document.getElementById('teamModal');
    const closeModal = teamModal?.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelTeam');
    const teamForm = document.getElementById('teamForm');

    if (createTeamBtn && teamModal) {
        createTeamBtn.addEventListener('click', () => {
            teamModal.classList.add('active');
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                teamModal.classList.remove('active');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                teamModal.classList.remove('active');
                teamForm?.reset();
            });
        }

        if (teamForm) {
            teamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Here you would typically send the data to your backend
                const formData = new FormData(teamForm);
                console.log('New team data:', Object.fromEntries(formData));
                teamModal.classList.remove('active');
                teamForm.reset();
            });
        }
    }
}

// Analytics Dashboard
function initializeAnalytics() {
    console.log('Initializing analytics page');
    try {
        initializeCharts();
        initializeTimeRangeFilter();
        console.log('Analytics page initialized successfully');
    } catch (error) {
        console.error('Error initializing analytics:', error);
    }
}

function initializeCharts() {
    const usageChart = document.getElementById('usageChart');
    const timeChart = document.getElementById('timeChart');

    if (usageChart) {
        new Chart(usageChart, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Room Usage',
                    data: [65, 72, 86, 81, 74, 40, 35],
                    borderColor: '#4f46e5',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (timeChart) {
        new Chart(timeChart, {
            type: 'bar',
            data: {
                labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
                datasets: [{
                    label: 'Meeting Frequency',
                    data: [4, 6, 8, 7, 5, 9, 7, 5, 3],
                    backgroundColor: '#4f46e5'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function initializeTimeRangeFilter() {
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', (e) => {
            console.log('Time range changed:', e.target.value);
            // Here you would typically update the charts with new data
            // based on the selected time range
        });
    }
} 