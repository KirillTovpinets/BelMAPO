<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	$newSp = $_GET["name"];
	$id = $_GET["idPerson"];
	$result = $mysqli->query("SELECT id FROM personal_speciality_list WHERE name = '$newSp'");

	if ($result->{"num_rows"} > 0) {
		$specialityIdObj = $result->fetch_assoc();
		$spId = $specialityIdObj["id"];
	}else{
		$mysqli->query("INSERT INTO personal_speciality_list ('name') VALUES ('$newSp')");
		$newSpObj = $mysqli->query("SELECT id FROM personal_speciality_list WHERE name = '$newSp'");
		$specialityIdObj = $newSpObj->fetch_assoc();
		$spId = $specialityIdObj["id"];
	}

	$link = $mysqli->query("SELECT unique_Id FROM personal_card WHERE id = $id");
	$linkObj = $link->fetch_assoc();
	$personId = $link["unique_Id"];
	$mysqli->query("INSERT INTO personal_speciality (idPerson, idSpeciality) VALUES ('$personId','$spId')");

	mysqli_close($mysqli);
	$response["name"] = $newSp;

	echo json_encode($response);
?>