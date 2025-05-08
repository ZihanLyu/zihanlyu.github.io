<?php
session_start();

if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

function load_users() {
    $file = '../json/users.json';
    if (!file_exists($file)) {
        return [];
    }
    return json_decode(file_get_contents($file), true);
}

function load_tasks() {
    $file = '../json/tasks.json';
    if (!file_exists($file)) {
        return [];
    }
    return json_decode(file_get_contents($file), true);
}

function save_tasks($tasks) {
    $file = '../json/tasks.json';
    file_put_contents($file, json_encode($tasks, JSON_PRETTY_PRINT));
}

function load_sections() {
    $file = '../json/sections.json';
    if (!file_exists($file)) {
        return [];
    }
    return json_decode(file_get_contents($file), true);
}

function save_sections($sections) {
    $file = '../json/sections.json';
    file_put_contents($file, json_encode($sections, JSON_PRETTY_PRINT));
}

$users = load_users();
$email = $_SESSION['user'] ?? '';
$avatar = $_SESSION['avatar'] ?? '../images/youngman_1.png';

$username = '';
if (isset($users[$email]) && isset($users[$email]['username'])) {
    $username = $users[$email]['username'];
} else {
    $username = explode('@', $email)[0];
}

// Default sections
$defaultSections = ['new', 'today', 'later'];

// Load user sections or create defaults
$sections = load_sections();
if (!isset($sections[$email])) {
    $sections[$email] = [
        ['id' => 'new', 'name' => 'New tasks', 'icon' => '&#128203;'],
        ['id' => 'today', 'name' => 'Do today', 'icon' => '&#10024;'],
        ['id' => 'later', 'name' => 'Do later', 'icon' => '&#128338;']
    ];
    save_sections($sections);
}

$userSections = $sections[$email];
$sectionIds = array_column($userSections, 'id');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'createTask') {
    $taskName = trim($_POST['taskName']);
    $status = $_POST['status'] ?? 'new';
    
    if (!empty($taskName) && in_array($status, $sectionIds)) {
        $tasks = load_tasks();
    
        if (!isset($tasks[$email])) {
            $tasks[$email] = [];
        }
        
        $taskId = uniqid();
        
        $userTimezone = $_POST['user_timezone'] ?? '';

        // Validate timezone
        if (empty($userTimezone) || !in_array($userTimezone, DateTimeZone::listIdentifiers())) {
            $userTimezone = 'UTC';
        }

        $dateTime = new DateTime('now', new DateTimeZone($userTimezone));
        
        $newTask = [
            'id' => $taskId,
            'name' => $taskName,
            'deadline' => (!empty($_POST['deadline']) && !empty($_POST['deadline_time'])) 
                ? $_POST['deadline'] . ' ' . $_POST['deadline_time'] 
                : (!empty($_POST['deadline']) ? $_POST['deadline'] : ''),
            'description' => $_POST['description'] ?? '',
            'created_at' => $dateTime->format('Y-m-d H:i:s'), 
            'timezone' => $userTimezone,
            'status' => $status,
            'completed' => false
        ];
        
        $tasks[$email][$taskId] = $newTask;
        save_tasks($tasks);
        
        header('Location: home.php?task_added=true');
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'completeTask') {
    $taskId = $_POST['taskId'] ?? '';
    
    if (!empty($taskId)) {
        $tasks = load_tasks();
        
        if (isset($tasks[$email][$taskId])) {
            $tasks[$email][$taskId]['completed'] = true;
            
            $userTimezone = $_POST['user_timezone'] ?? $tasks[$email][$taskId]['timezone'] ?? date_default_timezone_get();
            $dateTime = new DateTime('now', new DateTimeZone($userTimezone));
            
            $tasks[$email][$taskId]['completed_at'] = $dateTime->format('Y-m-d H:i:s');
            
            if (!isset($tasks['history'][$email])) {
                $tasks['history'][$email] = [];
            }
            
            $tasks['history'][$email][$taskId] = $tasks[$email][$taskId];
            
            unset($tasks[$email][$taskId]);
            save_tasks($tasks);
            
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Task not found']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteTask') {
    $taskId = $_POST['taskId'] ?? '';
    
    if (!empty($taskId)) {
        $tasks = load_tasks();
        
        if (isset($tasks[$email][$taskId])) {
            unset($tasks[$email][$taskId]);
            save_tasks($tasks);
            
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Task not found']);
    exit;
}

// Add Section Function
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'addSection') {
    $sectionName = trim($_POST['sectionName'] ?? '');
    $sectionIcon = $_POST['sectionIcon'] ?? '&#128204;';
    
    if (!empty($sectionName)) {
        $sections = load_sections();
        
        if (!isset($sections[$email])) {
            $sections[$email] = [];
        }
        
        $sectionId = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $sectionName)) . '_' . uniqid();
        
        $sections[$email][] = [
            'id' => $sectionId,
            'name' => $sectionName,
            'icon' => $sectionIcon
        ];
        
        save_sections($sections);
        
        header('Location: home.php?section_added=true');
        exit;
    }
}

// Delete Section
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteSection') {
    $sectionId = $_POST['sectionId'] ?? '';
    
    // Default Sections Can't be Deleted
    if (!empty($sectionId) && !in_array($sectionId, $defaultSections)) {
        $sections = load_sections();
        
        if (isset($sections[$email])) {
            foreach ($sections[$email] as $key => $section) {
                if ($section['id'] === $sectionId) {
                    unset($sections[$email][$key]);
                    $sections[$email] = array_values($sections[$email]); // reindex the array
                    break;
                }
            }
            
            save_sections($sections);
            
            // Reassign tasks from this section to 'new'
            $tasks = load_tasks();
            if (isset($tasks[$email])) {
                foreach ($tasks[$email] as $taskId => $task) {
                    if ($task['status'] === $sectionId) {
                        $tasks[$email][$taskId]['status'] = 'new';
                    }
                }
                save_tasks($tasks);
            }
            
            header('Content-Type: application/json');
            echo json_encode(['success' => true]);
            exit;
        }
    }
    
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Section not found or cannot be deleted']);
    exit;
}

// Edit Task
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'editTask') {
    header('Content-Type: application/json');
    
    if (!isset($_SESSION['user'])) {
        echo json_encode(['success' => false, 'message' => 'Not authenticated']);
        exit;
    }

    $taskId = $_POST['taskId'] ?? '';
    $email = $_SESSION['user'];
    $tasks = load_tasks();

    if (!isset($tasks[$email][$taskId])) {
        echo json_encode(['success' => false, 'message' => 'Task not found']);
        exit;
    }

    // Validate the Input
    $taskName = trim($_POST['taskName']);
    if (empty($taskName)) {
        echo json_encode(['success' => false, 'message' => 'Task name is required']);
        exit;
    }

    // Update Task Details
    $tasks[$email][$taskId]['name'] = $taskName;
    $tasks[$email][$taskId]['status'] = $_POST['status'] ?? 'new';
    $tasks[$email][$taskId]['description'] = $_POST['description'] ?? '';
    
    // Handle Deadline - Seems to be not working
    $deadline = '';
    if (!empty($_POST['deadline']) && !empty($_POST['deadline_time'])) {
        $deadline = $_POST['deadline'] . ' ' . $_POST['deadline_time'];
    } elseif (!empty($_POST['deadline'])) {
        $deadline = $_POST['deadline'];
    }
    $tasks[$email][$taskId]['deadline'] = $deadline;

    // // Update Timezone
    // $userTimezone = $_POST['user_timezone'] ?? 'UTC';
    // if (!in_array($userTimezone, DateTimeZone::listIdentifiers())) {
    //     $userTimezone = 'UTC';
    // }
    // $tasks[$email][$taskId]['timezone'] = $userTimezone;

    // save_tasks($tasks);
    // echo json_encode(['success' => true]);
    // exit;
}

$userTasks = [];
$tasksBySection = [];
$sectionCounts = [];
foreach ($userSections as $section) {
    $tasksBySection[$section['id']] = [];
    $sectionCounts[$section['id']] = 0;
}

$allTasks = load_tasks();
if (isset($allTasks[$email])) {
    $userTasks = $allTasks[$email];
    
    foreach ($userTasks as $taskId => $task) {
        $status = $task['status'] ?? 'new';
        // If task status doesn't match an existing section, move it to 'new'
        if (!in_array($status, $sectionIds)) {
            $status = 'new';
        }
        $tasksBySection[$status][$taskId] = $task;
        $sectionCounts[$status]++;
    }
}

function formatTaskDate($dateStr) {
    if (empty($dateStr)) return '';
    
    // check if the date string includes time
    $hasTime = (strpos($dateStr, ':') !== false);
    
    $date = new DateTime($dateStr);
    $today = new DateTime('today');
    $tomorrow = new DateTime('tomorrow');
    
    $result = '';
    
    if ($date->format('Y-m-d') === $today->format('Y-m-d')) {
        $result = 'Today';
    } elseif ($date->format('Y-m-d') === $tomorrow->format('Y-m-d')) {
        $result = 'Tomorrow';
    } else {
        $dayOfWeek = $date->format('l');
        if ($date->diff($today)->days <= 6) {
            $result = $dayOfWeek;
        } else {
            $result = $date->format('M j'); // eg. Jan 15
        }
    }
    
    // Add time if available
    if ($hasTime) {
        $result .= ' at ' . $date->format('g:i A'); // eg. "3:30 PM"
    }
    
    return $result;
}

function getTaskDeadlineDate($dateStr) {
    if (empty($dateStr)) return '';
    $parts = explode(' ', $dateStr);
    return $parts[0] ?? '';
}

function getTaskDeadlineTime($dateStr) {
    if (empty($dateStr) || strpos($dateStr, ' ') === false) return '';
    $parts = explode(' ', $dateStr);
    return $parts[1] ?? '';
}


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Task Manager</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link id="theme-link" rel="stylesheet" href="../css/home.css">
    <link id="theme-link" rel="stylesheet" href="../css/animation.css">
    <script>
        // Detect user's timezone when page loads
        document.addEventListener('DOMContentLoaded', function() {
            window.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log("Detected timezone:", window.userTimezone);
        });
    </script>
</head>
<body>
    <header>
        <h1>Post-it</h1>
        <li class="dropdown">
            <a><img src="<?= htmlspecialchars($avatar) ?>" alt="Profile" style="width:42px;height:42px; border-radius:50%;"></a>
            <div class="dropdown-content" style="position: relative;">
                <a href="history.php">History</a>
                <a href="logout.php">Logout</a>
            </div>
        </li>
    </header>
    <div class="action-bar">
    </div>
    <div class="action-bar">
    </div>
    <div class="action-bar">
        <div class="action-buttons">
            <div style="display: flex;">
                <button id="addTaskBtn" class="primary-btn">&#10133; Add task</button>
            </div>
        </div>
        <div class="toolbar">
            <div class="action-buttons">

                <button id="addSectionBtn" class="toolbar-btn">➕ Add Section</button>

            </div>
        </div>
    </div>
    
    <div class="board-container">
        <?php foreach ($userSections as $section): ?>
            <div class="board-column" data-section-id="<?= $section['id'] ?>">
                <div class="column-header">
                    <h2><?= $section['icon'] ?> <?= htmlspecialchars($section['name']) ?> <span class="task-count"><?= $sectionCounts[$section['id']] ?? 0 ?></span></h2>
                    <?php if (!in_array($section['id'], $defaultSections)): ?>
                        <button class="delete-section-btn" data-section-id="<?= $section['id'] ?>">×</button>
                    <?php endif; ?>
                </div>
                <div class="task-list">
                    <?php if (empty($tasksBySection[$section['id']])): ?>
                        <!-- Show empty state -->
                    <?php else: ?>
                        <?php foreach ($tasksBySection[$section['id']] as $task): ?>
                            <div class="task-card" data-id="<?= $task['id'] ?>">
                                <div class="task-priority"></div>
                                <div class="task-title">
                                    <span class="task-checkbox" data-id="<?= $task['id'] ?>">⭘</span>
                                    <?= htmlspecialchars($task['name']) ?>
                                </div>
                                <?php if (!empty($task['deadline'])): ?>
                                    <div class="task-date"><?= formatTaskDate($task['deadline']) ?></div>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                    <button class="add-task-btn" data-status="<?= $section['id'] ?>">&#10133; Add task</button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    
    <!-- Task Creation Modal -->
    <div id="taskModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add Task</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form class="task-form" method="post" action="home.php">
                <input type="hidden" name="action" value="createTask">
                <input type="hidden" id="taskStatus" name="status" value="new">
                <input type="hidden" id="user_timezone" name="user_timezone" value="">
                
                <div class="form-group">
                    <label for="taskName">Task name</label>
                    <input type="text" id="taskName" name="taskName" class="form-control" required placeholder="What needs to be done?">
                </div>
                
                <div class="form-group">
                    <label for="deadline">Deadline (optional)</label>
                    <div class="date-time-container">
                        <input type="date" id="deadline" name="deadline" class="form-control date-input">
                        <input type="time" id="deadline_time" name="deadline_time" class="form-control time-input">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="description">Description (optional)</label>
                    <textarea id="description" name="description" class="form-control" placeholder="Add details about this task..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="taskSection">Section</label>
                    <select id="taskSection" name="status" class="form-control">
                        <?php foreach ($userSections as $section): ?>
                            <option value="<?= $section['id'] ?>"><?= htmlspecialchars($section['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Create Task</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Task Details Modal -->
    <div id="taskDetailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Task Details</h2>
                <button class="close-btn" data-modal="taskDetailsModal">&times;</button>
            </div>
            <div class="task-details-content">
                <h3 id="detailsTaskName"></h3>
                <div class="task-detail-row">
                    <span class="detail-label">Status:</span>
                    <span id="detailsTaskStatus"></span>
                </div>
                <div class="task-detail-row">
                    <span class="detail-label">Created:</span>
                    <span id="detailsTaskCreated"></span>
                </div>
                <div class="task-detail-row" id="detailsDeadlineRow">
                    <span class="detail-label">Deadline:</span>
                    <span id="detailsTaskDeadline"></span>
                </div>
                <div class="task-description-container" id="detailsDescContainer">
                    <h4>Description:</h4>
                    <p id="detailsTaskDescription"></p>
                </div>
                <div class="form-actions">
                    <!-- <button type="button" class="edit-btn">Edit</button> -->
                    <button type="button" class="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Edit Task Modal -->
    <div id="editTaskModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Edit Task</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form class="edit-task-form" method="post" action="home.php">
                <input type="hidden" name="action" value="editTask">
                <input type="hidden" id="editTaskId" name="taskId">
                <input type="hidden" id="editUserTimezone" name="user_timezone" value="">
                
                <div class="form-group">
                    <label for="editTaskName">Task name</label>
                    <input type="text" id="editTaskName" name="taskName" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="editStatus">Section</label>
                    <select id="editStatus" name="status" class="form-control">
                        <?php foreach ($userSections as $section): ?>
                            <option value="<?= $section['id'] ?>"><?= htmlspecialchars($section['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="editDeadline">Deadline (optional)</label>
                    <div class="date-time-container">
                        <input type="date" id="editDeadline" name="deadline" class="form-control date-input">
                        <input type="time" id="editDeadlineTime" name="deadline_time" class="form-control time-input">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editDescription">Description</label>
                    <textarea id="editDescription" name="description" class="form-control"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Section Modal -->
    <div id="sectionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Add New Section</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form class="section-form" method="post" action="home.php">
                <input type="hidden" name="action" value="addSection">
                
                <div class="form-group">
                    <label for="sectionName">Section Name</label>
                    <input type="text" id="sectionName" name="sectionName" class="form-control" required placeholder="Enter section name">
                </div>
                
                <div class="form-group">
                    <label for="sectionIcon">Icon (optional)</label>
                    <select id="sectionIcon" name="sectionIcon" class="form-control">
                        <option value="&#128204;">📌 Pin</option>
                        <option value="&#9733;">★ Star</option>
                        <option value="&#128197;">📅 Calendar</option>
                        <option value="&#128466;">📒 Notebook</option>
                        <option value="&#128161;">💡 Idea</option>
                        <option value="&#128187;">💻 Computer</option>
                        <option value="&#128188;">💼 Work</option>
                        <option value="&#127968;">🏠 Home</option>
                        <option value="&#127891;">🎓 Education</option>
                        <option value="&#127942;">🏆 Goal</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="submit-btn">Create Section</button>
                </div>
            </form>
        </div>
    </div>
    
    <script src="../js/home.js"></script>
    <script src="../js/animation.js"></script>
</body>
</html>