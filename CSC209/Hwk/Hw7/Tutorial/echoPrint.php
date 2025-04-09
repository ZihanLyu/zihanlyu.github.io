<!DOCTYPE html>
<html>
<body>

<?php
echo "Hello";
//same as:
echo("Hello");
echo "<h2>PHP is Fun!</h2>";
echo "Hello world!<br>";
echo "I'm about to learn PHP!<br>";
echo "This ", "string ", "was ", "made ", "with multiple parameters.";

$txt1 = "Learn PHP";
$txt2 = "W3Schools.com";

echo "<h2>$txt1</h2>";
echo "<p>Study PHP at $txt2</p>";

$txt3 = "Learn PHP";
$txt4 = "W3Schools.com";

echo '<h2>' . $txt3 . '</h2>';
echo '<p>Study PHP at ' . $txt4 . '</p>';

print "Hello";
//same as:
print("Hello");

print "<h2>PHP is Fun!</h2>";
print "Hello world!<br>";
print "I'm about to learn PHP!";
?>

</body>
</html>