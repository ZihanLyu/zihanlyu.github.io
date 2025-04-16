<?php
function extractFolderNumber($path) {
    $basename = basename($path);
    $weekNrString = substr($basename,-2);
    return $weekNr = (int)$weekNrString;
}
?>