<?php
function extractFolderNumber($path) {

    $basename = basename($path);
    $weekNrString = substr($basename,-1);
    return $weekNr = (int)$weekNrString;
}
?>