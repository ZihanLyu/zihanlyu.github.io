<!DOCTYPE html>
<html>
<head>
    <title>whereami2</title>
</head>
<body>

<?php
include_once("php/myLib.php"); // include the myLib.php function external file

$currentDir = __DIR__;

$weekNumber = extractFolderNumber($currentDir);

echo "<h1>This is work for Week " . $weekNumber . "</h1>";
echo "Using myLib.php function from the external php folder"

?>

</body>
</html>