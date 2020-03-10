<?php
 // create a file if it is not exist
   $userName = $_POST['fileName'];
	$modelName = $_POST['modelName'];
	$timeToSolve = $_POST['time'];
	$errCount = $_POST['errCount'];
	$errDetails = $_POST['errDetails'];
	$logDate = date("Y-m-d");
	
	$servername = "localhost";
	$dbUser = "ndks";
	$dbPass = "ndkspass";
	$dbName = "ndks";

	// Create connection
	$db = new mysqli($servername, $dbUser, $dbPass, $dbName);
	$db->set_charset('utf8');
	// Check connection
	if ($db->connect_error) {
		 die("Connection failed: " . $db->connect_error);
	}

	$sql = "INSERT INTO log ( userName,    modelName,    timeToSolve,    errCount,    errDetails,    logDate)
				        VALUES ('$userName', '$modelName', '$timeToSolve', '$errCount', '$errDetails', '$logDate')";

	if ($db->query($sql) === TRUE) {
		 echo "New record created successfully";
	} else {
		 echo "Error: " . $sql . "<br>" . $db->error;
	}

	$db->close();
?>