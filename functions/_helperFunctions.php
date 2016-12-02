<?php
// _helperFunctions.php


function replace($text){
	$last = addslashes($text);
	$last = htmlspecialchars($last);
	$last = trim($last);
	return $last;
}
?>