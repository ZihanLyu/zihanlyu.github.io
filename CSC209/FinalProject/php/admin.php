<?php
session_start();

// if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
//     header('Location: login.php');
//     exit;
// }

if (isset($_GET['fetch'])) {
    $filePath = "../json/users.json";
    $file = fopen($filePath, "a");

    $data = file_get_contents('../json/users.json');
    $users = json_decode($data, true);
    $count = count($users);
    
    echo "<br><strong>Number of users: $count </strong><br>";
    echo "<br><strong>List of users: </strong><br>";

    echo "<ul class='user-list'>";
    $index = 1;
    foreach ($users as $email => $user) {
        $username = $user['username'] ?? explode('@', $email)[0];
        $password = $user['password'];
        echo "<li class='user-item'>";
        echo "<img src='" . htmlspecialchars($user['avatar']) . "' class='user-avatar' alt='User Avatar'>";
        echo "<span class='user-name'>User $index: " . htmlspecialchars($username) . "</span>";
        echo "<span class='user-name'>Password: " . htmlspecialchars($password) . "</span>";
        echo "<span class='user-email'>(" . htmlspecialchars($email) . ")</span>";
        echo "</li>";
        $index++;
    }
    echo "</ul>";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="container">
        <div class="admin-header">
            <h1>&#128081 Admin Dashboard</h1>
            <!-- <div class="admin-profile">
                <img src="<?php echo htmlspecialchars($_SESSION['avatar']); ?>" alt="Admin Avatar" class="admin-avatar">
                <span>Admin</span>
            </div> -->
        </div>

        <div class="admin-controls">
            <button onclick="updateUsers()" class="button">Update User List</button>
            <a href="../index.html" class="logout-btn">Logout</a>
        </div>
        
        <div id="userList" class="user-list-container"></div>
    </div>

    <script src="../js/admin.js"></script>
</body>
</html>