<?php 
	require_once("config.php");
	ini_set("display_errors", 1);

	function cleanFields($elem){
		return strip_tags($elem);
	}

	extract(array_map('cleanFields', $_POST));

	$tables = [
		"establishment" => "personal_establishment",
		"appointment" => "personal_appointment",
		"speciality_main" => "personal_speciality(main)",
		"speciality_rep" => "personal_speciality(reprep)",
		"speciality_other" => "personal_speciality(other)",
		"qualification_main" => "personal_qualification(main)",
		"qualification_add" => "personal_qualification(additional)",
		"qualification_other" => "personal_qualification(other)"
	];

	$fields = [
		"establishment" => "ee",
		"appointment" => "appointment",
		"speciality_main" => "speciality_main",
		"speciality_rep" => "speciality_rep",
		"speciality_other" => "speciality_other",
		"qualification_main" => "qualification_main",
		"qualification_add" => "qualification_add",
		"qualification_other" => "qualification_other"
	];

	
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
// count

	$query = "SELECT personal_card.id, personal_card.surname, personal_card.isMale, personal_card.name, personal_card.patername, personal_card.birthday FROM personal_card ";
	$lastPart = array();
	$hasKey = false;
	foreach ($tables as $key => $value) {
		if (isset($_POST[$key])) {
			$postValue = $_POST[$key];
			$hasKey = true;
			$query .= "INNER JOIN " . $value . " ON personal_card." . $fields[$key] . " = " . $value . ".id ";
			$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
			array_push($lastPart, $lastPartItem); 
		}
	}

	if ($hasKey || isset($surname)) {
		$query .= "WHERE ";
	}else{
		$query .= "WHERE personal_card.isMale = '$gender'";
	}

	if(isset($surname)){
		$query .= " personal_card.surname LIKE '$surname' ";
	}
	if (!empty($lastPart)) {
		$lastPartString = implode(" AND ", $lastPart);

		if (isset($surname)) {
			$query .= " AND ";
		}
		$query .= $lastPartString;
	}
	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());
	$query .= " ORDER BY personal_card.surname ASC";
	if ($offset == 0) {
		$query .= " LIMIT 6";
	}else{
		$query .= " LIMIT $count OFFSET $offset";
	}
	// echo $query;

	// print_r($_POST);	
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
			// print_r($_POST);
			// print_r($row);
		}
	}
	echo json_encode($list);
?>