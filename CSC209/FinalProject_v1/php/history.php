<?php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}

function load_tasks() {
    $file = '../json/tasks.json';
    return file_exists($file) ? json_decode(file_get_contents($file), true) : [];
}

function save_tasks($tasks) {
    file_put_contents('../json/tasks.json', json_encode($tasks, JSON_PRETTY_PRINT));
}

function load_users() {
    $file = '../json/users.json';
    return file_exists($file) ? json_decode(file_get_contents($file), true) : [];
}

$users = load_users();
$email = $_SESSION['user'] ?? '';
$avatar = $_SESSION['avatar'] ?? '../images/default-avatar.png';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $taskId = $_POST['taskId'] ?? '';
    $tasks = load_tasks();

    if ($action === 'restoreTask' && $taskId) {
        if (isset($tasks['history'][$email][$taskId])) {
            $task = $tasks['history'][$email][$taskId];
            $task['completed'] = false;
            unset($task['completed_at']);
            $tasks[$email][$taskId] = $task;
            unset($tasks['history'][$email][$taskId]);
            save_tasks($tasks);
            echo json_encode(['success' => true]);
            exit;
        }
    }

    // Delete task handler
    if ($action === 'deleteTask' && $taskId) {
        if (isset($tasks['history'][$email][$taskId])) {
            unset($tasks['history'][$email][$taskId]);
            save_tasks($tasks);
            echo json_encode(['success' => true]);
            exit;
        }
    }

    // Clear all history handler
    if ($action === 'clearAllHistory') {
        $tasks['history'][$email] = [];
        save_tasks($tasks);
        echo json_encode(['success' => true]);
        exit;
    }

    echo json_encode(['success' => false]);
    exit;
}

// Date formatting function
function formatDateTime($dateStr) {
    if (!$dateStr) return '';
    $date = new DateTime($dateStr);
    $today = new DateTime('today');
    
    return match ($date->format('Y-m-d')) {
        $today->format('Y-m-d') => 'Today at ' . $date->format('g:i A'),
        $today->modify('-1 day')->format('Y-m-d') => 'Yesterday at ' . $date->format('g:i A'),
        default => $date->format('M j, Y') . ' at ' . $date->format('g:i A')
    };
}

// Load and group tasks
$tasks = load_tasks();
$userHistory = $tasks['history'][$email] ?? [];
$groupedHistory = [];

foreach ($userHistory as $taskId => $task) {
    $date = $task['completed_at'] ?? $task['created_at'];
    $monthYear = date('F Y', strtotime($date));
    $groupedHistory[$monthYear][$taskId] = $task;
}

krsort($groupedHistory);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task History - Post-it</title>
    <link rel="stylesheet" href="../css/history.css">
    <link id="theme-link" rel="stylesheet" href="../css/animation.css">
</head>
<body>
    <header>
        <h1>Post-it</h1>
        <div class="dropdown">
        <a><img src="<?= htmlspecialchars($avatar) ?>" alt="Profile" style="width:42px;height:42px; border-radius:50%;"></a>
            <div class="dropdown-content" style="position: relative;">
                <a href="home.php">Active Tasks</a>
                <a href="history.php">History</a>
                <a href="logout.php">Logout</a>
            </div>
        </div>
    </header>

    <div class="container">
        <div class="history-header">
            <h2>Completed Tasks</h2>
            <?php if (!empty($groupedHistory)): ?>
                <button id="clear-history-btn" class="secondary-btn">Clear All History</button>
            <?php endif; ?>
        </div>

        <div class="history-container">
            <?php if (empty($groupedHistory)): ?>
                <div class="empty-history">
                    <div class="empty-icon">✓</div>
                    <h3>No completed tasks yet</h3>
                    <p>Tasks you complete will appear here</p>
                    <a href="home.php" class="primary-btn">Go to tasks</a>
                </div>
            <?php else: ?>
                <?php foreach ($groupedHistory as $month => $tasks): ?>
                    <div class="history-group">
                        <h3><?= htmlspecialchars($month) ?></h3>
                        <div class="history-list">
                            <?php foreach ($tasks as $taskId => $task): ?>
                                <div class="history-item" data-id="<?= htmlspecialchars($taskId) ?>">
                                    <div class="task-info">
                                        <div class="task-checkbox">✓</div>
                                        <div class="task-details">
                                            <div class="task-name"><?= htmlspecialchars($task['name']) ?></div>
                                            <div class="task-meta">
                                                Completed: <?= formatDateTime($task['completed_at'] ?? $task['created_at']) ?>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="task-actions">
                                        <button class="restore-btn" data-id="<?= htmlspecialchars($taskId) ?>">↩ Restore</button>
                                        <button class="delete-btn" data-id="<?= htmlspecialchars($taskId) ?>">🗑 Delete</button>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- <script src="../js/history.js"></script> -->
     <script>
    document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for dynamic buttons
    document.body.addEventListener('click', (e) => {
        const restoreBtn = e.target.closest('.restore-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        
        if (restoreBtn) handleRestore(e);
        if (deleteBtn) handleDelete(e);
    });

    // Clear history button (static element)
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
                showNotification('Task restored successfully', 'success');
                checkEmptyState();
            }
        } else {
            showNotification('Failed to restore task', 'error');
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
                showNotification('Task deleted successfully', 'success');
                checkEmptyState();
            }
        } else {
            showNotification('Failed to delete task', 'error');
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
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
</script>
<script src="../js/animation.js"></script>
</body>
</html>