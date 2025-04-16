<!DOCTYPE html>
<html>
<body>

<?php
$username = $_POST["username"];
$password = $_POST["password"];

echo "<h2>Form Submission Received</h2>";
echo "Username: " . $username . "<br>";
echo "Password: " . $password . "<br>";

$outputDir = "../output";

$file = fopen("$outputDir/users.txt", "a");
fwrite($file, "Username: " . $username . ", Password: " . $password . "\n");
fclose($file);

echo "<p>User information has been saved successfully!</p>";
?> 

</body>
</html>