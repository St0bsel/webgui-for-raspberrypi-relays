<?php
$file = file_get_contents( __DIR__ . DIRECTORY_SEPARATOR .'data.json');
echo ($file);
unset($file);
exit(0);
?>
