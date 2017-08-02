<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	function getSqlObj($tableName, $mysqli){
		$result = $mysqli->query("SELECT * FROM $tableName");
		return $result;
	}
	function getArray($SqlObj){
		$newArray = array();
		while ($row = $SqlObj->fetch_assoc()) {
			if ($row["id"] == 0) {
				continue;
			}
			array_push($newArray, $row);
		}
		return $newArray;
	}

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

	$estObj = getSqlObj("personal_establishment", $mysqli);
	$residObj = getSqlObj("countries", $mysqli);
	$appObj = getSqlObj("personal_appointment", $mysqli);
	$orgObj = getSqlObj("personal_organizations", $mysqli);
	$regObj = getSqlObj("regions", $mysqli);
	$depObj = getSqlObj("personal_department", $mysqli);
	$facObj = getSqlObj("personal_faculty", $mysqli);

	$facBelMAPOObj = getSqlObj("faculties", $mysqli);
	$cathBelMAPOObj = getSqlObj("cathedras", $mysqli);
	$coursesBelMAPOObj = getSqlObj("cources", $mysqli);
	$formBelMAPOObj = getSqlObj("formofeducation", $mysqli);
	$educTypeBelMAPOObj = getSqlObj("educType", $mysqli);

	$estArr = getArray($estObj);
	$residArr = getArray($residObj);
	$appArr = getArray($appObj);
	$orgArr = getArray($orgObj);
	$regArr = getArray($regObj);
	$depArr = getArray($depObj);
	$facArr = getArray($facObj);

	$facBel = getArray($facBelMAPOObj);
	$cathBel = getArray($cathBelMAPOObj);
	$coursesBel = getArray($coursesBelMAPOObj);
	$formBel = getArray($formBelMAPOObj);
	$educTypeBel = getArray($educTypeBelMAPOObj);

	$response['estArr'] = $estArr;
	$response['residArr'] = $residArr;
	$response['appArr'] = $appArr;
	$response['orgArr'] = $orgArr;
	$response['regArr'] = $regArr;
	$response['depArr'] = $depArr;
	$response['facArr'] = $facArr;

	$response['facBel'] = $facBel;
	$response['cathBel'] = $cathBel;
	$response['coursesBel'] = $coursesBel;
	$response['formBel'] = $formBel;
	$response['educTypeBel'] = $educTypeBel;
	echo json_encode($response);
?>