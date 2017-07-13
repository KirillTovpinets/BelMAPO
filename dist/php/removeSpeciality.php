<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	
?>