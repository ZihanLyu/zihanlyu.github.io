//NEED MODIFICATION
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createTaskBtn = document.getElementById('create-task-btn');
    const taskFormContainer = document.getElementById('task-form-container');
    const taskForm = document.getElementById('task-form');
    const cancelTaskBtn = document.getElementById('cancel-task');
    const tabs = document.querySelectorAll('.tab');
    const taskLists = document.querySelectorAll('.task-list');
    const activeTasksContainer = document.getElementById('active-tasks-container');
    const completedTasksContainer = document.getElementById('completed-tasks-container');
    const usernameElement = document.getElementById('username');

    // User state
    let currentUser = null;
    let tasks = [];
    let countdownIntervals = [];

    // Check if user is logged in
    checkLoginStatus();
        
        // Send login request to server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                showTaskApp();
                loadTasks();
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login. Please try again.');
        });
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        // Send registration request to server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                name: name,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful! Please log in.');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during registration. Please try again.');
        });
    });

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Send logout request to server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'logout'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = null;
                showLoginForm();
                clearCountdownIntervals();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    createTaskBtn.addEventListener('click', function() {
        taskFormContainer.style.display = 'block';
    });

    cancelTaskBtn.addEventListener('click', function() {
        taskFormContainer.style.display = 'none';
        taskForm.reset();
    });

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskData = {
            taskName: document.getElementById('task-name').value,
            importance: document.getElementById('importance').value,
            location: document.getElementById('location').value || null,
            deadline: document.getElementById('deadline').value || null,
            reminder: document.getElementById('reminder').value || null,
            completed: false
        };
        
        // Send create task request to server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'createTask',
                task: taskData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                taskData.id = data.taskId;
                tasks.push(taskData);
                renderTasks();
                taskFormContainer.style.display = 'none';
                taskForm.reset();
            } else {
                alert('Failed to create task: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the task. Please try again.');
        });
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding task list
            taskLists.forEach(list => {
                if (list.id === targetTab) {
                    list.style.display = 'block';
                } else {
                    list.style.display = 'none';
                }
            });
        });
    });

    // Functions
    function checkLoginStatus() {
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'checkLogin'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                currentUser = data.user;
                showTaskApp();
                loadTasks();
            } else {
                showLoginForm();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showLoginForm();
        });
    }

    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        taskApp.style.display = 'none';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        usernameElement.textContent = 'Not logged in';
    }

    function showTaskApp() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        taskApp.style.display = 'block';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        usernameElement.textContent = currentUser.name;
    }

    function loadTasks() {
        // Clear any existing countdown intervals
        clearCountdownIntervals();
        
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'getTasks'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                tasks = data.tasks;
                renderTasks();
            } else {
                alert('Failed to load tasks: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading tasks. Please try again.');
        });
    }

    function renderTasks() {
        // Clear existing tasks and countdowns
        activeTasksContainer.innerHTML = '';
        completedTasksContainer.innerHTML = '';
        clearCountdownIntervals();
        
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            
            if (task.completed) {
                completedTasksContainer.appendChild(taskElement);
            } else {
                activeTasksContainer.appendChild(taskElement);
                
                // Setup countdown if reminder exists
                if (task.reminder) {
                    setupCountdown(task, taskElement.querySelector('.task-countdown'));
                }
            }
        });
    }

    function createTaskElement(task) {
        const template = document.getElementById('task-template');
        const taskElement = template.cloneNode(true);
        taskElement.style.display = 'block';
        taskElement.id = '';
        
        // Fill in task details
        const checkbox = taskElement.querySelector('.complete-checkbox');
        checkbox.checked = task.completed;
        checkbox.dataset.taskId = task.id;
        checkbox.addEventListener('change', toggleTaskCompletion);
        
        taskElement.querySelector('.task-title').textContent = task.taskName;
        
        const importanceEl = taskElement.querySelector('.task-importance');
        if (task.importance > 0) {
            const importanceSymbols = ['', '!', '!!', '!!!'];
            importanceEl.textContent = importanceSymbols[task.importance];
        } else {
            importanceEl.style.display = 'none';
        }
        
        const locationEl = taskElement.querySelector('.task-location');
        if (task.location) {
            locationEl.textContent = `📍 ${task.location}`;
        } else {
            locationEl.style.display = 'none';
        }
        
        const deadlineEl = taskElement.querySelector('.task-deadline');
        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            deadlineEl.textContent = `⏰ Due: ${formatDate(deadlineDate)}`;
        } else {
            deadlineEl.style.display = 'none';
        }
        
        const reminderEl = taskElement.querySelector('.task-reminder');
        if (task.reminder) {
            const reminderDate = new Date(task.reminder);
            reminderEl.textContent = `🔔 Reminder: ${formatDate(reminderDate)}`;
        } else {
            reminderEl.style.display = 'none';
        }
        
        const deleteBtn = taskElement.querySelector('.delete-task');
        deleteBtn.dataset.taskId = task.id;
        deleteBtn.addEventListener('click', deleteTask);
        
        return taskElement;
    }

    function toggleTaskCompletion(e) {
        const taskId = this.dataset.taskId;
        const completed = this.checked;
        
        // Send update task request to server
        fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'updateTask',
                taskId: taskId,
                updates: { completed: completed }
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update local tasks array
                const taskIndex = tasks.findIndex(t => t.id == taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].completed = completed;
                    renderTasks();
                }
            } else {
                alert('Failed to update task: ' + data.message);
                // Revert checkbox state
                this.checked = !completed;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the task. Please try again.');
            // Revert checkbox state
            this.checked = !completed;
        });
    }

    function deleteTask() {
        const taskId = this.dataset.taskId;
        
        if (confirm('Are you sure you want to delete this task?')) {
            // Send delete task request to server
            fetch('api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'deleteTask',
                    taskId: taskId
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove task from local array
                    tasks = tasks.filter(t => t.id != taskId);
                    renderTasks();
                } else {
                    alert('Failed to delete task: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the task. Please try again.');
            });
        }
    }

    function setupCountdown(task, countdownElement) {
        const reminderDate = new Date(task.reminder);
        
        // Only set up countdown if reminder time is in the future
        if (reminderDate > new Date()) {
            updateCountdown(reminderDate, countdownElement);
            
            const intervalId = setInterval(() => {
                updateCountdown(reminderDate, countdownElement);
            }, 1000);
            
            countdownIntervals.push(intervalId);
        } else {
            countdownElement.style.display = 'none';
        }
    }

    function updateCountdown(targetDate, element) {
        const now = new Date();
        const timeLeft = targetDate - now;
        
        if (timeLeft <= 0) {
            element.textContent = 'Reminder now!';
            showNotification(element.closest('.task').querySelector('.task-title').textContent);
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Format countdown text
        let countdownText = '';
        if (days > 0) {
            countdownText = `${days}d ${hours}h`;
        } else if (hours > 0) {
            countdownText = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            countdownText = `${minutes}m ${seconds}s`;
        } else {
            countdownText = `${seconds}s`;
        }
        
        element.textContent = `⏱️ ${countdownText}`;
        element.style.display = 'inline-block';
    }

    function clearCountdownIntervals() {
        countdownIntervals.forEach(intervalId => clearInterval(intervalId));
        countdownIntervals = [];
    }

    function showNotification(taskName) {
        // Check if browser supports notifications
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification('Task Reminder', {
                    body: `Reminder for task: ${taskName}`
                });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification('Task Reminder', {
                            body: `Reminder for task: ${taskName}`
                        });
                    }
                });
            }
        }
    }

    function formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString(undefined, options);
    }
});