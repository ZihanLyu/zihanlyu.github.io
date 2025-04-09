<!DOCTYPE html>
<html>
<body>

<p>Print Integers Using While Loop</p>
<?php  
$i = 1;

while ($i < 6) {
  echo $i;
  $i++;
} 
?>  

<?php  
$i = 1;

while ($i < 6):
  echo $i;
  $i++;
endwhile;
?>  

<?php  
$i = 0;

while ($i < 100) {
  $i+=10;
  echo "$i<br>";
}
?>

<p>The do...while loop - Loops through a block of code once, and then repeats the loop as long as the specified condition is true.</p>
<?php  
$i = 1;

do {
  if ($i == 3) break;
  echo "$i<br>";
  $i++;
} while ($i < 6);
?>  

<p>For Loops</p>

<?php  
for ($x = 0; $x <= 10; $x++) {
  if ($x == 3) break;
  echo "The number is: $x <br>";
}
?>

<p>Foreach</p>
<?php  
$colors = array("red", "green", "blue", "yellow"); 

foreach ($colors as $x) {
  echo "$x <br>";
}
?>


<?php
$members = array("Peter"=>"35", "Ben"=>"37", "Joe"=>"43");

foreach ($members as $x => $y) {
  echo "$x : $y <br>";
}
?>

<p>Break</p>
<?php  
$x = 0;
 
while($x < 10) {
  if ($x == 4) {
    break;
  }
  echo "The number is: $x <br>";
  $x++;
} 
?>

<p>Continue</p>
<?php  
$x = 0;
 
while($x < 10) {
  $x++;
  if ($x == 4) {
    continue;
  }
  echo "The number is: $x <br>";
} 
?> 
</body>
</html>
