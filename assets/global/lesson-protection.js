// Lesson Protection System - lesson-protection.js
class LessonProtection {
    constructor() {
        this.storagePrefix = 'vue_learning_';
        this.currentLesson = this.getCurrentLessonInfo();
        this.init();
    }

    init() {
        // Run protection check immediately when script loads
        if (!this.validateAccess()) {
            return; // Access denied, redirect will happen
        }

        // Set up navigation protection
        this.protectNavigation();
        
        // Listen for browser back/forward navigation
        window.addEventListener('popstate', () => this.validateAccess());
        
        // Prevent right-click context menu in production (optional)
        if (this.isProduction()) {
            this.preventRightClick();
        }
    }

    getCurrentLessonInfo() {
        const path = window.location.pathname;
        const url = window.location.href;
        
        // Extract lesson number from various possible formats
        let lessonMatch = path.match(/lesson[_-]?(\d+)/i) || url.match(/lesson[_-]?(\d+)/i);
        
        if (!lessonMatch) {
            // If no lesson number found, assume it's lesson 0 (getting started)
            return { number: 0, id: 'lesson_0' };
        }

        const lessonNumber = parseInt(lessonMatch[1]);
        return {
            number: lessonNumber,
            id: `lesson_${lessonNumber}`,
            part: this.getPartFromLessonNumber(lessonNumber)
        };
    }

    getPartFromLessonNumber(lessonNumber) {
        if (lessonNumber === 0) return 0;
        if (lessonNumber >= 1 && lessonNumber <= 5) return 1;
        if (lessonNumber >= 6 && lessonNumber <= 9) return 2;
        if (lessonNumber >= 10 && lessonNumber <= 13) return 3;
        if (lessonNumber >= 14 && lessonNumber <= 17) return 4;
        if (lessonNumber >= 18 && lessonNumber <= 23) return 5;
        if (lessonNumber >= 24 && lessonNumber <= 27) return 6;
        return 0;
    }

    isLessonCompleted(lessonId) {
        return localStorage.getItem(`${this.storagePrefix}${lessonId}_complete`) === 'true';
    }

    canAccessLesson(lessonNumber) {
        // Always allow access to lesson 0 (getting started)
        if (lessonNumber === 0) return true;
        
        // Check if all previous lessons are completed
        for (let i = 0; i < lessonNumber; i++) {
            const lessonId = `lesson_${i}`;
            if (!this.isLessonCompleted(lessonId)) {
                return false;
            }
        }
        
        return true;
    }

    getNextAccessibleLesson() {
        // Find the first incomplete lesson
        for (let i = 0; i <= 27; i++) {
            const lessonId = `lesson_${i}`;
            if (!this.isLessonCompleted(lessonId)) {
                return i;
            }
        }
        return 27; // All lessons completed
    }

    validateAccess() {
        const lessonNumber = this.currentLesson.number;
        
        if (!this.canAccessLesson(lessonNumber)) {
            const nextLesson = this.getNextAccessibleLesson();
            const requiredLesson = lessonNumber - 1;
            
            this.showAccessDeniedModal(requiredLesson, lessonNumber, nextLesson);
            this.redirectToAccessibleLesson(nextLesson);
            return false;
        }
        
        return true;
    }

    showAccessDeniedModal(requiredLesson, attemptedLesson, nextLesson) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'lesson-protection-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-content">
                    <div class="modal-icon">🔒</div>
                    <h2 class="modal-title">Lesson Locked</h2>
                    <p class="modal-message">
                        You need to complete <strong>Lesson ${requiredLesson}</strong> 
                        before accessing Lesson ${attemptedLesson}.
                    </p>
                    <div class="modal-progress">
                        <div class="progress-info">
                            <span>Your Progress:</span>
                            <span>${this.getCompletedLessonsCount()}/28 lessons completed</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${this.getProgressPercentage()}%"></div>
                        </div>
                    </div>
                    <p class="modal-redirect">
                        Redirecting to Lesson ${nextLesson} in <span id="countdown">3</span> seconds...
                    </p>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="window.location.href='${this.getLessonURL(nextLesson)}'">
                            Go to Lesson ${nextLesson}
                        </button>
                        <button class="btn btn-secondary" onclick="window.location.href='/index.html'">
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.addModalStyles();
        
        // Add to DOM
        document.body.appendChild(modal);
        
        // Start countdown
        this.startCountdown(3, nextLesson);
        
        // Prevent scrolling
        document.body.style.overflow = 'hidden';
    }

    startCountdown(seconds, nextLesson) {
        const countdownEl = document.getElementById('countdown');
        let remaining = seconds;
        
        const timer = setInterval(() => {
            remaining--;
            if (countdownEl) {
                countdownEl.textContent = remaining;
            }
            
            if (remaining <= 0) {
                clearInterval(timer);
                this.redirectToAccessibleLesson(nextLesson);
            }
        }, 1000);
    }

    redirectToAccessibleLesson(lessonNumber) {
        setTimeout(() => {
            const url = this.getLessonURL(lessonNumber);
            window.location.replace(url);
        }, 3000);
    }

    getLessonURL(lessonNumber) {
        const part = this.getPartFromLessonNumber(lessonNumber);
        return `/assets/part_${part}/lesson_${lessonNumber}/lesson_${lessonNumber}.html`;
    }

    getCompletedLessonsCount() {
        let count = 0;
        for (let i = 0; i <= 27; i++) {
            if (this.isLessonCompleted(`lesson_${i}`)) {
                count++;
            }
        }
        return count;
    }

    getProgressPercentage() {
        return Math.round((this.getCompletedLessonsCount() / 28) * 100);
    }

    protectNavigation() {
        // Override history API to prevent programmatic navigation to locked lessons
        const originalPushState = history.pushState.bind(history);
        const originalReplaceState = history.replaceState.bind(history);

        history.pushState = (...args) => {
            if (this.shouldBlockNavigation(args[2])) {
                console.warn('Navigation blocked: Lesson not accessible');
                return;
            }
            return originalPushState(...args);
        };

        history.replaceState = (...args) => {
            if (this.shouldBlockNavigation(args[2])) {
                console.warn('Navigation blocked: Lesson not accessible');
                return;
            }
            return originalReplaceState(...args);
        };

        // Block direct URL manipulation
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (!this.validateCurrentURL()) {
                    history.back();
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    shouldBlockNavigation(url) {
        if (!url || typeof url !== 'string') return false;
        
        const lessonMatch = url.match(/lesson[_-]?(\d+)/i);
        if (!lessonMatch) return false;
        
        const lessonNumber = parseInt(lessonMatch[1]);
        return !this.canAccessLesson(lessonNumber);
    }

    validateCurrentURL() {
        const currentLessonInfo = this.getCurrentLessonInfo();
        return this.canAccessLesson(currentLessonInfo.number);
    }

    // Prevent right-click in production
    preventRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showBriefMessage('Right-click disabled during lessons');
        });

        // Prevent common keyboard shortcuts for developer tools
        document.addEventListener('keydown', (e) => {
            // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
                this.showBriefMessage('Developer tools access restricted during lessons');
            }
        });
    }

    showBriefMessage(text) {
        const message = document.createElement('div');
        message.className = 'brief-message';
        message.textContent = text;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10001;
            animation: fadeInOut 2s ease forwards;
        `;

        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }

    isProduction() {
        return !window.location.hostname.includes('localhost') && 
               !window.location.hostname.includes('127.0.0.1');
    }

    addModalStyles() {
        if (document.getElementById('lesson-protection-styles')) return;

        const style = document.createElement('style');
        style.id = 'lesson-protection-styles';
        style.textContent = `
            .lesson-protection-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }

            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }

            .modal-container {
                position: relative;
                z-index: 1;
                max-width: 500px;
                margin: 20px;
                width: 100%;
            }

            .modal-content {
                background: white;
                border-radius: 20px;
                padding: 40px 30px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                animation: slideUp 0.4s ease;
            }

            .modal-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                opacity: 0.8;
            }

            .modal-title {
                font-size: 1.8rem;
                font-weight: 700;
                color: #e74c3c;
                margin-bottom: 15px;
            }

            .modal-message {
                font-size: 1.1rem;
                color: #555;
                line-height: 1.6;
                margin-bottom: 25px;
            }

            .modal-progress {
                background: #f8f9ff;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
            }

            .progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 10px;
            }

            .progress-bar {
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 4px;
                transition: width 0.5s ease;
            }

            .modal-redirect {
                font-size: 0.95rem;
                color: #777;
                margin-bottom: 30px;
            }

            #countdown {
                font-weight: 600;
                color: #667eea;
            }

            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                font-size: 1rem;
                transition: all 0.3s ease;
                min-width: 140px;
                justify-content: center;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .btn-secondary {
                background: #f8f9ff;
                color: #667eea;
                border: 2px solid #667eea;
            }

            .btn-secondary:hover {
                background: #667eea;
                color: white;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }

            @media (max-width: 768px) {
                .modal-content {
                    padding: 30px 20px;
                    margin: 10px;
                }

                .modal-title {
                    font-size: 1.5rem;
                }

                .modal-actions {
                    flex-direction: column;
                }

                .btn {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Public method to mark current lesson as complete
    markCurrentLessonComplete(score = 100) {
        const lessonId = this.currentLesson.id;
        
        // Use the global progress tracker if available
        if (window.progressTracker) {
            return window.progressTracker.markLessonComplete(lessonId, score);
        }
        
        // Fallback to basic completion marking
        localStorage.setItem(`${this.storagePrefix}${lessonId}_complete`, 'true');
        localStorage.setItem(`${this.storagePrefix}${lessonId}_completed_at`, new Date().toISOString());
        
        // Show completion notification
        this.showCompletionNotification(lessonId, score);
        
        return true;
    }

    showCompletionNotification(lessonId, score) {
        const notification = document.createElement('div');
        notification.className = 'completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✅</div>
                <div class="notification-text">
                    <div class="notification-title">Lesson Completed!</div>
                    <div class="notification-message">
                        Great job! Score: ${score}%
                        ${this.getNextLessonMessage()}
                    </div>
                </div>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #66bb6a);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
            z-index: 10000;
            max-width: 350px;
            animation: slideInRight 0.4s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 5000);
    }

    getNextLessonMessage() {
        const nextLesson = this.currentLesson.number + 1;
        if (nextLesson <= 27) {
            return `<br><small>Lesson ${nextLesson} is now unlocked!</small>`;
        } else {
            return `<br><small>All lessons completed! 🎉</small>`;
        }
    }
}

// Initialize protection system immediately
const lessonProtection = new LessonProtection();

// Export for global use
window.LessonProtection = LessonProtection;
window.lessonProtection = lessonProtection;

// Provide a global function for lessons to mark themselves complete
window.markLessonComplete = function(score = 100) {
    return lessonProtection.markCurrentLessonComplete(score);
};