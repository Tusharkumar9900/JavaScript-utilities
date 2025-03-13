document.addEventListener('DOMContentLoaded', function() {
    const progressBar = document.getElementById('scrollProgressBar');
    
    // Create percentage display
    const percentageDisplay = document.createElement('div');
    percentageDisplay.className = 'scroll-percentage';
    percentageDisplay.innerHTML = '<i class="fas fa-chart-line"></i> <span>0%</span>';
    document.body.appendChild(percentageDisplay);

    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    // Create reading time estimate
    const readingTime = document.createElement('div');
    readingTime.className = 'reading-time';
    readingTime.innerHTML = '<i class="fas fa-clock"></i> <span>Reading time: 0 min</span>';
    document.body.appendChild(readingTime);
    
    // Function to calculate reading time
    function calculateReadingTime() {
        const text = document.body.innerText;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        readingTime.querySelector('span').textContent = `Reading time: ${minutes} min`;
    }
    
    // Function to update the scroll progress with enhanced features
    function updateScrollProgress() {
        // Calculate how much has been scrolled
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate the height of the page content
        const scrollHeight = document.documentElement.scrollHeight - 
                           document.documentElement.clientHeight;
        
        // Calculate the scroll percentage (0 to 1)
        const scrollPercent = scrollTop / scrollHeight;
        
        // Update progress bar width with smooth transition
        progressBar.style.width = scrollPercent * 100 + '%';
        
        // Update percentage display with animation
        const percentageSpan = percentageDisplay.querySelector('span');
        percentageSpan.textContent = Math.round(scrollPercent * 100) + '%';
        
        // Update progress bar color based on scroll percentage
        if (scrollPercent < 0.33) {
            progressBar.style.background = 'linear-gradient(90deg, #007bff, #00dbde)';
        } else if (scrollPercent < 0.66) {
            progressBar.style.background = 'linear-gradient(90deg, #00dbde, #00ff9d)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #00ff9d, #00ff00)';
        }
        
        // Show/hide scroll to top button
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Update reading progress indicator
        const currentSection = getCurrentSection();
        if (currentSection) {
            updateReadingProgress(currentSection);
        }
    }

    // Function to get current section
    function getCurrentSection() {
        const sections = document.querySelectorAll('section');
        let currentSection = null;
        let maxVisible = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visiblePercent = visibleHeight / rect.height;

            if (visiblePercent > maxVisible) {
                maxVisible = visiblePercent;
                currentSection = section;
            }
        });

        return currentSection;
    }

    // Function to update reading progress
    function updateReadingProgress(section) {
        const sectionTitle = section.querySelector('h2')?.textContent || '';
        const progress = document.createElement('div');
        progress.className = 'section-progress';
        progress.innerHTML = `<i class="fas fa-book-reader"></i> <span>${sectionTitle}</span>`;
        
        const existingProgress = document.querySelector('.section-progress');
        if (existingProgress) {
            existingProgress.remove();
        }
        
        document.body.appendChild(progress);
    }
    
    // Throttle function to limit scroll event firing
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Listen for scroll events with throttling
    window.addEventListener('scroll', throttle(updateScrollProgress, 50), { passive: true });
    
    // Scroll to top functionality with enhanced animation
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        scrollTopBtn.classList.add('clicked');
        setTimeout(() => scrollTopBtn.classList.remove('clicked'), 300);
    });
    
    // Initialize on page load
    updateScrollProgress();
    calculateReadingTime();
    
    // Update on window resize
    window.addEventListener('resize', throttle(updateScrollProgress, 100), { passive: true });
    
    // Add fade-in effect to sections with enhanced animation
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add a subtle parallax effect
                entry.target.style.transform = `translateY(${entry.intersectionRatio * 20}px)`;
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});