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
	$response["SpecialityList"] = getOptions("SELECT name FROM `personal_speciality_list`", $mysqli);
	$response["QualificationList"] = getOptions("SELECT name FROM `personal_qualifications_list`", $mysqli);
	$response["countryList"] = getOptions("SELECT name FROM `countries`", $mysqli);
	$response["organizationList"] = getOptions("SELECT name FROM `personal_organizations`", $mysqli);
	$response["regionList"] = getOptions("SELECT name FROM `regions`", $mysqli);
	$response["departmentList"] = getOptions("SELECT name FROM `personal_department`", $mysqli);
	$response["facultyList"] = getOptions("SELECT name FROM `personal_faculty`", $mysqli);

	echo json_encode($response);
	
?>