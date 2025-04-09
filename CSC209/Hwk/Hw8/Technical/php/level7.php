<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Level 7</title>
    <link id="theme-link" rel="stylesheet" href="../css/level7.css">
</head>
<body>

<div class="menu">
    <form method="GET">
        <h3>Using the HW3 CSS Version</h3>
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
                    echo "<option value=\"$folder\" $selected>" . ucfirst($folder) . "</option>";//from tutorial: ucfirst can convert the first character of "hello" to uppercase
                }
            ?>
        </select>
    </form>
</div>

<div class="slidesFrame" id="slideContainer">
    <?php
        $folderPath = "$baseDir/$selectedGroup";
        $images = glob("$folderPath/*.{jpg,jpeg}", GLOB_BRACE);
        $captions = [];
        $index = 1;

        if (count($images) > 0) {
            foreach ($images as $img) {
                $caption = ucfirst(pathinfo($img, PATHINFO_FILENAME));
                $captions[] = $caption;

                echo "<div class='slides fadeIn'>";
                echo "<div class='orderNum'>$index / " . count($images) . "</div>";
                echo "<img src=\"$img\" alt=\"$caption\" style=\"width:100%\">";
                echo "<div class='caption'>$caption</div>";
                echo "</div>";
                $index++;
            }
        } else {
            echo "<div class='slides fadeIn'>";
            echo "<div class='caption'>There is no image in this folder!</div>";
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

<script src="../js/level7.js"></script>

</body>
</html>
