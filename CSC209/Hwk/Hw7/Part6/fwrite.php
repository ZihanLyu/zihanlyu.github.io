<!DOCTYPE html>
<html>
<body>

<?php
$file = fopen("fwrite.txt","w");
echo fwrite($file,"Hello World. Testing!");
fclose($file);
?>

</body>
</html>