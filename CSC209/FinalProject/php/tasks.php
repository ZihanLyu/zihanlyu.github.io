<!-- PLACE HOLDER: copy and paste from login.php -->
<?php
session_start();

function load_users() {
    $file = '../json/tasks.json';
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }
    return json_decode(file_get_contents($file), true);
}

function save_users($users) {
    file_put_contents('../json/tasks.json', json_encode($users, JSON_PRETTY_PRINT));
}

$taskName = '';
$status = '';
$deadline = '';
$description = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $avatar = $_POST['selected_avatar'] ?? $selectedAvatar;
    $users = load_users();

    if (empty($email) || empty($password)) {
        $error = 'Please fill in all fields.';
    } else {
        if ($email === 'admin@smith.edu' && $password === 'admin!') {
            $_SESSION['admin'] = true;
            $_SESSION['avatar'] = '../images/man_1.png';
            header('Location: admin.php');
            exit;
        } elseif (isset($users[$email]) && $users[$email]['password'] === $password) {
            $_SESSION['user'] = $email;
            $_SESSION['avatar'] = $users[$email]['avatar'] ?? $avatar;
            header('Location: welcome.php'); // if entered the correct password, redirect to the main page
            exit;
        } else {
            if (!isset($users[$email])) {
                $username = explode('@', $email)[0]; // extract username from the email
    
                $users[$email] = [
                    'password' => $password,
                    'avatar' => $avatar,
                    'username' => $username
                ];
                save_users($users);
                $_SESSION['user'] = $email;
                $_SESSION['avatar'] = $avatar;
                header('Location: welcome.php'); // redirect to welcome page
                exit;
            } else {
                echo "<script>alert('Incorrect email or password.');</script>";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Login</title>
    <link id="theme-link" rel="stylesheet" href="../css/login.css">
    <link rel="stylesheet" href="../css/avatar.css">
</head>
<body>
    <div class="container">
        <h1>&#128272 Login</h1>

        <?php if ($error): ?>
            <div class="error-message"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="success-message"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>

        <div class="login-buttons">
            <button id="userLoginBtn" class="login-btn">User Login</button>
            <!-- <button id="adminLoginBtn" class="login-btn admin-btn">Admin View</button> -->
        </div>

        <p id="loginInfo">New users are automatically registered!</p>
    </div>

    <div id="loginModal" class="login-modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="modalTitle">User Login</h2>
            
            <div class="avatar-container">
                <img id="avatarImg" class="avatar" src="../images/youngman_1.png" alt="User Avatar">
                <button id="selectAvatarBtn" class="select-avatar-btn" title="Choose Avatar">+</button>
            </div>

            <form method="POST" id="loginForm">
                <div class="form-group">
                    <input type="email" id="emailInput" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <input type="hidden" id="selectedAvatarInput" name="selected_avatar" value="../images/youngman_1.png">
                    <button class="button" type="submit">Login</button>
                </div>
            </form>
            
            <p id="loginHelp">Please enter your credentials</p>
        </div>
    </div>

    <?php include 'avatar.php'; ?>

    <script src="../js/avatar.js"></script>
</body>
</html>