<!DOCTYPE html>
<html>
<body>

<?php
echo "Today is " . date("Y/m/d") . "<br>";
echo "Today is " . date("Y.m.d") . "<br>";
echo "Today is " . date("Y-m-d") . "<br>";
echo "Today is " . date("l");
?>

<?php
echo "The time is " . date("h:i:sa");
?>

<p>Display Current Time @ Disired Time Zone</p>
<?php
date_default_timezone_set("America/New_York");
echo "The time is " . date("h:i:sa");
?>

<?php
$d=mktime(22, 36, 30, 4, 1, 2025);
echo "Created date is " . date("Y-m-d h:i:sa", $d);
?>

<?php
$d=strtotime("tomorrow");
echo date("Y-m-d h:i:sa", $d) . "<br>";

$d=strtotime("next Saturday");
echo date("Y-m-d h:i:sa", $d) . "<br>";

$d=strtotime("+3 Months");
echo date("Y-m-d h:i:sa", $d) . "<br>";
?>

<p>Print Out a List of Dates</p>
<?php
$startdate=strtotime("Saturday");
$enddate=strtotime("+6 weeks", $startdate);

while ($startdate < $enddate) {
  echo date("M d", $startdate) . "<br>";
  $startdate = strtotime("+1 week", $startdate);
}
?>

</body>
</html>