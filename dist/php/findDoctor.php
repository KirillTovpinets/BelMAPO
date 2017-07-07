<?php 
	require_once("config.php");
	ini_set("display_errors", 1);

	function cleanFields($elem){
		return strip_tags($elem);
	}

	extract(array_map('cleanFields', $_POST));
// gender
// surname
// establishment
// appointment
// speciality_main
// speciality_rep
// speciality_other
// qualification_main
// qualification_add
// qualification_other
// fromAge
// toAge

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());
	$query = "SELECT surname, name, patername, birthday FROM personal_card WHERE ";

	if (isset($surname)) {
		$query .= " surname LIKE '$surname'";
	}
	// else if(!(isset($surname) && isset($establishment)){
	// 	$query .= "INNER JOIN personal_establishment ON personal_card.ee = personal_establishment.id WHERE personal_establishment.name LIKE '$establishment'";
	// }else if(isset($surname) && isset($establishment)){
	// 	$query .= "INNER JOIN personal_establishment ON personal_card.ee = personal_establishment.id WHERE personal_establishment.name LIKE '$establishment' AND personal_card.surname LIKE '$surname'";
	// }
	
	$result = $mysqli->query($query) or die ("Ошибка запроса: " . mysqli_error($mysqli));
	mysqli_close($mysqli);

	$list = array();

	$today = date_create(date("Y-m-d"));
	while ($row = $result->fetch_assoc()) {
		$bth = date_create($row["birthday"]);
		$age = date_diff($today, $bth);
		$ageNum = $age->format("%y");
		// echo $age;
		if (($ageNum > $fromAge) && ($ageNum < $toAge)) {
			array_push($list, $row);
		}
	}
	echo json_encode($list);
?>