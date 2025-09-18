// Global Progress Tracking System
class ProgressTracker {
    constructor() {
        this.storagePrefix = 'vue_learning_';
        this.lessons = this.initializeLessons();
        this.init();
    }

    init() {
        // Initialize progress tracking on page load
        this.updateGlobalProgress();
        this.bindEvents();
    }

    // Define all lessons structure
    initializeLessons() {
        return {
            part_0: {
                title: "Setup & Orientation",
                lessons: [
                    { id: "lesson_0", title: "Getting Started", required: true }
                ]
            },
            part_1: {
                title: "Web Foundations",
                lessons: [
                    { id: "lesson_1", title: "HTML Basics", required: true },
                    { id: "lesson_2", title: "CSS Basics", required: true },
                    { id: "lesson_3", title: "JavaScript Basics", required: true },
                    { id: "lesson_4", title: "JavaScript Interactivity", required: true },
                    { id: "lesson_5", title: "Debugging & DevTools", required: true }
                ]
            },
            part_2: {
                title: "Vue.js Basics (CDN)",
                lessons: [
                    { id: "lesson_6", title: "Introduction to Vue", required: true },
                    { id: "lesson_7", title: "Vue Directives", required: true },
                    { id: "lesson_8", title: "Event Handling", required: true },
                    { id: "lesson_9", title: "Forms & Two-Way Binding", required: true }
                ]
            },
            part_3: {
                title: "Components & Reusability",
                lessons: [
                    { id: "lesson_10", title: "Component Basics", required: true },
                    { id: "lesson_11", title: "Props & Communication", required: true },
                    { id: "lesson_12", title: "Lists & Conditional Rendering", required: true },
                    { id: "lesson_13", title: "Lifecycle Hooks", required: true }
                ]
            },
            part_4: {
                title: "Modern Vue Development",
                lessons: [
                    { id: "lesson_14", title: "Vue Project Setup", required: true },
                    { id: "lesson_15", title: "Vue Router", required: true },
                    { id: "lesson_16", title: "State Management (Pinia)", required: true },
                    { id: "lesson_17", title: "Styling Frameworks", required: true }
                ]
            },
            part_5: {
                title: "Complete Learning Platform",
                lessons: [
                    { id: "lesson_18", title: "Platform Layout Design", required: true },
                    { id: "lesson_19", title: "Dynamic Lesson Content", required: true },
                    { id: "lesson_20", title: "Code Editor Integration", required: true },
                    { id: "lesson_21", title: "Progress Tracking & Storage", required: true },
                    { id: "lesson_22", title: "Final Assembly & Polish", required: true },
                    { id: "lesson_23", title: "Deployment", required: true }
                ]
            },
            part_6: {
                title: "Advanced Topics",
                lessons: [
                    { id: "lesson_24", title: "User Authentication", required: false },
                    { id: "lesson_25", title: "Backend Integration", required: false },
                    { id: "lesson_26", title: "Gamification Features", required: false },
                    { id: "lesson_27", title: "Accessibility & Best Practices", required: true }
                ]
            }
        };
    }

    // Check if a lesson is completed
    isLessonCompleted(lessonId) {
        return localStorage.getItem(`${this.storagePrefix}${lessonId}_complete`) === 'true';
    }

    // Mark a lesson as completed
    markLessonComplete(lessonId, score = 100, timeSpent = 0) {
        const completionData = {
            completed: true,
            completedAt: new Date().toISOString(),
            score: score,
            timeSpent: timeSpent,
            attempts: this.getLessonAttempts(lessonId) + 1
        };

        // Store completion status
        localStorage.setItem(`${this.storagePrefix}${lessonId}_complete`, 'true');
        localStorage.setItem(`${this.storagePrefix}${lessonId}_data`, JSON.stringify(completionData));

        // Update overall progress
        this.updateGlobalProgress();

        // Check if this completes a part
        this.checkPartCompletion(lessonId);

        // Check if this completes the entire course
        this.checkCourseCompletion();

        // Log activity
        this.logActivity(lessonId, 'completed', score);

        // Show completion notification
        this.showCompletionNotification(lessonId);

        return completionData;
    }

    // Get lesson attempts count
    getLessonAttempts(lessonId) {
        const data = this.getLessonData(lessonId);
        return data ? data.attempts || 0 : 0;
    }

    // Get lesson completion data
    getLessonData(lessonId) {
        const data = localStorage.getItem(`${this.storagePrefix}${lessonId}_data`);
        return data ? JSON.parse(data) : null;
    }

    // Check if a part is completed
    isPartCompleted(partId) {
        const part = this.lessons[partId];
        if (!part) return false;

        return part.lessons.every(lesson => 
            !lesson.required || this.isLessonCompleted(lesson.id)
        );
    }

    // Check part completion when a lesson is completed
    checkPartCompletion(lessonId) {
        const partId = this.getPartFromLesson(lessonId);
        if (!partId) return;

        if (this.isPartCompleted(partId)) {
            const completionData = {
                completedAt: new Date().toISOString(),
                lessonsCompleted: this.lessons[partId].lessons.length
            };
            
            localStorage.setItem(`${this.storagePrefix}${partId}_complete`, 'true');
            localStorage.setItem(`${this.storagePrefix}${partId}_data`, JSON.stringify(completionData));
            
            this.logActivity(partId, 'part_completed');
            this.showPartCompletionNotification(partId);
        }
    }

    // Check if entire course is completed
    checkCourseCompletion() {
        const requiredParts = ['part_0', 'part_1', 'part_2', 'part_3', 'part_4', 'part_5'];
        const allRequiredPartsComplete = requiredParts.every(partId => this.isPartCompleted(partId));

        if (allRequiredPartsComplete) {
            const completionData = {
                completedAt: new Date().toISOString(),
                totalScore: this.calculateOverallScore(),
                totalTimeSpent: this.calculateTotalTimeSpent()
            };

            localStorage.setItem(`${this.storagePrefix}course_complete`, 'true');
            localStorage.setItem(`${this.storagePrefix}course_data`, JSON.stringify(completionData));
            
            this.logActivity('course', 'course_completed');
            this.showCourseCompletionNotification();
        }
    }

    // Get part ID from lesson ID
    getPartFromLesson(lessonId) {
        for (const [partId, part] of Object.entries(this.lessons)) {
            if (part.lessons.some(lesson => lesson.id === lessonId)) {
                return partId;
            }
        }
        return null;
    }

    // Calculate overall score
    calculateOverallScore() {
        let totalScore = 0;
        let totalLessons = 0;

        Object.values(this.lessons).forEach(part => {
            part.lessons.forEach(lesson => {
                if (this.isLessonCompleted(lesson.id)) {
                    const data = this.getLessonData(lesson.id);
                    totalScore += data ? data.score || 100 : 100;
                    totalLessons++;
                }
            });
        });

        return totalLessons > 0 ? Math.round(totalScore / totalLessons) : 0;
    }

    // Calculate total time spent
    calculateTotalTimeSpent() {
        let totalTime = 0;

        Object.values(this.lessons).forEach(part => {
            part.lessons.forEach(lesson => {
                if (this.isLessonCompleted(lesson.id)) {
                    const data = this.getLessonData(lesson.id);
                    totalTime += data ? data.timeSpent || 0 : 0;
                }
            });
        });

        return totalTime;
    }

    // Update global progress indicators
    updateGlobalProgress() {
        const totalLessons = this.getTotalLessonsCount();
        const completedLessons = this.getCompletedLessonsCount();
        const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

        // Update any progress bars on the page
        const progressBars = document.querySelectorAll('.progress-bar[data-progress="global"]');
        progressBars.forEach(bar => {
            bar.style.width = progressPercentage + '%';
        });

        // Update progress text elements
        const progressTexts = document.querySelectorAll('.progress-text[data-progress="global"]');
        progressTexts.forEach(text => {
            text.textContent = `${completedLessons}/${totalLessons} (${progressPercentage}%)`;
        });

        // Store global progress
        localStorage.setItem(`${this.storagePrefix}global_progress`, JSON.stringify({
            totalLessons,
            completedLessons,
            percentage: progressPercentage,
            lastUpdated: new Date().toISOString()
        }));
    }

    // Get total lessons count
    getTotalLessonsCount() {
        return Object.values(this.lessons).reduce((total, part) => 
            total + part.lessons.length, 0
        );
    }

    // Get completed lessons count
    getCompletedLessonsCount() {
        let completed = 0;
        Object.values(this.lessons).forEach(part => {
            part.lessons.forEach(lesson => {
                if (this.isLessonCompleted(lesson.id)) {
                    completed++;
                }
            });
        });
        return completed;
    }

    // Get next available lesson
    getNextLesson() {
        for (const [partId, part] of Object.entries(this.lessons)) {
            for (const lesson of part.lessons) {
                if (!this.isLessonCompleted(lesson.id)) {
                    return {
                        ...lesson,
                        partId,
                        partTitle: part.title,
                        url: this.getLessonURL(lesson.id, partId)
                    };
                }
            }
        }
        return null; // All lessons completed
    }

    // Get lesson URL based on lesson ID and part
    getLessonURL(lessonId, partId) {
        return `../part_${partId.split('_')[1]}/${lessonId}/${lessonId}.html`;
    }

    // Navigate to next lesson
    navigateToNextLesson() {
        const nextLesson = this.getNextLesson();
        if (nextLesson) {
            window.location.href = nextLesson.url;
        } else {
            // All lessons completed, go to certificate
            window.location.href = '../global/certificate.html';
        }
    }

    // Check if lesson is accessible (previous lessons completed)
    isLessonAccessible(lessonId) {
        // Find the lesson and its position
        let found = false;
        let accessible = true;

        for (const [partId, part] of Object.entries(this.lessons)) {
            for (const lesson of part.lessons) {
                if (lesson.id === lessonId) {
                    found = true;
                    break;
                }
                
                // If we haven't found our target lesson yet, check if this one is completed
                if (lesson.required && !this.isLessonCompleted(lesson.id)) {
                    accessible = false;
                }
            }
            if (found) break;
        }

        return accessible;
    }

    // Log activity for analytics
    logActivity(itemId, action, score = null) {
        const activities = JSON.parse(localStorage.getItem(`${this.storagePrefix}activities`) || '[]');
        
        const activity = {
            id: Date.now().toString(),
            itemId,
            action,
            timestamp: new Date().toISOString(),
            score
        };

        activities.push(activity);
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(0, activities.length - 50);
        }

        localStorage.setItem(`${this.storagePrefix}activities`, JSON.stringify(activities));
    }

    // Get recent activities
    getRecentActivities(limit = 10) {
        const activities = JSON.parse(localStorage.getItem(`${this.storagePrefix}activities`) || '[]');
        return activities.slice(-limit).reverse();
    }

    // Show completion notifications
    showCompletionNotification(lessonId) {
        const lesson = this.findLessonById(lessonId);
        if (!lesson) return;

        this.showNotification({
            type: 'success',
            title: 'Lesson Completed!',
            message: `Great job completing "${lesson.title}"`,
            duration: 4000
        });
    }

    showPartCompletionNotification(partId) {
        const part = this.lessons[partId];
        if (!part) return;

        this.showNotification({
            type: 'success',
            title: 'Part Completed!',
            message: `Congratulations! You've completed "${part.title}"`,
            duration: 5000
        });
    }

    showCourseCompletionNotification() {
        this.showNotification({
            type: 'celebration',
            title: 'Course Completed!',
            message: 'Amazing! You\'ve completed the entire Vue Learning course. Generate your certificate!',
            duration: 8000,
            actions: [
                {
                    text: 'Generate Certificate',
                    action: () => window.location.href = 'assets/global/certificate.html'
                }
            ]
        });
    }

    // Generic notification system
    showNotification(options) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${options.type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${this.getNotificationIcon(options.type)}
                </div>
                <div class="notification-text">
                    <div class="notification-title">${options.title}</div>
                    <div class="notification-message">${options.message}</div>
                </div>
                <button class="notification-close">&times;</button>
            </div>
            ${options.actions ? `
                <div class="notification-actions">
                    ${options.actions.map(action => 
                        `<button class="btn btn-sm btn-primary" onclick="(${action.action})()">${action.text}</button>`
                    ).join('')}
                </div>
            ` : ''}
        `;

        // Add styles if not already present
        this.addNotificationStyles();

        // Add to DOM
        document.body.appendChild(notification);

        // Auto-remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, options.duration || 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            celebration: '🎉',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    // Find lesson by ID
    findLessonById(lessonId) {
        for (const part of Object.values(this.lessons)) {
            const lesson = part.lessons.find(l => l.id === lessonId);
            if (lesson) return lesson;
        }
        return null;
    }

    // Add notification styles
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid var(--success-color);
            }
            
            .notification-celebration {
                border-left: 4px solid var(--accent-color);
                background: linear-gradient(135deg, #fff, #fffbeb);
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                padding: 16px;
            }
            
            .notification-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                color: var(--text-dark);
                margin-bottom: 4px;
            }
            
            .notification-message {
                font-size: 0.9rem;
                color: var(--text-light);
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: var(--text-light);
                cursor: pointer;
                padding: 0;
                flex-shrink: 0;
            }
            
            .notification-actions {
                padding: 0 16px 16px;
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Bind global events
    bindEvents() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith(this.storagePrefix)) {
                this.updateGlobalProgress();
            }
        });
    }

    // Reset progress (for development/testing)
    resetProgress() {
        const keys = Object.keys(localStorage).filter(key => 
            key.startsWith(this.storagePrefix)
        );
        keys.forEach(key => localStorage.removeItem(key));
        this.updateGlobalProgress();
    }

    // Export progress data
    exportProgress() {
        const data = {};
        const keys = Object.keys(localStorage).filter(key => 
            key.startsWith(this.storagePrefix)
        );
        
        keys.forEach(key => {
            data[key] = localStorage.getItem(key);
        });
        
        return JSON.stringify(data, null, 2);
    }

    // Import progress data
    importProgress(data) {
        try {
            const progressData = JSON.parse(data);
            Object.entries(progressData).forEach(([key, value]) => {
                if (key.startsWith(this.storagePrefix)) {
                    localStorage.setItem(key, value);
                }
            });
            this.updateGlobalProgress();
            return true;
        } catch (error) {
            console.error('Failed to import progress:', error);
            return false;
        }
    }
}

// Initialize global progress tracker
const progressTracker = new ProgressTracker();

// Export for use in other scripts
window.ProgressTracker = ProgressTracker;
window.progressTracker = progressTracker;