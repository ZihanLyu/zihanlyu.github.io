<!DOCTYPE html>
<html>
<body>

<?php
$filename = "fread.txt";

if (file_exists($filename)) {
    $file = fopen($filename, "r"); // Open file for reading
    $content = fread($file, 100);   // Read first 10 characters
    fclose($file);                 // Close the file

    echo "First 10 characters: " . "<br>" . htmlspecialchars($content) ;
} else {
    echo "Error: The file '$filename' does not exist.";
}
?>

</body>
</html>

