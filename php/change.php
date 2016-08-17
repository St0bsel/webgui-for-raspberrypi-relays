<?php
  //load file
  $file = file_get_contents('data.json');
  $pins = json_decode($file);

  //get data from POST over ajax in JS script
  $change = $_POST['change'];
  $name = $_POST['name'];
  $gpiopin = $_POST['gpiopin'];
  $method = $_POST['method'];
  $relay = $_POST['relay'];
  $status = $_POST['status'];

  //method 5 = change status from switch
  //method 4 = remove switch
  //method 3 = change name, gpiopin and relay from switches
  //method 2 = remove relay
  //method 1 = change name and gpiopin
  //method 0 = change gpiopin status
  if ($method == 1){
	$pins[0][$change][0] = $name;
	$pins[0][$change][1] = $gpiopin;
  }

  elseif ($method == 2) {
    array_splice($pins[0], $change, 1);
  }

  elseif ($method == 3) {
    $pins[1][$change][0] = $name;
    $pins[1][$change][1] = $gpiopin;
    $pins[1][$change][2] = $relay;
  }

  elseif ($method == 4) {
    array_splice($pins[1], $change, 1);
  }

  elseif ($method == 5) {
    $pins[1][$change][3] = $status;
    $relay = $pins[1][$change][2];
    $pintochange = $pins[0][$relay][1];

    //change status from relay
	  if ($pins[0][$relay][2] == 1) {
		    exec ("gpio -g write ".$pintochange." 0");
		    $pins[0][$relay][2] = 0;
	  }
	  else {
		    exec ("gpio -g write ".$pintochange." 1");
		    $pins[0][$relay][2] = 1;
	  }
  }

  else {
		$pintochange = $pins[0][$change][1];

	  if ($pins[0][$change][2] == 1) {
		exec ("gpio -g write ".$pintochange." 0");
		$pins[0][$change][2] = 0;
	  }
	  else {
		exec ("gpio -g write ".$pintochange." 1");
		$pins[0][$change][2] = 1;
	  }
  }
  $send = json_encode($pins);
	file_put_contents('data.json',$send);
 ?>
