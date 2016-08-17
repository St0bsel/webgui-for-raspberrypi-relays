<?php
  //load data from file and get length of array
  $file = file_get_contents('data.json');
  $pins = json_decode($file);
  $pin_length = count($pins[0]);
	$switch_length = count($pins[1]);
	
  //loop through array to reset all relays
  for ($i=0; $i < $pin_length; $i++) {
    $status = $pins[0][$i][2];
		$gpiopin = $pins[0][$i][1];
		exec("gpio export ".$gpiopin." out");
		exec("gpio -g write ".$gpiopin." ".$status);
  }
	
	for ($i = 0; $i < $switch_length; $i++) {
		$gpiopin = $pins[1][$i][1];
		exec("gpio -g mode ".$gpiopin." in");
		exec("gpio -g mode ".$gpiopin." up");
	}

  //safe resetet data to file
  $send = json_encode($pins);
  file_put_contents('data.json',$send);
?>
