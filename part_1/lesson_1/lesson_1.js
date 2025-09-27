// Lesson 1 JavaScript - lesson_1.js
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson1();
    setupScrollSpying();
    updateProgressTracking();
});

// Initialize lesson functionality
function initializeLesson1() {
    setupOutlineNavigation();
    setupProjectValidation();
    setupCompletionTracking();
    addSmoothScrolling();
    startTimeTracking();
    loadProgress();
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

// Copy code function
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;
    
    const text = codeElement.textContent;
    
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

// Toggle solution visibility
function toggleSolution(solutionId) {
    const solution = document.getElementById(solutionId);
    const button = event.target;
    
    if (solution.classList.contains('hidden')) {
        solution.classList.remove('hidden');
        button.textContent = 'Hide Solution';
    } else {
        solution.classList.add('hidden');
        button.textContent = 'Show Example Solution';
    }
}

// Setup project validation
function setupProjectValidation() {
    const checkboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateProjectProgress();
            saveProgress();
            
            // Visual feedback
            const item = this.closest('.checklist-item');
            if (item && this.checked) {
                item.style.background = 'rgba(72, 187, 120, 0.1)';
                setTimeout(() => {
                    item.style.background = '';
                }, 1000);
            }
        });
    });
}

// Update project progress
function updateProjectProgress() {
    const checkboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"]');
    const projectCompleteBtn = document.getElementById('project-complete-btn');
    const completeLessonBtn = document.getElementById('complete-lesson-btn');
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    
    const totalChecks = checkboxes.length;
    const completedChecks = Array.from(checkboxes).filter(cb => cb.checked).length;
    const allComplete = completedChecks === totalChecks;
    
    // Update project complete button
    if (projectCompleteBtn) {
        projectCompleteBtn.disabled = !allComplete;
    }
    
    // Update lesson completion button
    if (completeLessonBtn) {
        completeLessonBtn.disabled = !allComplete;
    }
    
    // Update next lesson button
    if (nextLessonBtn && allComplete) {
        nextLessonBtn.classList.remove('disabled');
        nextLessonBtn.onclick = () => goToNextLesson();
    }
    
    // Update progress in navigation
    updateNavigationProgress(completedChecks, totalChecks);
}

// Update navigation progress
function updateNavigationProgress(completed, total) {
    const progressText = document.querySelector('.progress-text');
    const progressCircle = document.querySelector('.progress-circle');
    
    if (progressText) {
        progressText.textContent = `${completed}/${total}`;
    }
    
    if (progressCircle && completed > 0) {
        const percentage = (completed / total) * 100;
        progressCircle.style.borderColor = percentage === 100 ? 
            'var(--success-color)' : 'var(--warning-color)';
    }
}

// Validate project completion
function validateProject() {
    const allTasksComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (allTasksComplete) {
        showNotification('Outstanding work! Your HTML profile page is complete!', 'celebration');
        
        // Enable lesson completion
        const completeLessonBtn = document.getElementById('complete-lesson-btn');
        if (completeLessonBtn) {
            completeLessonBtn.disabled = false;
        }
        
        // Scroll to completion section
        setTimeout(() => {
            const completionSection = document.getElementById('completion');
            if (completionSection) {
                completionSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
        
        saveProgress();
    } else {
        showNotification('Please complete all checklist items first', 'warning');
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
    localStorage.setItem('vue_learning_lesson1_feedback', rating);
    
    showNotification('Thank you for your feedback!', 'info');
}

// Review lesson function
function reviewLesson() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Reviewing from the beginning. Take your time!', 'info');
}

// Go to next lesson
function goToNextLesson() {
    window.location.href = '../lesson_2/lesson_2.html';
}

// Setup completion tracking
function setupCompletionTracking() {
    updateProgressTracking();
}

// Update progress tracking
function updateProgressTracking() {
    const checkboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"]');
    const totalTasks = checkboxes.length;
    const completedTasks = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    updateNavigationProgress(completedTasks, totalTasks);
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
    const feedback = localStorage.getItem('vue_learning_lesson1_feedback');
    if (feedback) {
        progress.feedback = feedback;
    }
    
    localStorage.setItem('vue_learning_lesson1_progress', JSON.stringify(progress));
    updateProgressTracking();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('vue_learning_lesson1_progress');
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
        
        updateProjectProgress();
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
    return Math.round((Date.now() - startTime) / 1000);
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

// Add smooth scrolling
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

// Override the global completion function for this lesson
window.markLessonComplete = function(score = 100) {
    // Check if project is complete
    const allTasksComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (!allTasksComplete) {
        showNotification('Please complete the profile page project first!', 'warning');
        // Scroll to project section
        const projectSection = document.getElementById('mini-project');
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: 'smooth' });
        }
        return false;
    }
    
    // Use the lesson protection system to mark complete
    if (window.lessonProtection) {
        window.lessonProtection.markCurrentLessonComplete(score);
    }
    
    // Use global progress tracker if available
    if (window.progressTracker) {
        window.progressTracker.markLessonComplete('lesson_1', score);
    }
    
    // Save local progress
    saveProgress();
    
    // Show completion message
    showNotification('Excellent! Lesson 1 completed. Moving to CSS Basics...', 'celebration');
    
    // Navigate to next lesson
    setTimeout(() => {
        goToNextLesson();
    }, 2500);
    
    return true;
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
    
    // Press 'P' to go to project section
    if (event.key.toLowerCase() === 'p' && !event.ctrlKey && !event.metaKey) {
        const projectSection = document.getElementById('mini-project');
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});