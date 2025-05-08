document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const restoreBtn = e.target.closest('.restore-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (restoreBtn) handleRestore(e);
        if (deleteBtn) handleDelete(e);
    });

    // Clear History Button
    const clearBtn = document.getElementById('clear-history-btn');
    if (clearBtn) clearBtn.addEventListener('click', handleClearHistory);
});

async function handleRestore(e) {
    const taskId = e.target.dataset.id;
    if (!taskId) return;

    try {
        const formData = new FormData();
        formData.append('action', 'restoreTask');
        formData.append('taskId', taskId);

        const response = await fetch('history.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                historyItem.remove();
                checkEmptyState();
            }
        }
    } catch (error) {
        console.error('Restore error:', error);
        showNotification('Error restoring task', 'error');
    }
}

async function handleDelete(e) {
    if (!confirm('Permanently delete this task?')) return;
    
    const taskId = e.target.dataset.id;
    if (!taskId) return;

    try {
        const formData = new FormData();
        formData.append('action', 'deleteTask');
        formData.append('taskId', taskId);

        const response = await fetch('history.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                historyItem.remove();
                checkEmptyState();
            }
        } 
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Error deleting task', 'error');
    }
}

async function handleClearHistory(e) {
    if (!confirm('Clear all history permanently?')) return;

    try {
        const formData = new FormData();
        formData.append('action', 'clearAllHistory');

        const response = await fetch('history.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (data.success) {
            const container = document.querySelector('.history-container');
            if (container) {
                container.innerHTML = `
                    <div class="empty-history">
                        <div class="empty-icon">✓</div>
                        <h3>No completed tasks yet</h3>
                        <p>Tasks you complete will appear here</p>
                        <a href="home.php" class="primary-btn">Go to tasks</a>
                    </div>
                `;
            }
            if (e.target) e.target.remove();
            showNotification('History cleared successfully', 'success');
        } else {
            showNotification('Failed to clear history', 'error');
        }
    } catch (error) {
        console.error('Clear history error:', error);
        showNotification('Error clearing history', 'error');
    }
}

function checkEmptyState() {
    const historyItems = document.querySelectorAll('.history-item');
    const container = document.querySelector('.history-container');
    const clearBtn = document.getElementById('clear-history-btn');

    if (historyItems.length === 0 && container) {
        container.innerHTML = `
            <div class="empty-history">
                <div class="empty-icon">✓</div>
                <h3>No completed tasks yet</h3>
                <p>Tasks you complete will appear here</p>
                <a href="home.php" class="primary-btn">Go to tasks</a>
            </div>
        `;
        if (clearBtn) clearBtn.remove();
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification); // add this to DOM
    
    // auto-remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}