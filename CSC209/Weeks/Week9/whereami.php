<h4>STEP 1: Find the Real Path</h4>
<?php
echo realpath(basename(__FILE__)); //try real path to find the path of this whereami.php file
?>

<h4>STEP 2: Extracts the Basename</h4>
<?php
$basename = basename(__DIR__);
echo $basename;
?>

<h4>STEP 3: Extracts the Last 1 Characters of the Basename</h4>
<?php
$weekNrString = substr($basename,-1);
echo "Last 1 character: " . $weekNrString;
?>

<h4>STEP 4: Convert the String to an Integer</h4>
<?php
$weekNr = (int)$weekNrString;
echo $weekNr;
?>

<!DOCTYPE html>
<html>
<body>

<p>This page figures out its whereabouts</p>

<h4>STEP 5: Print The Sentence</h4>
<?php
echo "My week number is " . $weekNr;
?>

</body>
</html>