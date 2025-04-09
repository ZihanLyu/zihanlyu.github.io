<!DOCTYPE html>
<html>
<body>

<h4>Write to File - <code>fwrite()</code></h4>

<?php
$myfile = fopen("newtext.txt", "w") or die("Unable to open file!");
$txt = "John Doe\n";
fwrite($myfile, $txt);
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fclose($myfile);
?>

<h4>Overwriting</h4>

<?php
$myfile = fopen("newtext.txt", "w") or die("Unable to open file!");
$txt = "Mickey Mouse\n";
fwrite($myfile, $txt);
$txt = "Minnie Mouse\n";
fwrite($myfile, $txt);
fclose($myfile);
?>

<h4>Append Text</h4>
<?php
$myfile = fopen("newtext.txt", "a") or die("Unable to open file!");
$txt = "Donald Duck\n";
fwrite($myfile, $txt);
$txt = "Goofy Goof\n";
fwrite($myfile, $txt);
fclose($myfile);
?>

</body>
</html>