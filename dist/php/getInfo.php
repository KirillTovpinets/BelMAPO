<?php 
	ini_set("display_errors", 1);
	require_once("config.php");
	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка: " . mysqli_connect_error());

	$mysqli->query("SET NAMES utf8");

	if($_GET["info"] == 'lastten'){
		$result = $mysqli->query("SELECT arrivals.Date, arrivals.GroupNum, arrivals.ResidPlace, arrivals.Dic_count, faculties.name AS FacultName FROM arrivals INNER JOIN faculties ON arrivals.FacultId = faculties.id ORDER BY Date DESC LIMIT 10") or die ("Ошибка: " . mysqli_error($mysqli));
	}

	else if($_GET["info"] == 'nationality'){
		$result = $mysqli->query("SELECT name AS label, COUNT(*) AS y FROM (SELECT countries.name, arrivals.Date FROM personal_card INNER JOIN arrivals ON personal_card.unique_Id = arrivals.PersonLink INNER JOIN countries ON personal_card.citizenship = countries.id WHERE personal_card.citizenship != '5' LIMIT 1000) AS Last GROUP BY name") or die ("Ошибка: " . mysqli_error($mysqli));
	}

	else if($_GET["info"] == 'faculty'){
		$result = $mysqli->query("SELECT name AS label, COUNT(*) AS y FROM (SELECT faculties.name, arrivals.Date FROM arrivals INNER JOIN faculties ON arrivals.FacultId = faculties.id) AS Last GROUP BY name") or die ("Ошибка: " . mysqli_error($mysqli));
	}

	else if($_GET["info"] == 'speciality'){
		$result = $mysqli->query("SELECT CourseName AS label, COUNT(*) AS y FROM (SELECT cources.CourseName, arrivals.Date FROM arrivals INNER JOIN cources ON arrivals.CourseId = cources.id) AS Last GROUP BY CourseName") or die ("Ошибка: " . mysqli_error($mysqli));
	}
	$LastData = array();
	while($row = $result->fetch_assoc()){
		array_push($LastData, $row);
	}
	mysqli_close($mysqli);
	echo json_encode($LastData);
?>
