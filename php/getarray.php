<?php
  $file = file_get_contents('data.json');
  $pins = json_decode($file);
  //because one dimesion to much
  echo (json_encode($pins));
?>
