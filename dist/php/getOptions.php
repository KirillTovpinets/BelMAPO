<?php
	ini_set("display_errors", 1);
	require_once("config.php");
	function getOptions($query, $mysqli){
		$result = $mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
		$optionList = array();

		while ($row = $result->fetch_assoc()) {
			array_push($optionList, $row);
		}

		return $optionList;
	}

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка: " . mysqli_connect_error());

	$response = array();
	$response["estList"] = getOptions("SELECT name FROM `personal_establishment`", $mysqli);
	$response["appList"] = getOptions("SELECT name FROM `personal_appointment`", $mysqli);
	$response["mainSpecialityList"] = getOptions("SELECT name FROM `personal_speciality(main)`", $mysqli);
	$response["repSpecialityList"] = getOptions("SELECT name FROM `personal_speciality(reprep)`", $mysqli);
	$response["otherSpecialityList"] = getOptions("SELECT name FROM `personal_speciality(other)`", $mysqli);
	$response["mainQualificationList"] = getOptions("SELECT name FROM `personal_qualification(main)`", $mysqli);
	$response["repQualificationList"] = getOptions("SELECT name FROM `personal_qualification(additional)`", $mysqli);
	$response["otherQualificationList"] = getOptions("SELECT name FROM `personal_qualification(other)`", $mysqli);

	echo json_encode($response);
	
?>