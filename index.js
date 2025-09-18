// Homepage JavaScript - index.js
document.addEventListener('DOMContentLoaded', function() {
    initializeHomepage();
    updateProgress();
    loadRecentActivity();
    updateTimelineStatus();
});

// Initialize homepage functionality
function initializeHomepage() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize progress tracking
    trackPageView();
}

// Track page view for analytics
function trackPageView() {
    const lastVisit = localStorage.getItem('lastVisit');
    const currentTime = new Date().toISOString();
    
    localStorage.setItem('lastVisit', currentTime);
    
    if (!lastVisit) {
        // First time visitor
        addActivityItem('🎯', 'Welcome to Vue Learning Platform!', 'Just now');
    } else {
        addActivityItem('👋', 'Welcome back!', 'Just now');
    }
}

// Update overall progress display
function updateProgress() {
    const totalLessons = 28; // Total lessons across all parts
    let completedCount = 0;
    
    // Count completed lessons from all parts
    for (let part = 0; part <= 6; part++) {
        const partLessons = getPartLessons(part);
        for (let lesson of partLessons) {
            if (isLessonCompleted(lesson.id)) {
                completedCount++;
            }
        }
    }
    
    const percentage = Math.round((completedCount / totalLessons) * 100);
    
    // Update UI elements
    document.getElementById('overallProgress').textContent = percentage + '%';
    document.getElementById('overallProgressFill').style.width = percentage + '%';
    document.getElementById('completedLessons').textContent = `${completedCount}/${totalLessons}`;
    
    // Update current part
    const currentPart = getCurrentPart();
    document.getElementById('currentPart').textContent = `Part ${currentPart}`;
    
    // Enable certificate button if all lessons completed
    const certificateBtn = document.getElementById('certificateBtn');
    if (completedCount === totalLessons) {
        certificateBtn.disabled = false;
        certificateBtn.textContent = 'Generate Certificate';
    } else {
        certificateBtn.disabled = true;
        certificateBtn.textContent = `Certificate (${completedCount}/${totalLessons})`;
    }
}

// Get lessons for a specific part
function getPartLessons(partNumber) {
    const partLessons = {
        0: [{ id: 'lesson_0', title: 'Getting Started', part: 0 }],
        1: [
            { id: 'lesson_1', title: 'HTML Basics', part: 1 },
            { id: 'lesson_2', title: 'CSS Basics', part: 1 },
            { id: 'lesson_3', title: 'JavaScript Basics', part: 1 },
            { id: 'lesson_4', title: 'JavaScript Interactivity', part: 1 },
            { id: 'lesson_5', title: 'Debugging & DevTools', part: 1 }
        ],
        2: [
            { id: 'lesson_6', title: 'Introduction to Vue', part: 2 },
            { id: 'lesson_7', title: 'Vue Directives', part: 2 },
            { id: 'lesson_8', title: 'Event Handling', part: 2 },
            { id: 'lesson_9', title: 'Forms & Two-Way Binding', part: 2 }
        ],
        3: [
            { id: 'lesson_10', title: 'Component Basics', part: 3 },
            { id: 'lesson_11', title: 'Props & Communication', part: 3 },
            { id: 'lesson_12', title: 'Lists & Conditional Rendering', part: 3 },
            { id: 'lesson_13', title: 'Lifecycle Hooks', part: 3 }
        ],
        4: [
            { id: 'lesson_14', title: 'Vue Project Setup', part: 4 },
            { id: 'lesson_15', title: 'Vue Router', part: 4 },
            { id: 'lesson_16', title: 'State Management (Pinia)', part: 4 },
            { id: 'lesson_17', title: 'Styling Frameworks', part: 4 }
        ],
        5: [
            { id: 'lesson_18', title: 'Platform Layout Design', part: 5 },
            { id: 'lesson_19', title: 'Dynamic Lesson Content', part: 5 },
            { id: 'lesson_20', title: 'Code Editor Integration', part: 5 },
            { id: 'lesson_21', title: 'Progress Tracking & Storage', part: 5 },
            { id: 'lesson_22', title: 'Final Assembly & Polish', part: 5 },
            { id: 'lesson_23', title: 'Deployment', part: 5 }
        ],
        6: [
            { id: 'lesson_24', title: 'User Authentication', part: 6 },
            { id: 'lesson_25', title: 'Backend Integration', part: 6 },
            { id: 'lesson_26', title: 'Gamification Features', part: 6 },
            { id: 'lesson_27', title: 'Accessibility & Best Practices', part: 6 }
        ]
    };
    
    return partLessons[partNumber] || [];
}

// Check if a lesson is completed
function isLessonCompleted(lessonId) {
    return localStorage.getItem(`${lessonId}_complete`) === 'true';
}

// Get current part based on progress
function getCurrentPart() {
    for (let part = 0; part <= 6; part++) {
        const partLessons = getPartLessons(part);
        for (let lesson of partLessons) {
            if (!isLessonCompleted(lesson.id)) {
                return part;
            }
        }
    }
    return 6; // All completed
}

// Get next lesson to continue
function getNextLesson() {
    for (let part = 0; part <= 6; part++) {
        const partLessons = getPartLessons(part);
        for (let lesson of partLessons) {
            if (!isLessonCompleted(lesson.id)) {
                return lesson;
            }
        }
    }
    return null; // All completed
}

// Load recent activity from localStorage
function loadRecentActivity() {
    const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const activityList = document.getElementById('activityList');
    
    // Clear existing activities except welcome message
    const welcomeActivity = activityList.querySelector('.activity-item');
    activityList.innerHTML = '';
    
    if (activities.length === 0) {
        // Add welcome message back if no activities
        activityList.appendChild(welcomeActivity);
        return;
    }
    
    // Show latest 5 activities
    activities.slice(-5).reverse().forEach(activity => {
        const activityElement = createActivityElement(activity);
        activityList.appendChild(activityElement);
    });
}

// Create activity element
function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
        <div class="activity-icon">${activity.icon}</div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;
    return div;
}

// Add activity item
function addActivityItem(icon, title, time) {
    const activities = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    activities.push({
        icon,
        title,
        time,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 activities
    if (activities.length > 10) {
        activities.splice(0, activities.length - 10);
    }
    
    localStorage.setItem('recentActivity', JSON.stringify(activities));
    loadRecentActivity();
}

// Update timeline status based on progress
function updateTimelineStatus() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const partLessons = getPartLessons(index);
        const completedInPart = partLessons.filter(lesson => isLessonCompleted(lesson.id)).length;
        const totalInPart = partLessons.length;
        
        if (completedInPart === totalInPart && totalInPart > 0) {
            // Part completed
            item.classList.remove('locked');
            item.classList.add('completed');
        } else if (completedInPart > 0) {
            // Part in progress
            item.classList.remove('locked');
            item.classList.add('in-progress');
        } else if (index === 0 || timelineItems[index - 1]?.classList.contains('completed')) {
            // Available to start
            item.classList.remove('locked');
        }
        
        // Update lesson count display
        const lessonCountEl = item.querySelector('.lesson-count');
        if (lessonCountEl && totalInPart > 0) {
            lessonCountEl.textContent = `${completedInPart}/${totalInPart} Lessons`;
        }
    });
}

// Start learning function
function startLearning() {
    const nextLesson = getNextLesson();
    if (nextLesson) {
        const url = `assets/part_${nextLesson.part}/${nextLesson.id}/${nextLesson.id}.html`;
        window.location.href = url;
    } else {
        // All lessons completed
        alert('Congratulations! You have completed all lessons. You can now generate your certificate!');
        document.getElementById('progress').scrollIntoView({ behavior: 'smooth' });
    }
}

// Show progress section
function showProgress() {
    document.getElementById('progress').scrollIntoView({ behavior: 'smooth' });
}

// Go to next lesson
function goToNextLesson() {
    startLearning();
}

// Show all lessons modal
function showAllLessons() {
    const modal = document.getElementById('lessonModal');
    const partsGrid = document.getElementById('partsGrid');
    
    // Clear existing content
    partsGrid.innerHTML = '';
    
    // Create parts
    for (let part = 0; part <= 6; part++) {
        const partLessons = getPartLessons(part);
        if (partLessons.length === 0) continue;
        
        const partElement = createPartElement(part, partLessons);
        partsGrid.appendChild(partElement);
    }
    
    modal.style.display = 'block';
}

// Create part element for modal
function createPartElement(partNumber, lessons) {
    const div = document.createElement('div');
    div.className = 'part-card';
    
    const completedCount = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    const isPartAccessible = partNumber === 0 || getPartLessons(partNumber - 1).every(lesson => isLessonCompleted(lesson.id));
    
    div.innerHTML = `
        <div class="part-header">
            <h3>Part ${partNumber}</h3>
            <div class="part-progress">${completedCount}/${lessons.length}</div>
        </div>
        <div class="lessons-list">
            ${lessons.map(lesson => `
                <div class="lesson-item ${isLessonCompleted(lesson.id) ? 'completed' : ''} ${!isPartAccessible && !isLessonCompleted(lesson.id) ? 'locked' : ''}">
                    <span class="lesson-status">
                        ${isLessonCompleted(lesson.id) ? '✅' : (isPartAccessible ? '📖' : '🔒')}
                    </span>
                    <span class="lesson-title">${lesson.title}</span>
                    ${isPartAccessible || isLessonCompleted(lesson.id) ? 
                        `<button class="lesson-btn" onclick="goToLesson('${lesson.id}', ${lesson.part})">
                            ${isLessonCompleted(lesson.id) ? 'Review' : 'Start'}
                        </button>` : 
                        '<span class="lesson-locked">Locked</span>'
                    }
                </div>
            `).join('')}
        </div>
    `;
    
    return div;
}

// Go to specific lesson
function goToLesson(lessonId, partNumber) {
    closeLessonModal();
    const url = `assets/part_${partNumber}/${lessonId}/${lessonId}.html`;
    window.location.href = url;
}

// Close lesson modal
function closeLessonModal() {
    const modal = document.getElementById('lessonModal');
    modal.style.display = 'none';
}

// Open certificate
function openCertificate() {
    window.location.href = 'assets/global/certificate.html';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('lessonModal');
    if (event.target === modal) {
        closeLessonModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLessonModal();
    }
});