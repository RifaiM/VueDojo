// Lesson 0 JavaScript - lesson_0.js
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson();
    setupScrollSpying();
    checkBrowser();
    updateProgressTracking();
});

// Initialize lesson functionality
function initializeLesson() {
    // Setup outline navigation
    setupOutlineNavigation();
    
    // Initialize checklist functionality
    setupChecklists();
    
    // Setup completion tracking
    setupCompletionTracking();
    
    // Add smooth scrolling to section links
    addSmoothScrolling();
    
    // Track time spent
    startTimeTracking();
}

// Setup outline navigation
function setupOutlineNavigation() {
    const outlineItems = document.querySelectorAll('.outline-item');
    
    outlineItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            
            if (section) {
                section.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Update active state
                outlineItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Setup scroll spy for outline
function setupScrollSpying() {
    const sections = document.querySelectorAll('.lesson-section');
    const outlineItems = document.querySelectorAll('.outline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Update active outline item
                outlineItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.section === sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -300px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Check browser functionality
function checkBrowser() {
    const browserInfo = getBrowserInfo();
    const browserInfoEl = document.getElementById('browser-info');
    const browserStatusEl = document.getElementById('browser-status');
    
    if (browserInfoEl) {
        browserInfoEl.textContent = `${browserInfo.name} ${browserInfo.version}`;
    }
    
    if (browserStatusEl) {
        const isModern = browserInfo.isModern;
        browserStatusEl.textContent = isModern ? 'Compatible ✓' : 'Needs Update';
        browserStatusEl.className = `tool-status ${isModern ? 'compatible' : 'needs-update'}`;
    }
}

// Get browser information
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let isModern = false;
    
    // Chrome
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browserName = 'Chrome';
        const version = ua.match(/Chrome\/(\d+)/);
        browserVersion = version ? version[1] : 'Unknown';
        isModern = version && parseInt(version[1]) >= 80;
    }
    // Firefox
    else if (ua.includes('Firefox')) {
        browserName = 'Firefox';
        const version = ua.match(/Firefox\/(\d+)/);
        browserVersion = version ? version[1] : 'Unknown';
        isModern = version && parseInt(version[1]) >= 75;
    }
    // Safari
    else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browserName = 'Safari';
        const version = ua.match(/Version\/(\d+)/);
        browserVersion = version ? version[1] : 'Unknown';
        isModern = version && parseInt(version[1]) >= 13;
    }
    // Edge
    else if (ua.includes('Edg')) {
        browserName = 'Edge';
        const version = ua.match(/Edg\/(\d+)/);
        browserVersion = version ? version[1] : 'Unknown';
        isModern = version && parseInt(version[1]) >= 80;
    }
    
    return { name: browserName, version: browserVersion, isModern };
}

// Setup checklist functionality
function setupChecklists() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateButtonStates();
            saveProgress();
            
            // Add visual feedback
            const item = this.closest('.checklist-item');
            if (item) {
                if (this.checked) {
                    item.style.background = 'rgba(72, 187, 120, 0.1)';
                    setTimeout(() => {
                        item.style.background = '';
                    }, 1000);
                }
            }
        });
    });
    
    // Load saved progress
    loadProgress();
}

// Update button states based on checklist completion
function updateButtonStates() {
    // Setup checklist
    const setupChecks = ['check-vscode', 'check-browser', 'check-folder'];
    const setupCompleteBtn = document.getElementById('setup-complete-btn');
    const setupComplete = setupChecks.every(id => 
        document.getElementById(id)?.checked
    );
    
    if (setupCompleteBtn) {
        setupCompleteBtn.disabled = !setupComplete;
    }
    
    // Task validation checklist
    const taskChecks = ['check-file-created', 'check-code-added', 'check-browser-opened', 'check-date-showing'];
    const taskCompleteBtn = document.getElementById('task-complete-btn');
    const taskComplete = taskChecks.every(id => 
        document.getElementById(id)?.checked
    );
    
    if (taskCompleteBtn) {
        taskCompleteBtn.disabled = !taskComplete;
    }
    
    // Final completion button
    const completeLessonBtn = document.getElementById('complete-lesson-btn');
    if (completeLessonBtn) {
        completeLessonBtn.disabled = !(setupComplete && taskComplete);
    }
}

// VS Code check function
function checkVSCode() {
    const vscodeStatus = document.getElementById('vscode-status');
    const checkbox = document.getElementById('check-vscode');
    
    if (vscodeStatus) {
        vscodeStatus.textContent = 'Installed ✓';
        vscodeStatus.className = 'tool-status installed';
    }
    
    if (checkbox) {
        checkbox.checked = true;
        updateButtonStates();
    }
    
    showNotification('Great! VS Code is ready to go.', 'success');
}

// Test browser function
function testBrowser() {
    const browserStatus = document.getElementById('browser-status');
    const checkbox = document.getElementById('check-browser');
    
    // Test modern browser features
    const supportsES6 = (() => {
        try {
            eval('const test = () => {};');
            return true;
        } catch (e) {
            return false;
        }
    })();
    
    const supportsFetch = typeof fetch !== 'undefined';
    const supportsLocalStorage = typeof localStorage !== 'undefined';
    
    const isCompatible = supportsES6 && supportsFetch && supportsLocalStorage;
    
    if (browserStatus) {
        browserStatus.textContent = isCompatible ? 'Compatible ✓' : 'Limited Support';
        browserStatus.className = `tool-status ${isCompatible ? 'compatible' : 'limited'}`;
    }
    
    if (checkbox && isCompatible) {
        checkbox.checked = true;
        updateButtonStates();
    }
    
    const message = isCompatible 
        ? 'Your browser supports all the features we need!'
        : 'Your browser has limited support. Consider updating to the latest version.';
    
    showNotification(message, isCompatible ? 'success' : 'warning');
}

// Mark extensions as installed
function markExtensionsInstalled() {
    const extensionsStatus = document.getElementById('extensions-status');
    
    if (extensionsStatus) {
        extensionsStatus.textContent = 'Installed ✓';
        extensionsStatus.className = 'tool-status installed';
    }
    
    showNotification('Extensions will make your coding experience much smoother!', 'info');
}

// Complete setup function
function completeSetup() {
    const checkbox = document.getElementById('check-folder');
    if (checkbox) {
        checkbox.checked = true;
    }
    
    // Scroll to next section
    const nextSection = document.getElementById('first-html');
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('Setup complete! Ready to create your first HTML file.', 'success');
    saveProgress();
}

// Copy code function
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;
    
    const text = codeElement.textContent;
    
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyCode(text);
        });
    } else {
        fallbackCopyCode(text);
    }
}

// Fallback copy function
function fallbackCopyCode(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Code copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Please copy the code manually', 'info');
    }
    
    textArea.remove();
}

// Validate task completion
function validateTask() {
    const allTasksComplete = ['check-file-created', 'check-code-added', 'check-browser-opened', 'check-date-showing']
        .every(id => document.getElementById(id)?.checked);
    
    if (allTasksComplete) {
        showNotification('Excellent work! You\'ve created your first webpage!', 'celebration');
        
        // Scroll to completion section
        setTimeout(() => {
            const completionSection = document.getElementById('completion');
            if (completionSection) {
                completionSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
        
        saveProgress();
    }
}

// Submit feedback
function submitFeedback(rating) {
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    const feedbackMessage = document.getElementById('feedback-message');
    
    // Update button states
    feedbackBtns.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.rating === rating) {
            btn.classList.add('selected');
        }
    });
    
    // Show thank you message
    if (feedbackMessage) {
        feedbackMessage.style.display = 'block';
    }
    
    // Save feedback
    localStorage.setItem('vue_learning_lesson0_feedback', rating);
    
    showNotification('Thank you for your feedback!', 'info');
}

// Review lesson function
function reviewLesson() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Reviewing from the beginning. Take your time!', 'info');
}

// Setup completion tracking
function setupCompletionTracking() {
    updateProgressTracking();
}

// Update progress tracking
function updateProgressTracking() {
    const progressText = document.querySelector('.progress-text');
    const progressCircle = document.querySelector('.progress-circle');
    
    // Check if lesson requirements are met
    const setupComplete = ['check-vscode', 'check-browser', 'check-folder']
        .every(id => document.getElementById(id)?.checked);
    
    const taskComplete = ['check-file-created', 'check-code-added', 'check-browser-opened', 'check-date-showing']
        .every(id => document.getElementById(id)?.checked);
    
    let completionCount = 0;
    if (setupComplete) completionCount++;
    if (taskComplete) completionCount++;
    
    if (progressText) {
        progressText.textContent = `${completionCount}/2`;
    }
    
    if (progressCircle && completionCount > 0) {
        progressCircle.style.borderColor = completionCount === 2 ? 
            'var(--success-color)' : 'var(--warning-color)';
    }
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        checkboxes: {},
        completedAt: new Date().toISOString(),
        timeSpent: getTimeSpent()
    };
    
    // Save checkbox states
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        progress.checkboxes[checkbox.id] = checkbox.checked;
    });
    
    // Save feedback
    const feedback = localStorage.getItem('vue_learning_lesson0_feedback');
    if (feedback) {
        progress.feedback = feedback;
    }
    
    localStorage.setItem('vue_learning_lesson0_progress', JSON.stringify(progress));
    updateProgressTracking();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('vue_learning_lesson0_progress');
    if (!saved) return;
    
    try {
        const progress = JSON.parse(saved);
        
        // Restore checkbox states
        Object.entries(progress.checkboxes || {}).forEach(([id, checked]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = checked;
            }
        });
        
        // Restore feedback
        if (progress.feedback) {
            const feedbackBtn = document.querySelector(`[data-rating="${progress.feedback}"]`);
            if (feedbackBtn) {
                feedbackBtn.classList.add('selected');
                const feedbackMessage = document.getElementById('feedback-message');
                if (feedbackMessage) {
                    feedbackMessage.style.display = 'block';
                }
            }
        }
        
        updateButtonStates();
        updateProgressTracking();
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

// Time tracking
let startTime = Date.now();

function startTimeTracking() {
    startTime = Date.now();
}

function getTimeSpent() {
    return Math.round((Date.now() - startTime) / 1000); // seconds
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `lesson-notification ${type}`;
    
    const icons = {
        success: '✅',
        celebration: '🎉',
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--${type === 'success' || type === 'celebration' ? 'success' : type === 'warning' ? 'warning' : type === 'error' ? 'error' : 'info'}-color);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, type === 'celebration' ? 4000 : 3000);
}

// Add smooth scrolling for any anchor links
function addSmoothScrolling() {
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
}

// Complete lesson and navigate to next
function completeLessonAndContinue() {
    // Mark lesson complete with progress tracker
    if (window.markLessonComplete) {
        window.markLessonComplete(100);
    }
    
    // Save final progress
    saveProgress();
    
    // Show completion notification
    showNotification('Lesson 0 completed! Redirecting to Lesson 1...', 'celebration');
    
    // Navigate to next lesson after a short delay
    setTimeout(() => {
        // Navigate to Lesson 1 (HTML Basics)
        window.location.href = '../part_1/lesson_1/lesson_1.html';
    }, 2000);
}

// Update the onclick handler - need to modify the HTML button
// For now, let's override the existing markLessonComplete function
window.markLessonComplete = function(score = 100) {
    // Use the lesson protection system to mark complete
    if (window.lessonProtection) {
        window.lessonProtection.markCurrentLessonComplete(score);
    }
    
    // Save progress
    saveProgress();
    
    // Navigate to next lesson
    setTimeout(() => {
        window.location.href = '../part_1/lesson_1/lesson_1.html';
    }, 2000);
};

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Press 'C' to continue to next section
    if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.metaKey) {
        const activeOutline = document.querySelector('.outline-item.active');
        if (activeOutline) {
            const nextOutline = activeOutline.nextElementSibling;
            if (nextOutline && nextOutline.classList.contains('outline-item')) {
                nextOutline.click();
            }
        }
    }
    
    // Press 'R' to review (scroll to top)
    if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});