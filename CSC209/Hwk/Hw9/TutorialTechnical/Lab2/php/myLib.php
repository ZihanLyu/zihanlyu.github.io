<?php
function extractFolderNumber($path) {
    $labDir = dirname($path);
    $weekDir = dirname($labDir);
    $weekNrString = substr($weekDir,-2);
    return $weekNr = (int)$weekNrString;
}
?>