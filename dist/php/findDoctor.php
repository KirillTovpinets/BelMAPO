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

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());
	$query = "SELECT surname, name, patername, birthday FROM personal_card ";

	if (isset($surname)) {
		$query .= "WHERE surname LIKE '$surname'";
	}else if(!(isset($surname) && isset($establishment)){
		$query .= "INNER JOIN personal_establishment ON personal_card.ee = personal_establishment.id WHERE personal_establishment.name LIKE '$establishment'";
	}else if(isset($surname) && isset($establishment)){
		$query .= "INNER JOIN personal_establishment ON personal_card.ee = personal_establishment.id WHERE personal_establishment.name LIKE '$establishment' AND personal_card.surname LIKE '$surname'";
	}
	
	$result = $mysqli->query($query) or die ("Ошибка запроса: " . mysqli_error($mysqli));
	mysqli_close($mysqli);

	$list = array();

	while ($row = $result->fetch_assoc()) {
		array_push($list, $row);
	}

	echo json_encode($list);
?>