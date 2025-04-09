<!DOCTYPE html>
<html>
<body>

<?php
// case-sensitive constant name
define("example", "case-sensitive constant name");
echo example;
?> 

<?php
const MYCAR = "Volvo";

echo MYCAR;
?> 

<p>Print Out Arrays</p>

<?php
define("cars", [
  "Alfa Romeo",
  "BMW",
  "Toyota"
]);
echo cars[0];
?> 

</body>
</html>
