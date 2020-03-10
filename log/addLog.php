<?php
 // create a file if it is not exist
   $fileName = $_POST['fileName'];
	$modelName = $_POST['modelName'];
	$time = $_POST['time'];
	$errCount = $_POST['errCount'];
	$errDetails = $_POST['errDetails'];
	$logDate = date("d.m.Y");
	$str = "{date: '$logDate',modelName: '$modelName', time: '$time', errCount: '$errCount', errDetails: '$errDetails'}";
	$newLine = "\n $fileName.push($str);";
	$path = 'log/'.$fileName.'.js';
	if (file_exists($path)) { // append to a file
		$handle = fopen($path, 'a') or die('Cannot open file:  '.$fileName); //implicitly creates file
		fwrite($handle, $newLine);	 
	}
	else{ // create and append to a file		
		$handle = fopen($path, 'w') or die('Cannot open file:  '.$fileName); //implicitly creates file
		$newUser = "\n".'let '.$fileName.' = [];';
		fwrite($handle, $newUser);
		fwrite($handle, $newLine);	
	}
	
	fclose($handle);	
	echo $str;

?>