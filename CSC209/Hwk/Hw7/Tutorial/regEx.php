<!DOCTYPE html>
<html>
<body>

<h4>Preg Match</h4>

<p>The <code>preg_match()</code> function will tell you whether a string contains matches of a pattern.<br>
    Returns 1 if the pattern was found in the string and 0 if not.
</p>
<?php
$str = "Visit W3Schools";
$pattern = "/w3schools/i";
echo preg_match($pattern, $str); 
?>

<h4>Preg Match All</h4>

<p>The <code>preg_match_all()</code> function will tell you how many matches were found for a pattern in a string.<br>
Returns the number of times the pattern was found in the string, which may also be 0.
</p>

<?php
$str = "The rain in SPAIN falls mainly on the plains.";
$pattern = "/ain/i";
echo preg_match_all($pattern, $str);
?>

<h4>Preg Replace</h4>

<p>The <code>preg_replace()</code> function will replace all of the matches of the pattern in a string with another string.<br>
Returns a new string where matched patterns have been replaced with another string.
</p>

<?php
$str = "Visit Microsoft!";
$pattern = "/microsoft/i";
echo preg_replace($pattern, "W3Schools", $str);
?>

</body>
</html>