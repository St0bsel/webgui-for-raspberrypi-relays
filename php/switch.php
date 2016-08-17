<?php
function httpPost($url,$params)
{
  $postData = '';
   //create name value pairs seperated by &
   foreach($params as $k => $v)
   {
      $postData .= $k . '='.$v.'&';
   }
   $postData = rtrim($postData, '&');

    $ch = curl_init();

    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, count($postData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

    $output=curl_exec($ch);

    curl_close($ch);
    return $output;
}

while (true) {
	
  ob_start();
  include('getarray.php');
  $file = ob_get_contents();
  ob_end_clean();
  $pins = json_decode($file);
  $pinarray_length = count($pins[0]);
  $switcharray_length = count($pins[1]);

  for ($i=0; $i < $switcharray_length; $i++) {
    $gpiopin = $pins[1][$i][1];
    $status2 = $pins[1][$i][3];
    $status = exec("gpio -g read ".$gpiopin);
    $statusint = $status;[0];
		echo "status2 is ".$status2."and status is ".$status."\n";
    if ($status == $status2) {
      if ($status2 == 1) {
        $status3 = 0;
      }
      elseif ($status2 == 0) {
        $status3 = 1;
      }

      $params = array(
          "change" => $i,
         "status" => $status3,
         "method" => "5"
      );
      echo httpPost("http://localhost/php/change.php",$params);
    }
  }
  sleep(5);
}
 ?>
