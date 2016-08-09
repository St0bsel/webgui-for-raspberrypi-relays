<?php
  //load file
  $file = file_get_contents('data.json');
  $pins = json_decode($file);

  //get data from POST over ajax in JS script
  $pin = $_POST['pin'];
  $name = $_POST['name'];
  $gpiopin = $_POST['gpiopin'];
  $method = $_POST['method'];

  //method 2 = remove relay
  //method 1 = change name and gpiopin
  //method 0 = change gpiopin status
  if ($method == 1){
	$pins[0][$pin][0] = $name;
	$pins[0][$pin][1] = $gpiopin;
  }
  elseif ($method == 2) {
    array_splice($pins[0], $pin, 1);
  }

  else {
		$pintochange = $pins[0][$pin][1];

	  if ($pins[0][$pin][2] == 1) {
		exec ("gpio -g write ".$pintochange." 0");
		$pins[0][$pin][2] = 0;
	  }
	  else {
		exec ("gpio -g write ".$pintochange." 1");
		$pins[0][$pin][2] = 1;
	  }
  }
  $send = json_encode($pins);
	file_put_contents('data.json',$send);
  echo $name;
 ?>
