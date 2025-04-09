<!DOCTYPE html>
<html>
<body>

<?php  
$x = 75;
  
function myfunction() {
  global $x;
  echo $x;
}

myfunction()
?>

<?php  
function myfunction2() {
  $GLOBALS["x"] = 100;
}

myfunction2();

echo $GLOBALS["x"];
echo $x;
?>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
  Name: <input type="text" name="fname">
  <input type="submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // collect value of input field
    $name = htmlspecialchars($_REQUEST['fname']);
    if (empty($name)) {
        echo "Name is empty";
    } else {
        echo $name;
    }
}
?>

<form action="welcome_get.php" method="get">
Name: <input type="text" name="name"><br>
E-mail: <input type="text" name="email"><br>
<input type="submit">
</form>

</body>
</html>