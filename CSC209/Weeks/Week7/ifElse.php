<!DOCTYPE html>
<html>
<body>

<p>Set up if conditions</P>

<?php
if (5 > 3) {
  echo "Have a good day!";
}
?>

<?php
$t = 14;

if ($t < 20) {
  echo "Have a good day!";
}
?>

<?php
$a = 13;

$b = $a < 10 ? "Hello" : "Good Bye";

echo $b;
?>

<?php
$d = 13;

if ($d > 10) {
  echo "Above 10";
  if ($d > 20) {
    echo " and also above 20";
  } else {
    echo " but not above 20";
  }
}
?>
 
</body>
</html>