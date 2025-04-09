<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Interactive PHP Slideshow</title>
    <link id="theme-link" rel="stylesheet" href="../css/level3.css">
</head>
<body>

<h2>Drop Down Tab To Display Desired Image</h2>

<?php
$images = array(
    array("file" => "../images/spring.jpg", "label" => "Spring"),
    array("file" => "../images/summer.jpg", "label" => "Summer"),
    array("file" => "../images/fall.jpg", "label" => "Fall"),
    array("file" => "../images/winter.jpg", "label" => "Winter")
);
?>

<label for="imageSelect"><strong>Select an image:</strong></label>
<select id="imageSelect" onchange="showSelectedImage()">
    <option value="">-- Choose a Season --</option>
    <?php foreach ($images as $index => $img): ?>
        <option value="img<?php echo $index; ?>"><?php echo $img["label"]; ?></option>
    <?php endforeach; ?>
</select>

<div class="slideshow">
    <?php foreach ($images as $index => $img): ?>
        <div class="img-container">
            <img id="img<?php echo $index; ?>" src="<?php echo $img["file"]; ?>" alt="<?php echo $img["label"]; ?>">
        </div>
    <?php endforeach; ?>
</div>

<script src="../js/level3.js"></script>

</body>
</html>