// Lesson 2 JavaScript - CSS Basics
document.addEventListener('DOMContentLoaded', function() {
    initializeLesson2();
    setupScrollSpying();
    updateProgressTracking();
});

// Initialize lesson functionality
function initializeLesson2() {
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
            showNotification('CSS code copied to clipboard!', 'success');
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
        showNotification('CSS code copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Please copy the code manually', 'info');
    }
    
    textArea.remove();
}

// Setup project validation
function setupProjectValidation() {
    const checkboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"], .practice-checklist input[type="checkbox"]');
    
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
    // Practice checkboxes (selector practice)
    const practiceCheckboxes = document.querySelectorAll('.practice-checklist input[type="checkbox"]');
    const practiceComplete = Array.from(practiceCheckboxes).every(cb => cb.checked);
    
    // Project validation checkboxes (final styling project)
    const projectCheckboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"]');
    const projectComplete = Array.from(projectCheckboxes).every(cb => cb.checked);
    
    // Update project complete button
    const projectCompleteBtn = document.getElementById('project-complete-btn');
    if (projectCompleteBtn) {
        projectCompleteBtn.disabled = !projectComplete;
    }
    
    // Update lesson completion button
    const completeLessonBtn = document.getElementById('complete-lesson-btn');
    if (completeLessonBtn) {
        completeLessonBtn.disabled = !(practiceComplete && projectComplete);
    }
    
    // Update next lesson button
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    if (nextLessonBtn && practiceComplete && projectComplete) {
        nextLessonBtn.classList.remove('disabled');
        nextLessonBtn.onclick = () => goToNextLesson();
    }
    
    // Calculate total progress
    const totalTasks = practiceCheckboxes.length + projectCheckboxes.length;
    const completedTasks = Array.from(practiceCheckboxes).filter(cb => cb.checked).length +
                          Array.from(projectCheckboxes).filter(cb => cb.checked).length;
    
    // Update progress in navigation
    updateNavigationProgress(completedTasks, totalTasks);
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
    const practiceComplete = Array.from(document.querySelectorAll('.practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    const projectComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (projectComplete && practiceComplete) {
        showNotification('Amazing work! Your CSS styling project is complete!', 'celebration');
        
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
        if (!practiceComplete) {
            showNotification('Please complete the CSS selector practice first!', 'warning');
        } else {
            showNotification('Please complete all styling checklist items first!', 'warning');
        }
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
    localStorage.setItem('vue_learning_lesson2_feedback', rating);
    
    showNotification('Thank you for your feedback!', 'info');
}

// Review lesson function
function reviewLesson() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Reviewing from the beginning. Take your time!', 'info');
}

// Go to next lesson
function goToNextLesson() {
    window.location.href = '../lesson_3/lesson_3.html';
}

// Setup completion tracking
function setupCompletionTracking() {
    updateProgressTracking();
}

// Update progress tracking
function updateProgressTracking() {
    const practiceCheckboxes = document.querySelectorAll('.practice-checklist input[type="checkbox"]');
    const projectCheckboxes = document.querySelectorAll('.validation-checklist input[type="checkbox"]');
    const totalTasks = practiceCheckboxes.length + projectCheckboxes.length;
    const completedTasks = Array.from(practiceCheckboxes).filter(cb => cb.checked).length +
                          Array.from(projectCheckboxes).filter(cb => cb.checked).length;
    
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
    const feedback = localStorage.getItem('vue_learning_lesson2_feedback');
    if (feedback) {
        progress.feedback = feedback;
    }
    
    localStorage.setItem('vue_learning_lesson2_progress', JSON.stringify(progress));
    updateProgressTracking();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('vue_learning_lesson2_progress');
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
    // Check if both practice and project are complete
    const practiceComplete = Array.from(document.querySelectorAll('.practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    const projectComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (!practiceComplete) {
        showNotification('Please complete the CSS selector practice first!', 'warning');
        // Scroll to selectors section
        const selectorsSection = document.getElementById('selectors');
        if (selectorsSection) {
            selectorsSection.scrollIntoView({ behavior: 'smooth' });
        }
        return false;
    }
    
    if (!projectComplete) {
        showNotification('Please complete the styling project first!', 'warning');
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
        window.progressTracker.markLessonComplete('lesson_2', score);
    }
    
    // Save local progress
    saveProgress();
    
    // Show completion message
    showNotification('Fantastic! Lesson 2 completed. Moving to JavaScript Basics...', 'celebration');
    
    // Navigate to next lesson
    setTimeout(() => {
        goToNextLesson();
    }, 2500);
    
    return true;
};

// Interactive CSS demo functions
function demonstrateSelector(selector) {
    // This would be used for interactive demos
    showNotification(`Demonstrating ${selector} selector`, 'info');
}

function showColorPalette() {
    // Interactive color palette demo
    const colors = ['#667eea', '#764ba2', '#ffd700', '#4ecdc4', '#ff6b6b'];
    const message = `Try these colors: ${colors.join(', ')}`;
    showNotification(message, 'info');
}

function demonstrateFlexbox(property, value) {
    // Interactive flexbox demo
    showNotification(`Try ${property}: ${value} in your CSS!`, 'info');
}

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
    
    // Press 'S' to go to selectors section
    if (event.key.toLowerCase() === 's' && !event.ctrlKey && !event.metaKey) {
        const selectorsSection = document.getElementById('selectors');
        if (selectorsSection) {
            selectorsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
});