<?php
$filename = "fopen.txt";

// Create the file if it doesn't exist
if (!file_exists($filename)) {
    $file = fopen($filename, "w");
    fwrite($file, "This is a test file.\nSecond line of text.");
    fclose($file);
}

$file = fopen($filename, "r");

while (!feof($file)) {
    $line = fgets($file);
    echo $line . "<br>";
}

fclose($file);
?>
