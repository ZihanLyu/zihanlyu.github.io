<?php
$NROWS = 6;  // number of rows
$NRCOLS = 3; // number of columns

$FIRST_NAMES = array("Sophia", "Barbara", "Betty", "Julia", "Sylvia", "Gloria");
$LAST_NAMES = array("Smith", "Bush", "Friedan", "Child", "Plath", "Steinem");
$CLASS_YEARS = array("1871-1875 (Founder)", 1947, 1942, 1934, 1955, 1956); // time they found/enter smith

$HEADERS = array("First Name", "Last Name", "Class Year");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Smith College Alumni/People</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link id="theme-link" rel="stylesheet" href="./css/part4.css">
</head>
<body>

<h1>Smith College Notable Alumni/People</h1>

<table>
    <thead>
        <tr>
            <?php foreach ($HEADERS as $header): ?>
                <th><?= $header ?></th>
            <?php endforeach; ?>
        </tr>
    </thead>
    <tbody>
        <?php for ($i = 0; $i < $NROWS; $i++): ?>
            <tr>
                <td><?= $FIRST_NAMES[$i] ?></td>
                <td><?= $LAST_NAMES[$i] ?></td>
                <td><?= $CLASS_YEARS[$i] ?></td>
            </tr>
        <?php endfor; ?>
    </tbody>
</table>

</body>
</html>