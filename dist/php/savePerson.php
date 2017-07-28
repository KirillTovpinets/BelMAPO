<?php 
	ini_set("display_errors", 1);

	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	function cleanFields($elem){
		return strip_tags($elem);
	}

	extract(array_map("cleanFields", $_POST));

	print_r($_POST);
?>