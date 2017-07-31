<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	function cleanFields($elem){
		return strip_tags($elem);
	}

	extract(array_map("cleanFields", $_POST));
	$tables = [
		"EstName" => "personal_establishment",
		"ResName" => "countries",
		"AppName" => "personal_appointment",
		"OrgName" => "personal_organizations",
		"RegName" => "regions",
		"DepName" => "personal_department",
		"FacName" => "personal_faculty",
	];

	$fields = [
		"EstName" => "ee",
		"ResName" => "citizenship",
		"AppName" => "appointment",
		"OrgName" => "organization",
		"RegName" => "region",
		"DepName" => "department",
		"FacName" => "faculty",
	];

	$originalFields = [
		"surname" => "surname",
		"name" => "name",
		"patername" => "patername",
		"birthday" => "birthday",
		"diploma_start" => "diploma_start",
		"tel_number" => "tel_number",
		"insurance_number" => "insurance_number",
		"diploma_number" => "diploma_number"
	];

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	$setIndexes = array();
	print_r($_POST);
	foreach ($tables as $key => $value) {
		if (isset($_POST[$key])) {
			echo "_POST[$key] = " . $_POST[$key] . "value = " . $value . "key = " . $value;
			$obj = $mysqli->query(makeQuery($_POST[$key], $value, $key)) or die ("Ошибка запроса: " . mysqli_error($mysqli));
			$fetch = $obj->fetch_assoc();
			$insert = $fetch[$key];
			array_push($setIndexes, "'$key' = '$insert'");
		}
	}

	$query = "UPDATE `personal_card` SET ";

	$setFields = array();
	foreach ($originalFields as $key => $value) {
		if (isset($_POST[$key])) {
			$NewValue = $_POST[$key];
			array_push($setFields, "'$key' = '$NewValue'");
		}
	}

	if (count($setFields) > 1) {
		$setFieldStr = implode(", ", $setFields);
	}else if(count($setFields) == 1){
		$setFieldStr = $setFields[0];
	}
	if (count($setIndexes) > 1) {
		$setIndexesStr = implode(", ", $setIndexes);
	}else if(count($setIndexes) == 1){
		$setIndexesStr = $setIndexes[0];
	}
	
	if (isset($setFieldStr)) {
		$query .= $setFieldStr;
	}
	
	if (isset($setIndexesStr)) {
		$query .= ", " . $setIndexesStr;
	}
	$query .= " WHERE id = '$id'";

	$mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
	mysqli_close($mysqli);


	function makeQuery($param, $table, $alias){
		return "SELECT id AS $alias FROM $table WHERE name = '$param'";
	}


?>