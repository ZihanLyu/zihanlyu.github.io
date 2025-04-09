<!DOCTYPE html>
<html>
<body>

<h4>A better method to open files is with the <code>fopen()</code> function. This function gives you more options than the <code>readfile()</code> function.</h4>

<?php
$myfile = fopen("webdictionary.txt", "r") or die("Unable to open file!");
echo fread($myfile,filesize("webdictionary.txt"));
fclose($myfile);
?>

<h4>Read Single Line - <code>fgets()</code></h4>

<?php
$myfile = fopen("webdictionary.txt", "r") or die("Unable to open file!");
echo fgets($myfile);
fclose($myfile);
?>

<h4>Check End-Of-File - <code>feof()</code></h4>
<?php
$myfile = fopen("webdictionary.txt", "r") or die("Unable to open file!");
// Output one line until end-of-file
while(!feof($myfile)) {
  echo fgets($myfile) . "<br>";
}
fclose($myfile);
?>

<h4>Read Single Character - <code>fgetc()</code></h4>
<?php
$myfile = fopen("webdictionary.txt", "r") or die("Unable to open file!");
// Output one character until end-of-file
while(!feof($myfile)) {
  echo fgetc($myfile);
}
fclose($myfile);
?>


</body>
</html>