// Calendar DOM Elements
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const viewButtons = document.querySelectorAll('.btn-view');

// Calendar State
let currentDate = new Date();
let currentView = 'month'; // 'month', 'week', or 'day'

// Sample Events (Will be replaced with API calls)
const events = [
    { id: 1, title: 'Team Meeting', start: '2024-03-12T10:00', end: '2024-03-12T11:00', room: 'Conference Room A', status: 'confirmed' },
    { id: 2, title: 'Project Review', start: '2024-03-12T14:30', end: '2024-03-12T15:30', room: 'Meeting Room B', status: 'tentative' },
    { id: 3, title: 'Client Call', start: '2024-03-13T11:00', end: '2024-03-13T12:00', room: 'Board Room', status: 'confirmed' }
];

// Initialize Calendar
function initializeCalendar() {
    // Re-get DOM elements as they might have been recreated
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const viewButtons = document.querySelectorAll('.btn-view');

    if (!calendarGrid || !currentMonthElement || !prevMonthBtn || !nextMonthBtn) {
        console.error('Calendar elements not found');
        return;
    }

    renderCalendar();
    updateMonthDisplay();
    attachEventListeners();
}

function attachEventListeners() {
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const viewButtons = document.querySelectorAll('.btn-view');

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
    }
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => navigateMonth(1));
    }
    
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const view = e.target.textContent.toLowerCase();
            changeView(view);
        });
    });
}

// Calendar Navigation
function navigateMonth(delta) {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    updateMonthDisplay();
    renderCalendar();
}

function updateMonthDisplay() {
    const currentMonthElement = document.getElementById('currentMonth');
    if (currentMonthElement) {
        const options = { year: 'numeric', month: 'long' };
        currentMonthElement.textContent = currentDate.toLocaleDateString(undefined, options);
    }
}

// Calendar Rendering
function renderCalendar() {
    switch(currentView) {
        case 'month':
            renderMonthView();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'day':
            renderDayView();
            break;
    }
}

function renderMonthView() {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let calendarHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        calendarHTML += `<div class="calendar-header-cell">${day}</div>`;
    });

    // Add calendar days
    for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        
        const isToday = isSameDay(currentDay, new Date());
        const isOtherMonth = currentDay.getMonth() !== currentDate.getMonth();
        const dayEvents = getEventsForDay(currentDay);
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}">
                <div class="day-header">
                    <span class="day-number">${currentDay.getDate()}</span>
                    ${dayEvents.length > 0 ? '<span class="event-dot"></span>' : ''}
                </div>
                <div class="event-list">
                    ${renderEventsList(dayEvents)}
                </div>
            </div>
        `;
    }

    calendarGrid.innerHTML = calendarHTML;
    attachEventListeners();
}

function renderWeekView() {
    // Implementation for week view
    console.log('Week view not implemented yet');
}

function renderDayView() {
    // Implementation for day view
    console.log('Day view not implemented yet');
}

// Event Handling
function renderEventsList(events) {
    return events.map(event => `
        <div class="event-item ${event.status}" title="${event.title}">
            <span class="event-time">${formatTime(new Date(event.start))}</span>
            <span class="event-title">${event.title}</span>
        </div>
    `).join('');
}

function getEventsForDay(date) {
    return events.filter(event => isSameDay(new Date(event.start), date));
}

// Utility Functions
function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function formatTime(date) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function changeView(view) {
    currentView = view;
    viewButtons.forEach(button => {
        button.classList.toggle('active', button.textContent.toLowerCase() === view);
    });
    renderCalendar();
}

// Export functions for use in other modules
window.refreshCalendar = renderCalendar;
window.initializeCalendar = initializeCalendar; 