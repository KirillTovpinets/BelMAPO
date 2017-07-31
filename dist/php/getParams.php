<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	function getSqlObj($tableName, $mysqli){
		$result = $mysqli->query("SELECT name FROM $tableName");
		return $result;
	}
	function getArray($SqlObj){
		$newArray = array();
		while ($row = $SqlObj->fetch_assoc()) {
			array_push($newArray, $row);
		}
		return $newArray;
	}

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	$estObj = getSqlObj("personal_establishment", $mysqli);
	$residObj = getSqlObj("Residence", $mysqli);
	$appObj = getSqlObj("personal_appointment", $mysqli);
	$orgObj = getSqlObj("personal_organizations", $mysqli);
	$regObj = getSqlObj("regions", $mysqli);
	$depObj = getSqlObj("personal_department", $mysqli);
	$facObj = getSqlObj("personal_faculty", $mysqli);

	$estArr = getArray($estObj);
	$residArr = getArray($residObj);
	$appArr = getArray($appObj);
	$orgArr = getArray($orgObj);
	$regArr = getArray($regObj);
	$depArr = getArray($depObj);
	$facArr = getArray($facObj);

	$response['estArr'] = $estArr;
	$response['residArr'] = $residArr;
	$response['appArr'] = $appArr;
	$response['orgArr'] = $orgArr;
	$response['regArr'] = $regArr;
	$response['depArr'] = $depArr;
	$response['facArr'] = $facArr;

	echo json_encode($response);
?>