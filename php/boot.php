<?php
  //load data from file and get length of array
  $file = file_get_contents('data.json');
  $pins = json_decode($file);
  $array_length = count($pins[0]);

  //loop through array to reset all relays
  for ($i=0; $i < $array_length; $i++) {
    $status = $pins[0][$i][2];
		$gpiopin = $pins[0][$i][1];
		exec("gpio export ".$gpiopin." out");
		exec("gpio -g write ".$gpiopin." ".$status);
  }

  //safe resetet data to file
  $send = json_encode($pins);
  file_put_contents('data.json',$send);
?>
