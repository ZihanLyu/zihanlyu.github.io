<!DOCTYPE html>
<html>
<body>

<?php
$filenames = array("fclose.txt", "fwrite.txt");

foreach ($filenames as $filename) {
    if (file_exists($filename)) {
        $file = fopen($filename, "r");
        fclose($file);
        echo "File '$filename' closed successfully.<br>";
    } else {
        echo "Error: The file '$filename' does not exist.<br>";
    }
}
?>

</body>
</html>
