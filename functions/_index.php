<?php
	$oriCharSet = array('1', '2', '3', '4', '5', '6', '7');			// 1, 2, 3...
    $oriColorSet = array('red', 'orange', 'yellow', 'green', 'pink', 'purple', 'grass');	//grass, red, orange...


    $optionSet = array();
    for($i = 0; $i<sizeof($oriCharSet); $i++)
    {
    	$optionSet[] = ConstructPath($oriCharSet[$i], $oriColorSet[$i]);
    }

    var_dump($optionSet);
  //   while (sizeof($charSet) >5)
  //   {
  //   	$remove = rand(0, sizeof($charSet)-1);
  //   	unset($charSet[$remove]);
		// unset($colorSet[$remove]);
	 //    $charSet = array_values($charSet);
	 //    $colorSet = array_values($colorSet);
  //   }


function ConstructPath($char, $color)
{
	$paths = "../img/".$color."/".$char.".png";
	var_dump($paths);
}

?>