<div id="avatarSelectionModal" class="avatar-selection">
    <span class="close-avatars">&times;</span>
    <div class="avatar-grid">
        <?php
        $categories = [
            "Boys" => "boy",
            "Young Men" => "youngman",
            "Men" => "man",
            "Old Men" => "oldman",
            "Girls" => "girl",
            "Young Women" => "youngwoman",
            "Women" => "woman",
            "Old Women" => "oldwoman"
        ];

        foreach ($categories as $label => $prefix) {
            echo "<h3 class='avatar-category'>{$label}</h3>";
            for ($i = 1; $i <= 3; $i++) {
                $path = "../images/{$prefix}_{$i}.png";
                $alt = ucfirst($prefix) . " {$i}";
                echo "<img src='$path' class='avatar-option' data-avatar='$path' alt='$alt'>";
            }
        }
        ?>
        <div class="avatar-controls">
            <button class="confirm-avatar-btn">Confirm Selection</button>
        </div>
    </div>
</div>
