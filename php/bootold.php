<?php
   //insert data here
  $pinstatus[0] = array(
     array("Licht",24,0),
     array("Strom1",17,0),
     array("Strom2",27,0),
     array("Strom3",22,0),
     array("Strom4",18,0),
     array("Strom5",23,0)
   );
   $pinstatus[1] = array(
     array("switch1",16,5),
     array("switch2",15,1)
   );
   //save the file
   file_put_contents('data.json',json_encode($pinstatus));
   unset($data);//release memory
   exec ("/scripts/gpio/relai/boot.sh");
 ?>
