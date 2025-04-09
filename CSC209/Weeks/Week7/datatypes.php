<!DOCTYPE html>
<html>
<body>

<?php
$x = 5;
var_dump($x);

echo "<br>"; 

$y = "Hello world!";
$z = 'Hello world!';

var_dump($y);
echo "<br>"; 
var_dump($z);

echo "<br>"; 

$w = 5985;
var_dump($w);

echo "<br>";

$float = "Using float";
echo "<h2>$float</h2>";
$m = 10.365;
var_dump($m);

echo "<br>";

$boolean = "Using Boolean";
echo "<h2>$boolean</h2>";
$n = true;
var_dump($n);

echo "<br>";

$array = "PHP Array";
echo "<h2>$array</h2>";
$cars = array("Volvo","BMW","Toyota");
var_dump($cars);

echo "<br>";

$object = "PHP Object";
echo "<h2>$object</h2>";

class Car {
    public $color;
    public $model;
    public function __construct($color, $model) {
      $this->color = $color;
      $this->model = $model;
    }
    public function message() {
      return "My car is a " . $this->color . " " . $this->model . "!";
    }
  }
  
  $myCar = new Car("red", "Volvo");
  var_dump($myCar);

echo "<br>";

$casting = "PHP Casting";
echo "<h2>$casting</h2>";
$casting1 = "If you want to change the data type of an existing variable, but not by changing the value.";
echo "<h4>$casting1</h4>";

$p = 5;
$p = (string) $p;
var_dump($p);

?>

</body>
</html>