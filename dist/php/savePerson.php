<?php 
	ini_set("display_errors", 1);

	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());
	function getIdFromTable($parameter, $tableName, $mysqli){
		$SqlObj = $mysqli->query("SELECT id FROM $tableName WHERE name = '$parameter'") or die ("Ошибка: " . mysqli_error($mysqli));
		if ($SqlObj->{"num_rows"} > 0) {
			$SqlArr = $SqlObj->fetch_assoc();
			$id = $SqlArr["id"];
		}
		else{
			$mysqli->query("INSERT INTO $tableName (name) VALUES ('$parameter');") or die ("Ошибка: " . mysqli_error($mysqli));
			$SqlObj = $mysqli->query("SELECT MAX(id) FROM $tableName") or die ("Ошибка: " . mysqli_error($mysqli));
			$SqlArr = $SqlObj->fetch_assoc();
			$id = $SqlArr["id"];
		}
		return $id;
	}
	$EstName = $_POST["EstName"];
	$estId = getIdFromTable($EstName, "personal_establishment", $mysqli);
	$AppName = $_POST["AppName"];
	$appId = getIdFromTable($AppName, "personal_appointment", $mysqli);
	$ResName = $_POST["ResName"];
	$resId = getIdFromTable($ResName, "Residence", $mysqli);
	$OrgName = $_POST["OrgName"];
	$orgId = getIdFromTable($OrgName, "personal_organizations", $mysqli);
	$RegName = $_POST["RegName"];
	$regId = getIdFromTable($RegName, "regions", $mysqli);
	$DepName = $_POST["DepName"];
	$depid = getIdFromTable($DepName, "personal_department", $mysqli);
	$FacName = $_POST["FacName"];
	$facId = getIdFromTable($FacName, "personal_faculty", $mysqli);

	$surname = $_POST["surname"];
	$name = $_POST["name"];
	$patername = $_POST["patername"];
	$birthday = $_POST["birthday"];
	$diploma_start = $_POST["diploma_start"];
	$tel_number = $_POST["tel_number"];
	$isDoctor = $_POST["isDoctor"] ? 1 : 0;
	$insurance_number = $_POST["insurance_number"];
	$diploma_number = $_POST["diploma_number"];
	$exp = $_POST["exp"];
	$expAdd = $_POST["expAdd"];
	$isMale = $_POST["isMale"];
	$isCowoker = $_POST["isCowoker"];
	$in_to_form = $_POST["in_to_form"];

	$simbols = "ASDFGHJKLQWERTYUIOPZXCVBNM123456789";

	$unique_Id = "";
	$isNotUnique = true;
	while ($isNotUnique) {
		for ($i=0; $i < 32; $i++) { 
			$unique_Id .= $simbols[rand(0, 31)];
		}
		$result = $mysqli->query("SELECT id FROM personal_card WHERE unique_id = '$unique_Id'");

		if ($result->{"num_rows"} == 0) {
			$isNotUnique = false;
		}
	}
	$mysqli->query("INSERT INTO personal_card (surname, name, patername, birthday, ee, citizenship, diploma_start, appointment, isDoctor, tel_number, organization, region, isMale, isCowoker, experience_general, experiance_special, insurance_number, department, unique_Id, faculty, name_in_to_form, diploma_number) VALUES ('$surname', '$name', '$patername', '$birthday', '$estId', '$resId', '$diploma_start', '$appId', '$isDoctor', '$tel_number', '$orgId', '$regId', '$isMale', '$isCowoker', '$exp', '$expAdd', '$insurance_number', '$DepName', '$unique_Id', '$facId', '$in_to_form', '$diploma_number')") or die ("Ошибка: " . mysqli_error($mysqli));


	if (isset($_POST["specialities"])) {
		$specialities = $_POST["specialities"];

		foreach ($specialities as $key => $value) {
			$spId = getIdFromTable($value, "personal_speciality_list", $mysqli);
			$mysqli->query("INSERT INTO personal_speciality ('idPerson', idSpeciality) VALUES ('$unique_Id', $spId)");
		}
	}
	if (isset($_POST["qualifications"])) {
		$qualifications = $_POST["qualifications"];

		foreach ($qualifications as $key => $value) {
			$quId = getIdFromTable($value, "personal_qualifications_list", $mysqli);
			$mysqli->query("INSERT INTO personal_qualification ('idPerson', idQualification) VALUES ('$unique_Id', $quId)");
		}
	}
	myqli_close($mysqli);
?>