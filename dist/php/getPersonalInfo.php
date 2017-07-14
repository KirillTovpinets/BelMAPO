<?php 
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());

//surname
//name
//patername
//birthday
//ee
//citizenship
//diploma_start
//appointment
//isDoctor
//tel_number
//organization
//region
//isMale
//isCowoker
//experience_general
//experiance_special
//insurance_number
//department
//isDeleted
//unique_Id
//faculty
//name_in_to_form
//diploma_number

	$id = $_GET["id"];
	$result = $mysqli->query("SELECT personal_card.surname AS surname, personal_card.name AS name, countries.name AS ResName, personal_card.patername AS patername, personal_card.birthday AS birthday, personal_establishment.name AS EstName, personal_card.diploma_start, personal_appointment.name AS AppName, personal_card.isDoctor AS isDoctor, personal_card.tel_number, personal_organizations.name AS OrgName, regions.name AS RegName, personal_card.isCowoker AS isCowoker, personal_card.experience_general, personal_card.experiance_special, personal_card.insurance_number, personal_department.name AS DepName, personal_faculty.name AS FacName, personal_card.diploma_number FROM personal_card INNER JOIN personal_establishment ON personal_card.ee=personal_establishment.id INNER JOIN personal_appointment ON personal_card.appointment = personal_appointment.id INNER JOIN personal_organizations ON  personal_card.organization = personal_organizations.id INNER JOIN countries ON personal_card.citizenship=countries.id INNER JOIN regions ON personal_card.region = regions.id INNER JOIN personal_department ON personal_card.department = personal_department.id INNER JOIN personal_faculty ON personal_card.faculty = personal_faculty.id WHERE personal_card.id = '$id'") or die ("Ошибка запроса: " . mysqli_error($mysqli));

	$specialitiesObj = $mysqli->query("SELECT `personal_speciality_list`.`name`, `personal_speciality_list`.`id`  FROM `personal_speciality_list` INNER JOIN `personal_speciality` ON `personal_speciality_list`.`id` = `personal_speciality`.`idSpeciality` INNER JOIN `personal_card` ON `personal_speciality`.`idPerson` = `personal_card`.`unique_Id` WHERE `personal_card`.`id` = $id") or die ("Ошибка запроса: " . mysqli_error($mysqli));

	$qualificatoinObj = $mysqli->query("SELECT `personal_qualifications_list`.`name`, `personal_qualifications_list`.`id`  FROM `personal_qualifications_list` INNER JOIN `personal_qualification` ON `personal_qualifications_list`.`id` = `personal_qualification`.`idQualification` INNER JOIN `personal_card` ON `personal_qualification`.`idPerson` = `personal_card`.`unique_Id` WHERE `personal_card`.`id` = $id") or die ("Ошибка запроса: " . mysqli_error($mysqli));
	mysqli_close($mysqli);

	if ($result->{"num_rows"} > 0) {
		$response["general"] = $result->fetch_assoc();
	}
	if ($specialitiesObj->{"num_rows"} > 0) {
		$sp = array();
		while ($row = $specialitiesObj->fetch_assoc()) {
			array_push($sp, $row);
		}
		$response["specialities"] = $sp;
	}
	if ($qualificatoinObj->{"num_rows"} > 0) {
		$qu = array();
		while ($row = $qualificatoinObj->fetch_assoc()) {
			array_push($qu, $row);
		}
		$response["qualifications"] = $qu;
	}
	echo json_encode($response);
?>