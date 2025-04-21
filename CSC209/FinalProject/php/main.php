<?php
session_start();

if (!isset($_SESSION['user']) && !isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

function load_users() {
    $file = '../output/users.json';
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
    <title>Main</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/main.css">

</head>
<body>
    <header>
        <h1>Post-it</h1>

        <a href="php/history.php" title="History">
            <img src="<?= htmlspecialchars($avatar) ?>" alt="History" style="width:42px;height:42px; ">
        </a>
    </header>

    <script src="../js/main.js"></script>

</body>
</html>