// DO NOT USE FETCH (AWAIT) - CHANGE IT INTO AJAX
document.addEventListener('DOMContentLoaded', function() {
    window.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('user_timezone').value = window.userTimezone; // get the user timezone
    
    const editTimezoneInput = document.getElementById('editUserTimezone');
    if (editTimezoneInput) {
        editTimezoneInput.value = window.userTimezone;
    }

    initializeModals();
});

function initializeModals() {
    const modals = {
        taskModal: document.getElementById('taskModal'),
        taskDetailsModal: document.getElementById('taskDetailsModal'),
        editTaskModal: document.getElementById('editTaskModal'),
        sectionModal: document.getElementById('sectionModal') 
    };

    // 'Add Section' Button
    const addSectionBtn = document.getElementById('addSectionBtn');
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            modals.sectionModal.style.display = 'block';
        });
    }

    // Close Task Card
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            Object.values(modals).forEach(m => {
                if (m) m.style.display = 'none';
            });
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            Object.values(modals).forEach(m => {
                if (m) m.style.display = 'none';
            });
        }
    });

    // Add Task Button
    document.getElementById('addTaskBtn')?.addEventListener('click', () => {
        document.getElementById('taskStatus').value = 'new';
        document.getElementById('user_timezone').value = window.userTimezone;
        modals.taskModal.style.display = 'block';
    });

    document.querySelectorAll('.add-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const status = e.target.dataset.status || 'new';
            document.getElementById('taskStatus').value = status;
            document.getElementById('user_timezone').value = window.userTimezone;
            modals.taskModal.style.display = 'block';
        });
    });
}

document.addEventListener('click', async (e) => {
    // Handle Task Completion
    if (e.target.classList.contains('task-checkbox')) {
        const taskId = e.target.dataset.id;
        const taskCard = e.target.closest('.task-card');

        if (!confirm('Are you sure you want to mark this task as completed?')) return;

        try {
            const formData = new FormData();
            formData.append('action', 'completeTask');
            formData.append('taskId', taskId);
            formData.append('user_timezone', window.userTimezone);

            const response = await fetch('../php/home.php', { // fetch - read pure js; just use ajax request; await-promisses
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.success) {
                location.reload();
            } else {
                throw new Error(data.message || 'Failed to complete task');
            }
        } catch (error) {
            console.error('Completion error:', error);
            alert(`Error completing task: ${error.message}`);
        }
    }

    // Delete Task
    if (e.target.classList.contains('delete-btn')) {
        const modal = document.getElementById('taskDetailsModal');
        const taskId = modal.dataset.taskId;

        if (!taskId || !confirm('Are you sure you want to permanently delete this task?')) return;

        try {
            const formData = new FormData();
            formData.append('action', 'deleteTask');
            formData.append('taskId', taskId);

            const response = await fetch('../php/home.php', { // CHANGE IT
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.success) {
                modal.style.display = 'none';
                window.location.href = '../php/home.php';
            } else {
                throw new Error(data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Error deleting task: ${error.message}`);
            modal.style.display = 'none';
        }
    }

    // Delete Section
    if (e.target.classList.contains('delete-section-btn')) {
        const sectionId = e.target.dataset.sectionId;
        if (!sectionId || !confirm('Are you sure you want to delete this section? All tasks will be moved to "New tasks".')) return;

        try {
            const formData = new FormData();
            formData.append('action', 'deleteSection');
            formData.append('sectionId', sectionId);

            const response = await fetch('../php/home.php', {  // CHANGE IT
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.success) {
                location.reload();
            } else {
                throw new Error(data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Section delete error:', error);
            alert(`Error deleting section: ${error.message}`);
        }
    }
});

// Display Task Details
document.addEventListener('click', async (e) => {
    const taskCard = e.target.closest('.task-card');
    // skip if not clicking a task card or if clicking the checkbox
    if (!taskCard || e.target.classList.contains('task-checkbox')) return;

    const taskId = taskCard.dataset.id;
    try {
        console.log(`Fetching task details for ID: ${taskId}`);
        const response = await fetch(`../php/get_task.php?id=${taskId}`);  // CHANGE IT
        if (!response.ok) {
            console.error(`Server returned ${response.status}: ${response.statusText}`);
            throw new Error('Network response was not ok');
        }
        
        const task = await response.json();
        
        if (task.error) {
            throw new Error(task.error);
        }
        
        document.getElementById('detailsTaskName').textContent = task.name;
        document.getElementById('detailsTaskStatus').textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);
        document.getElementById('detailsTaskCreated').textContent = 
            new Date(task.created_at).toLocaleString();
        
        // Deadline Display - NOT WORKING
        const deadlineRow = document.getElementById('detailsDeadlineRow');
        const deadlineElement = document.getElementById('detailsTaskDeadline');
        if (task.deadline) {
            deadlineRow.style.display = 'flex';
            deadlineElement.textContent = formatTaskDate(task.deadline);
        } else {
            deadlineRow.style.display = 'none';
        }
        
        // Description
        const descContainer = document.getElementById('detailsDescContainer');
        const descElement = document.getElementById('detailsTaskDescription');
        if (task.description) {
            descContainer.style.display = 'block';
            descElement.textContent = task.description;
        } else {
            descContainer.style.display = 'none';
        }
        
        const taskDetailsModal = document.getElementById('taskDetailsModal');
        taskDetailsModal.dataset.taskId = taskId;
        taskDetailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading task:', error);
        alert('Error loading task details');
    }
});

// Date and Time Formating
function formatTaskDate(dateStr) {
    if (!dateStr) return 'None';
    
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    try {
        return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
        return dateStr;
    }
}

// Edit Form Functionality
const editTaskForm = document.querySelector('.edit-task-form');
if (editTaskForm) {
    editTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('../php/home.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Network error');
            
            const data = await response.json();
            if (data.success) {
                document.getElementById('editTaskModal').style.display = 'none';
                window.location.href = '../php/home.php';
            } else {
                throw new Error(data.message || 'Failed to save changes');
            }
        } catch (error) {
            console.error('Edit error:', error);
            alert(`Error saving changes: ${error.message}`);
        }
    });
}

// Section Form Validation Check
const sectionForm = document.querySelector('.section-form');
if (sectionForm) {
    sectionForm.addEventListener('submit', (e) => {
        const sectionName = document.getElementById('sectionName').value.trim();
        if (!sectionName) {
            e.preventDefault();
            alert('Please enter a section name');
            document.getElementById('sectionName').focus();
        }
    });
}

// Notifications - for success or error messages
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('section_added')) {
        showNotification('Section added successfully!', 'success');
    }
    
    if (urlParams.has('error')) {
        const errorType = urlParams.get('error');
        let message = 'An error occurred';
        if (errorType === 'section_failed') message = 'Failed to add section';
        showNotification(message, 'error');
    }
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}