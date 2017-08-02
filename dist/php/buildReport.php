<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка: " . mysqli_connect_error());
	// ee
	// resid
	// app
	// org
	// reg
	// dep
	// fac

	// dipdatefrom
	// dipdateto
	// isDoctor
	// gender
	// isCowoker
	// experiance
	$source = $_POST["tableIds"];
	$tables = array();
	$fields = array();
	$lastPart = array();
	$hasKey = false;

	$query = "";
	if (count($source) == 1) {
		if ($source[0] == 1) {
			$query = "SELECT COUNT(*) AS Total FROM personal_card ";

			$tablesPersonal = [
				"est" => "personal_establishment",
				"resid" => "countries",
				"app" => "personal_appointment",
				"org" => "personal_organizations",
				"regions" => "regions",
				"dep" => "personal_department",
				"fac" => "personal_faculty"
			];

			$fieldsPersonal = [
				"est" => "ee",
				"resid" => "citizenship",
				"app" => "appointment",
				"org" => "organization",
				"regions" => "region",
				"dep" => "department",
				"fac" => "faculty"
			];
		}else if($source[0] == 2){
			$query = "SELECT COUNT(*) AS Total FROM arrivals ";

			$tablesArrivals = [
				"faculties" => "faculties",
				"forms" => "formofeducation",
				"educTypes" => "educType",
				"cathedra" => "cathedras",
				"courses" => "course"
			];

			$fieldsArrivals = [
				"faculties" => "FacultId",
				"forms" => "FormEduc",
				"educTypes" => "EducType",
				"cathedra" => "CathedrId",
				"courses" => "CourseId"
			];
		}
	}else if (count($source) == 2) {
			$tablesPersonal = [
				"est" => "personal_establishment",
				"resid" => "countries",
				"app" => "personal_appointment",
				"org" => "personal_organizations",
				"regions" => "regions",
				"dep" => "personal_department",
				"fac" => "personal_faculty"
			];

			$fieldsPersonal = [
				"est" => "ee",
				"resid" => "citizenship",
				"app" => "appointment",
				"org" => "organization",
				"regions" => "region",
				"dep" => "department",
				"fac" => "faculty"
			];

			$tablesArrivals = [
				"faculties" => "faculties",
				"forms" => "formofeducation",
				"educTypes" => "educType",
				"cathedra" => "cathedras",
				"courses" => "course"
			];

			$fieldsArrivals = [
				"faculties" => "FacultId",
				"forms" => "FormEduc",
				"educTypes" => "EducType",
				"cathedra" => "CathedrId",
				"courses" => "CourseId"
			];

			$query = "SELECT COUNT(*) AS Total FROM personal_card INNER JOIN arrivals ON personal_card.unique_Id = arrivals.PersonLink ";
	}
	if (count($source) == 1 && $source[0] == 1) {
		foreach ($tablesPersonal as $key => $value) {
			if (isset($_POST["personal"][$key])) {
				$postValue = $_POST["personal"][$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON personal_card." . $fieldsPersonal[$key] . " = " . $value . ".id ";
				if ($key == "regions") {
					$lastPartRegions = array();
					foreach ($postValue as $keyReg => $valueReg) {
						$lastPartItem = $value . ".id = '" . $valueReg . "'";
						array_push($lastPartRegions, $lastPartItem);	
					}
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		if (isset($_POST["personal"]["dipdatefrom"])){
			$dipdatefrom = $_POST["personal"]["dipdatefrom"];
		}
		if(isset($_POST["personal"]["dipdateto"])){
			$dipdateto = $_POST["personal"]["dipdateto"];
		}
		if(isset($_POST["personal"]["isDoctor"])){
			$isDoctor = $_POST["personal"]["isDoctor"];
		}
		if(isset($_POST["personal"]["gender"])){
			$gender = $_POST["personal"]["gender"];
		}
		if(isset($_POST["personal"]["isCowoker"])){
			if ($_POST["personal"]["isCowoker"] === "true") {
				$isCowoker = 1;
			}else{
				$isCowoker = 0;
			}
		}
		if(isset($_POST["personal"]["experiance"])){
			$experiance = $_POST["personal"]["experiance"];
		}

		if ($hasKey || 
			isset($dipdatefrom) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance)) {
			$query .= "WHERE ";
		}
		if (!empty($lastPart)) {
			$lastPartString = implode(" AND ", $lastPart);
			$query .= $lastPartString;
		}

		if (isset($lastPartRegions)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartRegions);
			$query .= "(" .$lastPartString . ")";
		}

		if ((!empty($lastPart) || isset($lastPartRegions)) && 
			(isset($dipdatefrom) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance))) {
			$query .= " AND ";
		}
		if (isset($dipdatefrom) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance)){
			$needAnd = false;
			if(isset($dipdatefrom)){
				$query .= " personal_card.diploma_start > '$dipdatefrom' ";
				$needAnd = true;
			}
			if(isset($dipdateto)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.diploma_start < '$dipdateto'";
				$needAnd = true;
			}
			if(isset($isDoctor)){
				if($needAnd){
					$query .= " AND ";
				}
				if ($isDoctor === "true") {
					$flag = 1;
				}else{
					$flag = 0;
				}
				$query .= " personal_card.isDoctor = '$flag'";
				$needAnd = true;
			}
			if(isset($gender)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.isMale = '$gender'";
				$needAnd = true;
			}
			if(isset($isCowoker)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.isCowoker = '$isCowoker'";
				$needAnd = true;
			}
			if(isset($experiance)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.experience_general >= '$experiance'";
			}
		}
		// echo $query;
		// print_r($_POST);
		$result = $mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
		$response = $result->fetch_assoc();
		// print_r($response);	
	}else if (count($source) == 1 && $source[0] == 2) {
		foreach ($tablesArrivals as $key => $value) {
			if (isset($_POST["educational"][$key])) {
				$postValue = $_POST["educational"][$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON arrivals." . $fieldsArrivals[$key] . " = " . $value . ".id ";
				if ($key == "faculties") {
					$lastPartFaculties = array();
					foreach ($postValue as $keyFac => $valueFac) {
						$lastPartItem = $value . ".id = '" . $valueFac . "'";
						array_push($lastPartFaculties, $lastPartItem);	
					}
				}else if ($key == "forms") {
					$lastPartForms = array();
					foreach ($postValue as $keyForms => $valueForms) {
						$lastPartItem = $value . ".id = '" . $valueForms . "'";
						array_push($lastPartForms, $lastPartItem);	
					}
				}else if ($key == "educTypes") {
					$lastPartEducType = array();
					foreach ($postValue as $keyEducType => $valueEducType) {
						$lastPartItem = $value . ".id = '" . $valueEducType . "'";
						array_push($lastPartEducType, $lastPartItem);	
					}
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		if (isset($_POST["educational"]["groupNumber"])){
			$groupNumber = $_POST["educational"]["groupNumber"];
		}
		
		if ($hasKey || isset($groupNumber)) {
			$query .= "WHERE ";
		}
		if (!empty($lastPart)) {
			$lastPartString = implode(" AND ", $lastPart);
			$query .= $lastPartString;
		}

		if (isset($lastPartFaculties)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartFaculties);
			$query .= "(" .$lastPartString . ")";
		}

		if (isset($lastPartForms)) {
			if (!empty($lastPart) || isset($lastPartFaculties)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartForms);
			$query .= "(" .$lastPartString . ")";
		}

		if (isset($lastPartEducType)) {
			if (!empty($lastPart) || isset($lastPartFaculties) || isset($lastPartForms)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartEducType);
			$query .= "(" .$lastPartString . ")";
		}

		if ((!empty($lastPart) || 
			isset($lastPartRegions) || 
			isset($lastPartFaculties) || 
			isset($lastPartForms) || 
			isset($lastPartEducType)) && 
			isset($groupNumber)) {
			$query .= " AND ";
		}
		if (isset($groupNumber)){
			$query .= " arrivals.GroupNum = '$groupNumber' ";
		}
		// echo $query;
		// print_r($_POST);
		$result = $mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
		$response = $result->fetch_assoc();
		// print_r($response);	
	}else if (count($source) == 2) {
		foreach ($tablesPersonal as $key => $value) {
			if (isset($_POST["personal"][$key])) {
				$postValue = $_POST["personal"][$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON personal_card." . $fieldsPersonal[$key] . " = " . $value . ".id ";
				if ($key == "regions") {
					$lastPartRegions = array();
					foreach ($postValue as $keyReg => $valueReg) {
						$lastPartItem = $value . ".id = '" . $valueReg . "'";
						array_push($lastPartRegions, $lastPartItem);	
					}
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		foreach ($tablesArrivals as $key => $value) {
			if (isset($_POST["educational"][$key])) {
				$postValue = $_POST["educational"][$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON arrivals." . $fieldsArrivals[$key] . " = " . $value . ".id ";
				// faculties
				// forms
				// educTypes
				if ($key == "faculties") {
					$lastPartFaculties = array();
					foreach ($postValue as $keyFac => $valueFac) {
						$lastPartItem = $value . ".id = '" . $valueFac . "'";
						array_push($lastPartFaculties, $lastPartItem);	
					}
				}else if ($key == "forms") {
					$lastPartForms = array();
					foreach ($postValue as $keyForms => $valueForms) {
						$lastPartItem = $value . ".id = '" . $valueForms . "'";
						array_push($lastPartForms, $lastPartItem);	
					}
				}else if ($key == "educTypes") {
					$lastPartEducType = array();
					foreach ($postValue as $keyEducType => $valueEducType) {
						$lastPartItem = $value . ".id = '" . $valueEducType . "'";
						array_push($lastPartEducType, $lastPartItem);	
					}
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		if (isset($_POST["educational"]["groupNumber"])){
			$groupNumber = $_POST["educational"]["groupNumber"];
		}
		if (isset($_POST["personal"]["dipdatefrom"])){
			$dipdatefrom = $_POST["personal"]["dipdatefrom"];
		}
		if(isset($_POST["personal"]["dipdateto"])){
			$dipdateto = $_POST["personal"]["dipdateto"];
		}
		if(isset($_POST["personal"]["isDoctor"])){
			$isDoctor = $_POST["personal"]["isDoctor"];
		}
		if(isset($_POST["personal"]["gender"])){
			$gender = $_POST["personal"]["gender"];
		}
		if(isset($_POST["personal"]["isCowoker"])){
			if ($_POST["personal"]["isCowoker"] === "true") {
				$isCowoker = 1;
			}else{
				$isCowoker = 0;
			}
		}
		if(isset($_POST["personal"]["experiance"])){
			$experiance = $_POST["personal"]["experiance"];
		}

		if ($hasKey || 
			isset($groupNumber) || 
			isset($dipdatefrom) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance) ||
			isset($groupNumber)) {
			$query .= "WHERE ";
		}
		if (!empty($lastPart)) {
			$lastPartString = implode(" AND ", $lastPart);
			$query .= $lastPartString;
		}

		if (isset($lastPartRegions)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartRegions);
			$query .= "(" .$lastPartString . ")";
		}

		if (isset($lastPartFaculties)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartFaculties);
			$query .= "(" .$lastPartString . ")";
		}
		if (isset($lastPartForms)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartForms);
			$query .= "(" .$lastPartString . ")";
		}
		if (isset($lastPartEducType)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
			}
			$lastPartString = implode(" OR ", $lastPartEducType);
			$query .= "(" .$lastPartString . ")";
		}

		if ((!empty($lastPart) || 
			isset($lastPartRegions) || 
			isset($lastPartFaculties) || 
			isset($lastPartForms) || 
			isset($lastPartEducType)) && 
			(isset($dipdatefrom) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance))) {
			$query .= " AND ";
		}
		if (isset($dipdatefrom) || 
			isset($groupNumber) || 
			isset($dipdateto) || 
			isset($isDoctor) || 
			isset($gender) || 
			isset($isCowoker) || 
			isset($experiance)){
			$needAnd = false;

			if(isset($dipdatefrom)){
				$query .= " personal_card.diploma_start > '$dipdatefrom' ";
				$needAnd = true;
			}
			if(isset($groupNumber)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " arrivals.GroupNum = '$groupNumber'";
				$needAnd = true;
			}
			if(isset($dipdateto)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.diploma_start < '$dipdateto'";
				$needAnd = true;
			}
			if(isset($isDoctor)){
				if($needAnd){
					$query .= " AND ";
				}
				if ($isDoctor === "true") {
					$flag = 1;
				}else{
					$flag = 0;
				}
				$query .= " personal_card.isDoctor = '$flag'";
				$needAnd = true;
			}
			if(isset($gender)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.isMale = '$gender'";
				$needAnd = true;
			}
			if(isset($isCowoker)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.isCowoker = '$isCowoker'";
				$needAnd = true;
			}
			if(isset($experiance)){
				if($needAnd){
					$query .= " AND ";
				}
				$query .= " personal_card.experience_general >= '$experiance'";
			}
		}
		// echo $query;
		// print_r($_POST);
		$result = $mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
		$response = $result->fetch_assoc();
		// print_r($response);	
	}
	echo $query;
	print_r($_POST);
	echo json_encode($response);
?>