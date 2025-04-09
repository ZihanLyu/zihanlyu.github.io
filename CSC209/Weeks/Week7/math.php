<!DOCTYPE html>
<html>
<body>

<?php
echo(pi());
?>

<p>Find Max and Min</p>

<?php
echo(min(0, 150, 30, 20, -8, -200) . "<br>");
echo(max(0, 150, 30, 20, -8, -200));
?>

<p>Absolute Function</p>
<?php
echo(abs(-6.7));
?>

<p>Find the Square Root</p>
<?php
echo(sqrt(64) . "<br>");
?>

<p>Round Up</p>

<?php
echo(round(0.60) . "<br>");
echo(round(0.50) . "<br>");
echo(round(0.49) . "<br>");
echo(round(-4.40) . "<br>");
echo(round(-4.60));
?>

<p>Generate Random Numbers</p>

<?php
echo(rand(10, 100));
?>

</body>
</html>