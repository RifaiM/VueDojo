// Lesson 3 JavaScript - JavaScript Basics
let clickCount = 0;
let colorIndex = 0;
const colors = ["#667eea", "#764ba2", "#ffd700", "#4ecdc4", "#ff6b6b", "#90ee90"];

document.addEventListener('DOMContentLoaded', function() {
    initializeLesson3();
    setupScrollSpying();
    updateProgressTracking();
    startInteractiveDemos();
});

// Initialize lesson functionality
function initializeLesson3() {
    setupOutlineNavigation();
    setupProjectValidation();
    setupCompletionTracking();
    addSmoothScrolling();
    startTimeTracking();
    loadProgress();
    setupInteractiveExamples();
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

// Start interactive demos in introduction
function startInteractiveDemos() {
    // Update current time
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Setup interactive button
    const interactiveBtn = document.getElementById('interactive-btn');
    const clickCountDisplay = document.getElementById('click-count');
    const dynamicGreeting = document.getElementById('dynamic-greeting');
    
    if (interactiveBtn && clickCountDisplay) {
        interactiveBtn.addEventListener('click', function() {
            clickCount++;
            clickCountDisplay.textContent = clickCount;
            
            // Change greeting based on clicks
            if (dynamicGreeting) {
                if (clickCount === 1) {
                    dynamicGreeting.textContent = "Thanks for clicking!";
                } else if (clickCount === 5) {
                    dynamicGreeting.textContent = "You're getting the hang of this!";
                } else if (clickCount === 10) {
                    dynamicGreeting.textContent = "JavaScript Master! 🎉";
                } else if (clickCount > 10) {
                    dynamicGreeting.textContent = "Keep going! 🚀";
                }
            }
        });
    }
}

// Update current time display
function updateCurrentTime() {
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        timeDisplay.textContent = timeString;
    }
}

// Interactive example functions
function demonstrateStrings() {
    const demo = document.querySelector('#string-demo .demo-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>let name = "JavaScript";</strong></p>
                <p>✓ name.toUpperCase() = "JAVASCRIPT"</p>
                <p>✓ name.length = 10</p>
                <p>✓ "Hello, " + name = "Hello, JavaScript"</p>
            </div>
        `;
        demo.style.background = '#e8f5e9';
        demo.style.border = '2px solid #4caf50';
    }
}

function demonstrateNumbers() {
    const demo = document.querySelector('#number-demo .demo-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>let x = 10; let y = 3;</strong></p>
                <p>✓ x + y = 13</p>
                <p>✓ x * y = 30</p>
                <p>✓ x / y = 3.33</p>
                <p>✓ x % y = 1 (remainder)</p>
            </div>
        `;
        demo.style.background = '#e3f2fd';
        demo.style.border = '2px solid #2196f3';
    }
}

function demonstrateBooleans() {
    const demo = document.querySelector('#boolean-demo .demo-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>Boolean operations:</strong></p>
                <p>✓ true && false = false</p>
                <p>✓ true || false = true</p>
                <p>✓ 5 > 3 = true</p>
                <p>✓ !true = false</p>
            </div>
        `;
        demo.style.background = '#fff3e0';
        demo.style.border = '2px solid #ff9800';
    }
}

function demonstrateArrays() {
    const demo = document.querySelector('#array-demo .demo-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>let fruits = ["apple", "banana"];</strong></p>
                <p>✓ fruits[0] = "apple"</p>
                <p>✓ fruits.length = 2</p>
                <p>✓ fruits.push("orange") → ["apple", "banana", "orange"]</p>
            </div>
        `;
        demo.style.background = '#f3e5f5';
        demo.style.border = '2px solid #9c27b0';
    }
}

function demonstrateSimpleFunctions() {
    const demo = document.getElementById('simple-functions-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>✓ Functions executed!</strong></p>
                <p>sayHello() returned: <span style="color: #4caf50;">"Hello World!"</span></p>
                <p>addNumbers(5, 3) returned: <span style="color: #4caf50;">8</span></p>
                <p style="margin-top: 10px; font-style: italic; color: #666;">Functions make code reusable! 🎉</p>
            </div>
        `;
        demo.style.background = '#e8f5e9';
        demo.style.border = '2px solid #4caf50';
    }
}

function demonstrateMathFunctions() {
    const demo = document.getElementById('math-functions-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>✓ Math calculations complete!</strong></p>
                <p>calculateArea(10, 5) = <span style="color: #2196f3;">50 square units</span></p>
                <p>applyDiscount(100, 20) = <span style="color: #2196f3;">$80</span> (20% off)</p>
                <p style="margin-top: 10px; font-style: italic; color: #666;">Math functions solve real problems! 🧮</p>
            </div>
        `;
        demo.style.background = '#e3f2fd';
        demo.style.border = '2px solid #2196f3';
    }
}

function demonstrateIfStatements() {
    const demo = document.getElementById('if-statements-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>✓ Testing different ages:</strong></p>
                <p>age = 16: <span style="color: #ff9800;">"You're a minor"</span> and <span style="color: #ff9800;">"Teenager"</span></p>
                <p>age = 20: <span style="color: #4caf50;">"You're an adult"</span> and <span style="color: #4caf50;">"Adult"</span></p>
                <p>age = 12: <span style="color: #ff9800;">"You're a minor"</span> and <span style="color: #2196f3;">"Child"</span></p>
                <p style="margin-top: 10px; font-style: italic; color: #666;">If statements make decisions! 🤔</p>
            </div>
        `;
        demo.style.background = '#fff3e0';
        demo.style.border = '2px solid #ff9800';
    }
}

function demonstrateLoops() {
    const demo = document.getElementById('loops-result');
    if (demo) {
        demo.innerHTML = `
            <div style="text-align: left; line-height: 1.8;">
                <p><strong>✓ Loops executed!</strong></p>
                <p><strong>For loop:</strong> Count: 1, 2, 3, 4, 5</p>
                <p><strong>While loop:</strong> Loop: 1, 2, 3</p>
                <p><strong>Array loop:</strong> Color: red, green, blue</p>
                <p style="margin-top: 10px; font-style: italic; color: #666;">Loops repeat code automatically! 🔄</p>
            </div>
        `;
        demo.style.background = '#f3e5f5';
        demo.style.border = '2px solid #9c27b0';
    }
}

// DOM Playground functions
function changeTitle() {
    const title = document.getElementById('demo-title');
    if (title) {
        const newTitles = [
            'Title Changed! 🎉',
            'JavaScript is Awesome!',
            'DOM Manipulation Works!',
            'You Did It!',
            'Change Me!'
        ];
        const randomTitle = newTitles[Math.floor(Math.random() * newTitles.length)];
        title.textContent = randomTitle;
        title.style.color = colors[Math.floor(Math.random() * colors.length)];
    }
}

function changeText() {
    const text = document.getElementById('demo-text');
    if (text) {
        const newTexts = [
            'Text successfully modified with JavaScript!',
            'This is the power of DOM manipulation',
            'JavaScript can change any element',
            'You are learning so fast!',
            'This text can be modified'
        ];
        const randomText = newTexts[Math.floor(Math.random() * newTexts.length)];
        text.textContent = randomText;
        text.style.fontStyle = text.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
}

function changeColor() {
    const box = document.getElementById('demo-box');
    if (box) {
        colorIndex = (colorIndex + 1) % colors.length;
        box.style.backgroundColor = colors[colorIndex];
        box.style.transform = 'scale(1.1)';
        setTimeout(() => {
            box.style.transform = 'scale(1)';
        }, 300);
    }
}

function addElement() {
    const target = document.getElementById('playground-target');
    if (target) {
        const newElement = document.createElement('p');
        const elementCount = target.querySelectorAll('p').length;
        newElement.textContent = `New element #${elementCount + 1} added!`;
        newElement.style.background = colors[elementCount % colors.length];
        newElement.style.color = 'white';
        newElement.style.padding = '8px';
        newElement.style.borderRadius = '6px';
        newElement.style.margin = '5px 0';
        newElement.style.animation = 'fadeIn 0.5s ease';
        target.appendChild(newElement);
    }
}

function resetPlayground() {
    const title = document.getElementById('demo-title');
    const text = document.getElementById('demo-text');
    const box = document.getElementById('demo-box');
    const target = document.getElementById('playground-target');
    
    if (title) {
        title.textContent = 'Change Me!';
        title.style.color = '#667eea';
    }
    
    if (text) {
        text.textContent = 'This text can be modified';
        text.style.fontStyle = 'normal';
    }
    
    if (box) {
        box.style.backgroundColor = '#17a2b8';
        box.style.transform = 'scale(1)';
    }
    
    if (target) {
        const addedElements = target.querySelectorAll('p');
        addedElements.forEach(el => {
            if (el.textContent.includes('New element')) {
                el.remove();
            }
        });
    }
    
    colorIndex = 0;
}

// Setup interactive examples in events section
function setupInteractiveExamples() {
    // Counter button
    const counterBtn = document.getElementById('counter-btn');
    const counterDisplay = document.getElementById('click-counter');
    let counter = 0;
    
    if (counterBtn && counterDisplay) {
        counterBtn.addEventListener('click', function() {
            counter++;
            counterDisplay.textContent = counter;
            
            // Add visual feedback
            counterBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                counterBtn.style.transform = 'scale(1)';
            }, 100);
        });
    }
    
    // Color changer
    const colorChangeBtn = document.getElementById('change-color-btn');
    const colorBox = document.getElementById('color-box');
    let colorIdx = 0;
    
    if (colorChangeBtn && colorBox) {
        colorChangeBtn.addEventListener('click', function() {
            colorIdx = (colorIdx + 1) % colors.length;
            colorBox.style.backgroundColor = colors[colorIdx];
        });
        
        colorBox.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        colorBox.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Text input
    const textInput = document.getElementById('text-input');
    const outputDisplay = document.getElementById('output-display');
    
    if (textInput && outputDisplay) {
        textInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                outputDisplay.textContent = 'Your text will appear here...';
                outputDisplay.style.color = '#6c757d';
            } else {
                outputDisplay.textContent = 'You typed: ' + this.value;
                outputDisplay.style.color = '#28a745';
            }
        });
        
        textInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                outputDisplay.style.color = '#007bff';
                outputDisplay.textContent = '🎉 Enter pressed! You typed: ' + this.value;
            }
        });
    }
    
    // Dynamic list
    const listInput = document.getElementById('list-input');
    const addItemBtn = document.getElementById('add-item-btn');
    const dynamicList = document.getElementById('dynamic-list');
    
    if (listInput && addItemBtn && dynamicList) {
        function addListItem() {
            const value = listInput.value.trim();
            if (value !== '') {
                const listItem = document.createElement('li');
                listItem.textContent = value;
                listItem.style.opacity = '0';
                listItem.style.transform = 'translateY(-10px)';
                dynamicList.appendChild(listItem);
                
                // Animate in
                setTimeout(() => {
                    listItem.style.transition = 'all 0.3s ease';
                    listItem.style.opacity = '1';
                    listItem.style.transform = 'translateY(0)';
                }, 10);
                
                listInput.value = '';
                listInput.focus();
            }
        }
        
        addItemBtn.addEventListener('click', addListItem);
        
        listInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                addListItem();
            }
        });
    }
}

// Copy code function
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;
    
    const text = codeElement.textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('JavaScript code copied to clipboard!', 'success');
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
        showNotification('JavaScript code copied to clipboard!', 'success');
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
                item.style.background = 'rgba(40, 167, 69, 0.1)';
                setTimeout(() => {
                    item.style.background = '';
                }, 1000);
            }
        });
    });
}

// Update project progress
function updateProjectProgress() {
    // Variables practice checkboxes
    const variableCheckboxes = document.querySelectorAll('#variables .practice-checklist input[type="checkbox"]');
    const variablesComplete = Array.from(variableCheckboxes).every(cb => cb.checked);
    
    // Functions practice checkboxes
    const functionCheckboxes = document.querySelectorAll('#functions .practice-checklist input[type="checkbox"]');
    const functionsComplete = Array.from(functionCheckboxes).every(cb => cb.checked);
    
    // DOM practice checkboxes
    const domCheckboxes = document.querySelectorAll('#dom .practice-checklist input[type="checkbox"]');
    const domComplete = Array.from(domCheckboxes).every(cb => cb.checked);
    
    // Events practice checkboxes
    const eventCheckboxes = document.querySelectorAll('#events .practice-checklist input[type="checkbox"]');
    const eventsComplete = Array.from(eventCheckboxes).every(cb => cb.checked);
    
    // Project validation checkboxes (final interactive project)
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
        const allPracticeComplete = variablesComplete && functionsComplete && domComplete && eventsComplete;
        completeLessonBtn.disabled = !(allPracticeComplete && projectComplete);
    }
    
    // Update next lesson button
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    if (nextLessonBtn) {
        const allComplete = variablesComplete && functionsComplete && domComplete && eventsComplete && projectComplete;
        if (allComplete) {
            nextLessonBtn.classList.remove('disabled');
            nextLessonBtn.onclick = () => goToNextLesson();
        }
    }
    
    // Calculate total progress
    const totalTasks = variableCheckboxes.length + functionCheckboxes.length + 
                      domCheckboxes.length + eventCheckboxes.length + projectCheckboxes.length;
    const completedTasks = Array.from(variableCheckboxes).filter(cb => cb.checked).length +
                          Array.from(functionCheckboxes).filter(cb => cb.checked).length +
                          Array.from(domCheckboxes).filter(cb => cb.checked).length +
                          Array.from(eventCheckboxes).filter(cb => cb.checked).length +
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
    const variablesComplete = Array.from(document.querySelectorAll('#variables .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const functionsComplete = Array.from(document.querySelectorAll('#functions .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const domComplete = Array.from(document.querySelectorAll('#dom .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const eventsComplete = Array.from(document.querySelectorAll('#events .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const projectComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (projectComplete && variablesComplete && functionsComplete && domComplete && eventsComplete) {
        showNotification('Fantastic! Your JavaScript interactive project is complete!', 'celebration');
        
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
        let missingSection = '';
        if (!variablesComplete) missingSection = 'Variables & Data Types practice';
        else if (!functionsComplete) missingSection = 'Functions & Logic practice';
        else if (!domComplete) missingSection = 'DOM Manipulation practice';
        else if (!eventsComplete) missingSection = 'Events & Interactivity practice';
        else if (!projectComplete) missingSection = 'Interactive Profile project';
        
        showNotification(`Please complete the ${missingSection} first!`, 'warning');
        
        // Scroll to the incomplete section
        const sections = ['variables', 'functions', 'dom', 'events', 'mini-project'];
        const incompleteStates = [!variablesComplete, !functionsComplete, !domComplete, !eventsComplete, !projectComplete];
        
        for (let i = 0; i < incompleteStates.length; i++) {
            if (incompleteStates[i]) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }, 1000);
                }
                break;
            }
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
    localStorage.setItem('vue_learning_lesson3_feedback', rating);
    
    showNotification('Thank you for your feedback!', 'info');
}

// Review lesson function
function reviewLesson() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Reviewing from the beginning. Take your time!', 'info');
}

// Go to next lesson (Lesson 4)
function goToNextLesson() {
    showNotification('Great progress! Moving to JavaScript Interactivity...', 'celebration');
    setTimeout(() => {
        window.location.href = '../lesson_4/lesson_4.html';
    }, 2000);
}

// Setup completion tracking
function setupCompletionTracking() {
    updateProgressTracking();
}

// Update progress tracking
function updateProgressTracking() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalTasks = allCheckboxes.length;
    const completedTasks = Array.from(allCheckboxes).filter(cb => cb.checked).length;
    
    updateNavigationProgress(completedTasks, totalTasks);
}

// Save progress to localStorage
function saveProgress() {
    const progress = {
        checkboxes: {},
        completedAt: new Date().toISOString(),
        timeSpent: getTimeSpent(),
        clickCount: clickCount,
        colorIndex: colorIndex
    };
    
    // Save checkbox states
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        progress.checkboxes[checkbox.id] = checkbox.checked;
    });
    
    // Save feedback
    const feedback = localStorage.getItem('vue_learning_lesson3_feedback');
    if (feedback) {
        progress.feedback = feedback;
    }
    
    localStorage.setItem('vue_learning_lesson3_progress', JSON.stringify(progress));
    updateProgressTracking();
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('vue_learning_lesson3_progress');
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
        
        // Restore other state
        if (progress.clickCount) {
            clickCount = progress.clickCount;
        }
        if (progress.colorIndex) {
            colorIndex = progress.colorIndex;
        }
        
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
    // Check if all practices are complete
    const variablesComplete = Array.from(document.querySelectorAll('#variables .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const functionsComplete = Array.from(document.querySelectorAll('#functions .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const domComplete = Array.from(document.querySelectorAll('#dom .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const eventsComplete = Array.from(document.querySelectorAll('#events .practice-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    const projectComplete = Array.from(document.querySelectorAll('.validation-checklist input[type="checkbox"]'))
        .every(cb => cb.checked);
    
    if (!variablesComplete) {
        showNotification('Please complete the Variables & Data Types practice first!', 'warning');
        const section = document.getElementById('variables');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    if (!functionsComplete) {
        showNotification('Please complete the Functions & Logic practice first!', 'warning');
        const section = document.getElementById('functions');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    if (!domComplete) {
        showNotification('Please complete the DOM Manipulation practice first!', 'warning');
        const section = document.getElementById('dom');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    if (!eventsComplete) {
        showNotification('Please complete the Events & Interactivity practice first!', 'warning');
        const section = document.getElementById('events');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    if (!projectComplete) {
        showNotification('Please complete the Interactive Profile project first!', 'warning');
        const section = document.getElementById('mini-project');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        return false;
    }
    
    // Use the lesson protection system to mark complete
    if (window.lessonProtection) {
        window.lessonProtection.markCurrentLessonComplete(score);
    }
    
    // Use global progress tracker if available
    if (window.progressTracker) {
        window.progressTracker.markLessonComplete('lesson_3', score);
    }
    
    // Save local progress
    saveProgress();
    
    // Show completion message
    showNotification('Amazing! JavaScript Basics completed. Welcome to the world of programming!', 'celebration');
    
    // Navigate to next lesson (Part 2)
    setTimeout(() => {
        goToNextLesson();
    }, 3000);
    
    return true;
};

// Interactive JavaScript demo functions
function demonstrateVariable(type) {
    showNotification(`Demonstrating ${type} variables`, 'info');
}

function showJavaScriptTip(tip) {
    showNotification(tip, 'info');
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
    
    // Press 'T' to test interactive demos
    if (event.key.toLowerCase() === 't' && !event.ctrlKey && !event.metaKey) {
        // Test all interactive demos
        demonstrateStrings();
        setTimeout(() => demonstrateNumbers(), 2000);
        setTimeout(() => demonstrateBooleans(), 4000);
        setTimeout(() => demonstrateArrays(), 6000);
    }
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(event) {
    konamiCode.push(event.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        showNotification('🎮 Konami Code activated! You found the JavaScript Easter egg!', 'celebration');
        
        // Fun animation
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Add CSS for rainbow animation
const style = document.createElement('style');
style.textContent = `
@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
    100% { filter: hue-rotate(360deg); }
}
`;
document.head.appendChild(style);
