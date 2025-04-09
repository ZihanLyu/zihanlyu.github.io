<!DOCTYPE html>
<html>
<body>

<?php
$cars = array("Volvo", "BMW", "Toyota");
echo count($cars);
?>

<p>Associative Arrays</p>
<?php
$car = array("brand"=>"Ford", "model"=>"Mustang", "year"=>1964);
var_dump($car);
?>

<?php
$car = array("brand"=>"Ford", "model"=>"Mustang", "year"=>1964);

foreach ($car as $x => $y) {
  echo "$x: $y <br>";
}
?>

<?php  
$cars = ["Volvo", "BMW", "Toyota"];
var_dump($cars);
?>

<?php  
$myArr = [];
$myArr[0] = "apples";
$myArr[1] = "bananas";
$myArr["fruit"] = "cherries";

var_dump($myArr);
?>

<?php  
function myFunction() {
  echo "I come from a function!";
}

$myArr = array("car" => "Volvo", "age" => 15, "message" => myFunction);

$myArr["message"]();
?>

<?php
$cars = array("Volvo", "BMW", "Toyota"); 

foreach ($cars as $x) {
  echo "$x <br>";
}
?>

<?php  
$cars = array("Volvo", "BMW", "Toyota");
foreach ($cars as &$x) {
  $x = "Ford";
}

$x = "ice cream";

var_dump($cars);
?>

<p>Sorting Arrays</p>
<?php
$age = array("Peter"=>"35", "Ben"=>"37", "Joe"=>"43");
asort($age);

foreach($age as $x => $x_value) {
  echo "Key=" . $x . ", Value=" . $x_value;
  echo "<br>";
}
?>

<p>Multidimentional Arrays</p>
<?php
$cars = array (
  array("Volvo",22,18),
  array("BMW",15,13),
  array("Saab",5,2),
  array("Land Rover",17,15)
);
  
echo $cars[0][0].": In stock: ".$cars[0][1].", sold: ".$cars[0][2].".<br>";
echo $cars[1][0].": In stock: ".$cars[1][1].", sold: ".$cars[1][2].".<br>";
echo $cars[2][0].": In stock: ".$cars[2][1].", sold: ".$cars[2][2].".<br>";
echo $cars[3][0].": In stock: ".$cars[3][1].", sold: ".$cars[3][2].".<br>";
?>

</body>
</html>