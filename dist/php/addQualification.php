<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	$newQu = $_GET["name"];
	$id = $_GET["idPerson"];
	$result = $mysqli->query("SELECT id FROM personal_qualification_list WHERE name = '$newQu'");

	if ($result->{"num_rows"} > 0) {
		$qualificationIdObj = $result->fetch_assoc();
		$quId = $qualificationIdObj["id"];
	}else{
		$mysqli->query("INSERT INTO personal_qualification_list ('name') VALUES ('$newQu')");
		$newQuObj = $mysqli->query("SELECT id FROM personal_qualification_list WHERE name = '$newQu'");
		$qualificationIdObj = $newQuObj->fetch_assoc();
		$quId = $qualificationIdObj["id"];
	}

	$link = $mysqli->query("SELECT unique_Id FROM personal_card WHERE id = $id");
	$linkObj = $link->fetch_assoc();
	$personId = $link["unique_Id"];
	$mysqli->query("INSERT INTO personal_qualification (idPerson, idSpeciality) VALUES ('$personId','$quId')");

	$response["name"] = $newQu;

	echo json_encode($response);
?>