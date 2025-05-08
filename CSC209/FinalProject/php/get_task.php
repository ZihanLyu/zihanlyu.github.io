<?php
session_start();

if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

$email = $_SESSION['user'] ?? '';

if (empty($email) || !isset($_GET['id'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid parameters']);
    exit;
}

$taskId = $_GET['id'];

function load_tasks() {
    $file = '../json/tasks.json';
    if (!file_exists($file)) {
        return [];
    }
    return json_decode(file_get_contents($file), true);
}

$tasks = load_tasks();

if (!isset($tasks[$email][$taskId])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Task not found']);
    exit;
}

header('Content-Type: application/json');
echo json_encode($tasks[$email][$taskId]);
?>