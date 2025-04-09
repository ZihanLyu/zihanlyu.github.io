<!DOCTYPE html>
<html>
<body>

<?php

$txt1 = "Double or Single Quotes?";
echo "<h2>$txt1</h2>";
$txt2 = "Double quoted strings perform action on special characters.<br>Single quoted strings does not perform such actions, it returns the string like it was written, with the variable name.";
echo "<p>$txt2</p>";

$x = "John";
echo "Hello $x";

$y = "John";
echo 'Hello $y';

$txt3 = "String Length";
echo "<h2>$txt3</h2>";
echo strlen("Hello world!");

$txt4 = "Word Count";
echo "<h2>$txt4</h2>";
echo str_word_count("Hello world!");

$txt5 = "Search For Text Within a String";
echo "<h2>$txt5</h2>";
echo strpos("Hello world!", "world");

$txt6 = "Modify Strings - Upper Case";
echo "<h2>$txt6</h2>";
$z = "Hello World!";
echo strtoupper($z);

$txt7 = "Modify Strings - Lower Case";
echo "<h2>$txt7</h2>";
$m = "Hello World!";
echo strtolower($m);

$txt8 = "Modify Strings - Replace String";
echo "<h2>$txt8</h2>";
$n = "Hello World!";
echo str_replace("World", "Dolly", $n);

$txt9 = "Modify Strings - Reverse a String";
echo "<h2>$txt9</h2>";
$o = "Hello World!";
echo strrev($o);

$txt10 = "Modify Strings - Remove Whitespace";
echo "<h2>$txt10</h2>";
$p = " Hello World! ";
echo trim($p);
?>

</body>
</html>
