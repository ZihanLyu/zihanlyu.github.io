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

$users = load_users();
$email = $_SESSION['user'] ?? '';
$avatar = $_SESSION['avatar'] ?? '../images/youngman_1.png';

$username = '';
if (isset($users[$email]) && isset($users[$email]['username'])) {
    $username = $users[$email]['username'];
} else {
    $username = explode('@', $email)[0];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <link rel="stylesheet" href="../css/welcome.css">
</head>
<body>
    <div class="welcome-container">
        <div class="welcome-avatar-container">
            <img src="<?= htmlspecialchars($avatar) ?>" alt="User Avatar" class="welcome-avatar">
        </div>
        
        <h1>Welcome, <span class="username"><?= htmlspecialchars($username) ?></span>!</h1>
        
        <div class="welcome-message">
            <p>You have successfully logged in to your account.</p>
        </div>
        
        <div class="welcome-actions">
            <a href="home.php" class="welcome-btn start-btn">Start</a>
        </div>
    </div>

    <script src="../js/welcome.js"></script>
</body>
</html>