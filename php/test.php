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
    echo "gpiopin ".$gpiopin." status2 ".$status2."</br>";
    $status = exec("gpio -g read ".$gpiopin);
    $statusint = $status;//[0];

    if ($status == $status2) {
      if ($status2 == 1) {
        $status2 = 0;
      }
      elseif ($status2 == 0) {
        $status2 = 1;
      }

      $params = array(
          "change" => $i,
         "status" => $status2,
         "method" => "5"
      );
      echo httpPost("https://zweifel.org/beta/test/php/change.php",$params);
    }
  }
  sleep(2);
 ?>
