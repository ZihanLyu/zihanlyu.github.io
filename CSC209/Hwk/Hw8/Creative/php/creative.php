<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Creative</title>
    <link id="theme-link" rel="stylesheet" href="../css/creative.css">
</head>
<body>

<div class="menu">
    <form method="GET">
        <h3>HW8 Creative</h3>
        <p>Updates: images are now with round edge, cats images become smaller, everything is centered.</p>
        <label for="group">Choose a category:</label>
        <select name="group" id="group" onchange="this.form.submit()">
            <?php
                $baseDir = '../images';
                $selectedGroup = $_GET['group'] ?? 'smith';
                $folders = array_filter(scandir($baseDir), function($dir) use ($baseDir) {
                    return is_dir("$baseDir/$dir") && !in_array($dir, ['.', '..']);
                });
                foreach ($folders as $folder) {
                    $selected = ($folder === $selectedGroup) ? 'selected' : '';
                    echo "<option value=\"$folder\" $selected>" . ucfirst($folder) . "</option>";
                }
            ?>
        </select>
    </form>
</div>

<div class="slides" id="slidesFrame">
    <?php
        $folderPath = "$baseDir/$selectedGroup";
        $images = glob("$folderPath/*.{jpg,jpeg}", GLOB_BRACE);
        $captions = [];
        $index = 1;
        
        // adjust images dimention based on their category folder
        $imageWidth = "100%";
        if ($selectedGroup === "smith") {
            $imageWidth = "800px";
        } elseif ($selectedGroup === "cat") {
            $imageWidth = "300px";
        }

        if (count($images) > 0) {
            foreach ($images as $img) {
                $caption = ucfirst(pathinfo($img, PATHINFO_FILENAME));
                $captions[] = $caption;

                echo "<div class='creativeSlides fadeIn'>";
                echo "<div class='orderNum'>$index / " . count($images) . "</div>";
                echo "<img src=\"$img\" alt=\"$caption\" style=\"width:$imageWidth; margin: 0 auto; display: block;\">";
                echo "<div class='caption'>$caption</div>";
                echo "</div>";
                $index++;
            }
        } else {
            echo "<div class='creativeSlides fadeIn'>";
            echo "<div class='caption'>There is no image in this foler!</div>";
            echo "</div>";
        }
    ?>

    <a class="prev" onclick="plusSlides(-1)">❮</a>
    <a class="next" onclick="plusSlides(1)">❯</a>
</div>

<br>

<div style="text-align:center" id="dotContainer">
    <?php
        for ($i = 1; $i <= count($images); $i++) {
            echo "<span class='dot' onclick='currentSlide($i)'></span>";
        }
    ?>
</div>

<script src="../js/creative.js"></script>

</body>
</html>