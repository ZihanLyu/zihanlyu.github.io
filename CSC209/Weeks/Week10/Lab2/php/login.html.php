<!DOCTYPE HTML>
<html>  
<body>

<form action="./saveUsers.php" method="post">
Username: <input type="text" name="username"><br>
Password: <input type="password" name="password"><br>
<input type="submit" value="Login">
</form>

<?php
include_once("myLib.php");

$currentDir = __DIR__;
$weekNumber = extractFolderNumber($currentDir);

echo "<h1>This is work for Week " . $weekNumber . "</h1>";

?>

</body>
</html>