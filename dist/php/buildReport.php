<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка: " . mysqli_connect_error());

	$source = $_POST["tableIds"];
	$tables = array();
	$fields = array();
	$lastPart = array();
	$labels = array();
	$hasKey = false;
	$response = array();
	$params = array();
	$query = "";
	$extraQuery = "";

	if (count($source) == 1) {
		if ($source[0] == 1) {
			$query = "FROM personal_card ";

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
			$query = "FROM arrivals ";

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

			$query = "FROM personal_card INNER JOIN arrivals ON personal_card.unique_Id = arrivals.PersonLink ";
	}


	if (count($source) == 1 && $source[0] == 1) {
		$inputRegions = array();
		$inputParamsIds = array();
		foreach ($tablesPersonal as $key => $value) {
			if (isset($_POST[$key]) && ($_POST[$key] != "")) {
				$postValue = $_POST[$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON personal_card." . $fieldsPersonal[$key] . " = " . $value . ".id ";
				if ($key == "regions") {
					$lastPartRegions = array();
					foreach ($postValue as $keyReg => $valueReg) {
						$lastPartItem = $value . ".id = '" . $valueReg . "'";
						$nameSqj = $mysqli->query("SELECT * FROM regions WHERE id = " . $valueReg);
						array_push($inputRegions,$nameSqj->fetch_assoc());
						array_push($lastPartRegions, $lastPartItem);	
					}
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					$result = $mysqli->query("SELECT * FROM $value WHERE name = '$postValue'") or die ("Ошибка: " . mysqli_error($mysqli));
					$inputParams = $result->fetch_assoc();
					$inputParamsIds[$inputParams["name"]] = array($fieldsPersonal[$key] => $inputParams["id"] );
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		if (isset($_POST["dipdatefrom"])){
			$dipdatefrom = $_POST["dipdatefrom"];
		}
		if(isset($_POST["dipdateto"])){
			$dipdateto = $_POST["dipdateto"];
		}
		if(isset($_POST["isDoctor"])){
			$isDoctor = $_POST["isDoctor"];
			$flag = ($isDoctor === "true") ? 1 : 0;
		}
		if(isset($_POST["gender"])){
			$gender = $_POST["gender"];
		}
		if(isset($_POST["isCowoker"])){
			$isCowoker = ($_POST["isCowoker"] === "true") ? 1 : 0;
		}
		if(isset($_POST["experiance"])){
			$experiance = $_POST["experiance"];
		}

		if ($hasKey || 
			((isset($dipdatefrom)) && ($dipdatefrom != "") && ($dipdatefrom != "false") || 
			(isset($dipdateto)) && ($dipdateto != "") && ($dipdateto != "false") || 
			(isset($isDoctor)) && ($isDoctor != "") && ($isDoctor != "false") || 
			(isset($gender)) && ($gender != "") && ($gender != "false") || 
			(isset($isCowoker)) && ($isCowoker != "") && ($isCowoker != "false") || 
			(isset($experiance)) && ($experiance != "") && ($experiance != "false"))) {
			$query .= "WHERE ";
		}
		$extraQueryPart = $query;
		if (!empty($lastPart)) {
			$lastPartString = implode(" AND ", $lastPart);
			$lastPartStringEx = implode(" OR ", $lastPart);
			$query .= $lastPartString;
			$extraQueryPart = $lastPartStringEx;
		}

		if (isset($lastPartRegions)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
				$extraQueryPart .= "OR";
			}
			$lastPartString = implode(" OR ", $lastPartRegions);
			$query .= "(" .$lastPartString . ")";
			$extraQueryPart .= "(" .$lastPartString . ")";
		}

		if ((!empty($lastPart) || isset($lastPartRegions)) && 
			((isset($dipdatefrom)) && ($dipdatefrom != "") && ($dipdatefrom != "false") || 
			(isset($dipdateto)) && ($dipdateto != "") && ($dipdateto != "false") || 
			(isset($isDoctor)) && ($isDoctor != "") && ($isDoctor != "false") || 
			(isset($gender)) && ($gender != "") && ($gender != "false") || 
			(isset($isCowoker)) && ($isCowoker != "") && ($isCowoker != "false") || 
			(isset($experiance)) && ($experiance != "") && ($experiance != "false"))) {
			$query .= " AND ";
			$extraQueryPart .= " OR ";
		}
		if ((isset($dipdatefrom)) && ($dipdatefrom != "") && ($dipdatefrom != "false") || 
			(isset($dipdateto)) && ($dipdateto != "") && ($dipdateto != "false") || 
			(isset($isDoctor)) && ($isDoctor != "") && ($isDoctor != "false") || 
			(isset($gender)) && ($gender != "") && ($gender != "false") || 
			(isset($isCowoker)) && ($isCowoker != "") && ($isCowoker != "false") || 
			(isset($experiance)) && ($experiance != "") && ($experiance != "false")) {
			$needAnd = false;
			if(isset($dipdatefrom) && $dipdatefrom != "" && $dipdatefrom != "false"){
				$query .= " personal_card.diploma_start > '$dipdatefrom' ";
				$extraQueryPart .= " personal_card.diploma_start > '$dipdatefrom' ";
				$inputParamsIds["Диплом с"] = array('diploma_start' => $dipdatefrom);
				$needAnd = true;
			}
			if(isset($dipdateto) && $dipdateto != "" && $dipdateto != "false"){
				if($needAnd){
					$query .= " AND ";
					$extraQueryPart .= " OR ";
				}
				$query .= " personal_card.diploma_start < '$dipdateto'";
				$extraQueryPart .= " personal_card.diploma_start < '$dipdateto'";
				$inputParamsIds["Диплом до"] = array('diploma_start' => $dipdateto);
				$needAnd = true;
			}
			if(isset($isDoctor) && $isDoctor != "" && $isDoctor != "false"){
				if($needAnd){
					$query .= " AND ";
					$extraQueryPart .= " OR ";
				}
				if ($isDoctor === "true") {
					$flag = 1;
				}else{
					$flag = 0;
				}
				$query .= " personal_card.isDoctor = '$flag'";
				$extraQueryPart .= " personal_card.isDoctor = '$flag'";
				$inputParamsIds["Кандидат медицинских наук"] = array('isDoctor' => $flag);
				$needAnd = true;
			}
			if(isset($gender) && $gender != "" && $gender != "false"){
				if($needAnd){
					$query .= " AND ";
					$extraQueryPart .= " OR ";
				}
				$query .= " personal_card.isMale = '$gender'";
				$extraQueryPart .= " personal_card.isMale = '$gender'";
				if ($gender == 1) {
					$label = "Мужской";
				}else{
					$label = "Женский";
				}
				$inputParamsIds[$label] = array('isMale' => $gender);
				$needAnd = true;
			}
			if(isset($isCowoker) && $isCowoker != "" && $isCowoker != "false"){
				if($needAnd){
					$query .= " AND ";
					$extraQueryPart .= " OR ";
				}
				$query .= " personal_card.isCowoker = '$isCowoker'";
				$extraQueryPart .= " personal_card.isCowoker = '$isCowoker'";
				$inputParamsIds["Сотрудник"] = array('isCowoker' => $isCowoker);
				$needAnd = true;
			}
			if(isset($experiance) && $experiance != "" && $experiance != "false"){
				if($needAnd){
					$query .= " AND ";
					$extraQueryPart .= " OR ";
				}
				$query .= " personal_card.experience_general >= '$experiance'";
				$extraQueryPart .= " personal_card.experience_general >= '$experiance'";
				$inputParamsIds["Опыт работы"] = array('experience_general' => $experience);
			}
		}
		// echo $query;
		// print_r($_POST);
		if ((count($inputParamsIds) > 1) || ((count($inputParamsIds) + count($inputRegions)) > 1)) {
			foreach ($inputParamsIds as $key => $value) {
				foreach ($value as $field => $id) {
					$extraQueryInline = "SELECT personal_card.$field " . $extraQueryPart;
					$extraQuery = "SELECT COUNT(*) AS value FROM ($extraQueryInline) AS subQuery WHERE subQuery.$field = '$id'";
					$result = $mysqli->query($extraQuery) or die ("Ошибка в '$extraQuery': " . mysqli_error($mysqli));
					$obj = $result->fetch_assoc();
					$Parameterobj["label"] = $key;
					$Parameterobj["value"] = $obj["value"];
					array_push($response, $Parameterobj);
				}
			}
		}

		if ((count($inputRegions) > 1) || ((count($inputRegions) + count($inputParamsIds)) > 1)) {
			for ($i=0; $i < count($inputRegions); $i++) { 
				$region = $inputRegions[$i]["name"];
				$id = $inputRegions[$i]["id"];
				$extraQueryInline = "SELECT region " . $extraQueryPart;
				$extraQuery = "SELECT COUNT(*) AS value FROM ($extraQueryInline) AS subQuery WHERE subQuery.region = '$id'";
				$result = $mysqli->query($extraQuery) or die ("Ошибка в '$extraQuery': " . mysqli_error($mysqli));
				$obj = $result->fetch_assoc();
				$Parameterobj["label"] = $region;
				$Parameterobj["value"] = $obj["value"];
				array_push($response, $Parameterobj);
			}
		}
		$query = "SELECT COUNT(*) AS Total " . $query;
		$result = $mysqli->query($query) or die ("Ошибка в '$query': " . mysqli_error($mysqli));
		// echo "query: " . $query . "\n";
		mysqli_close($mysqli);
		$sum = 0;
		for ($i=0; $i < count($response); $i++) { 
			$sum += $response[$i]["value"];
		}
		$total["label"] = "total";
		$total["value"] = $sum;
		array_push($response, $total);

		$obj = $result->fetch_assoc();
		$Parameterobj["label"] = 'Интегрированный';
		$Parameterobj["value"] = $obj["Total"];
		array_push($response, $Parameterobj);
		// print_r($response);
	}else if (count($source) == 1 && $source[0] == 2) {
		$inputParamsArrs = array();
		$inputParamsIds = array();
		$inputParamsArrs["faculties"] = array();
		$inputParamsArrs["forms"] = array();
		$inputParamsArrs["educType"] = array();
		foreach ($tablesArrivals as $key => $value) {
			if (isset($_POST[$key]) && ($_POST[$key] != "")) {
				$postValue = $_POST[$key];
				$hasKey = true;
				$query .= "INNER JOIN " . $value . " ON arrivals." . $fieldsArrivals[$key] . " = " . $value . ".id ";
				if ($key == "faculties") {
					$lastPartFaculties = array();
					foreach ($postValue as $keyFac => $valueFac) {
						$lastPartItem = $value . ".id = '" . $valueFac . "'";
						$nameSqj = $mysqli->query("SELECT * FROM faculties WHERE id = " . $valueFac) or die ("Ошибка запроса: 'SELECT * FROM faculties WHERE id = $valueFac " . mysqli_error($mysqli));
						$obj = $nameSqj->fetch_assoc();
						array_push($inputParamsArrs["faculties"], $obj);
						array_push($lastPartFaculties, $lastPartItem);	
					}
					array_push($inputParamsArrs["faculties"], array( 'field' => $fieldsArrivals[$key]));
				}else if ($key == "forms") {
					$lastPartForms = array();
					foreach ($postValue as $keyForms => $valueForms) {
						$lastPartItem = $value . ".id = '" . $valueForms . "'";
						$nameSqj = $mysqli->query("SELECT * FROM formofeducation WHERE id = " . $valueForms) or die ("Ошибка запроса: 'SELECT * FROM formofeducation WHERE id = $valueForms " . mysqli_error($mysqli));
						$obj = $nameSqj->fetch_assoc();
						array_push($inputParamsArrs["forms"], $obj);
						array_push($lastPartForms, $lastPartItem);	
					}
					array_push($inputParamsArrs["forms"], array( 'field' => $fieldsArrivals[$key]));
				}else if ($key == "educTypes") {
					$lastPartEducType = array();
					foreach ($postValue as $keyEducType => $valueEducType) {
						$lastPartItem = $value . ".id = '" . $valueEducType . "'";
						$nameSqj = $mysqli->query("SELECT * FROM educType WHERE id = " . $valueEducType) or die ("Ошибка запроса: 'SELECT * FROM educType WHERE id = $valueEducType " . mysqli_error($mysqli));
						$obj = $nameSqj->fetch_assoc();
						array_push($inputParamsArrs["educType"], $obj);
						array_push($lastPartEducType, $lastPartItem);	
					}
					array_push($inputParamsArrs["educType"], array( 'field' => $fieldsArrivals[$key]));
				}else{
					$lastPartItem = $value . ".name LIKE '" . $postValue . "'";
					$result = $mysqli->query("SELECT * FROM $value WHERE name = '$postValue'") or die ("Ошибка: " . mysqli_error($mysqli));
					$inputParams = $result->fetch_assoc();
					$inputParamsIds[$inputParams["name"]] = array($fieldsArrivals[$key] => $inputParams["id"] );
					array_push($lastPart, $lastPartItem); 
				}
			}
		}

		if (isset($_POST["groupNumber"])){
			$groupNumber = $_POST["groupNumber"];
		}
		
		if ($hasKey || (isset($groupNumber) && $groupNumber != "" && $groupNumber != "0" && $groupNumber != undefined)) {
			$query .= "WHERE ";
		}
		$extraQueryPart = $query;
		if (!empty($lastPart)) {
			$lastPartString = implode(" AND ", $lastPart);
			$lastPartStringEx = implode(" OR ", $lastPart);
			$query .= $lastPartString;
			$extraQueryPart = $lastPartStringEx;
		}

		if (isset($lastPartFaculties)) {
			if (!empty($lastPart)) {
				$query .= " AND ";
				$extraQueryPart .= "OR";
			}
			$lastPartString = implode(" OR ", $lastPartFaculties);
			$query .= "(" .$lastPartString . ")";
			$extraQueryPart .= "(" .$lastPartString . ")";
		}

		if (isset($lastPartForms)) {
			if (!empty($lastPart) || isset($lastPartFaculties)) {
				$query .= " AND ";
				$extraQueryPart .= " OR ";
			}
			$lastPartString = implode(" OR ", $lastPartForms);
			$query .= "(" .$lastPartString . ")";
			$extraQueryPart .= "(" .$lastPartString . ")";
		}

		if (isset($lastPartEducType)) {
			if (!empty($lastPart) || isset($lastPartFaculties) || isset($lastPartForms)) {
				$query .= " AND ";
				$extraQueryPart .= " OR ";
			}
			$lastPartString = implode(" OR ", $lastPartEducType);
			$query .= "(" .$lastPartString . ")";
			$extraQueryPart .= "(" .$lastPartString . ")";
		}

		if ((!empty($lastPart) || 
			isset($lastPartRegions) || 
			isset($lastPartFaculties) || 
			isset($lastPartForms) || 
			isset($lastPartEducType)) && 
			isset($groupNumber)) {
			$query .= " AND ";
			$extraQueryPart .= " OR ";
		}
		if (isset($groupNumber) && 
			$groupNumber != "" && 
			$groupNumber != "0" &&
			$groupNumber != undefined){
			$query .= " arrivals.GroupNum = '$groupNumber' ";
			$extraQueryPart .= " arrivals.GroupNum = '$groupNumber' ";
			
		}
		// echo $query;
		// print_r($_POST);
		if ((count($inputParamsIds) > 1) || ((count($inputParamsIds) + count($inputParamsArrs["faculties"]) + count($inputParamsArrs["forms"]) + count($inputParamsArrs["educType"])) > 1)) {
			foreach ($inputParamsIds as $key => $value) {
				foreach ($value as $field => $id) {
					$extraQueryInline = "SELECT arrivals.$field " . $extraQueryPart;
					$extraQuery = "SELECT COUNT(*) AS value FROM ($extraQueryInline) AS subQuery WHERE subQuery.$field = '$id'";
					$result = $mysqli->query($extraQuery) or die ("Ошибка в '$extraQuery': " . mysqli_error($mysqli));
					$obj = $result->fetch_assoc();
					$Parameterobj["label"] = $key;
					$Parameterobj["value"] = $obj["value"];
					array_push($response, $Parameterobj);
				}
			}
		}

		if ((count($inputParamsArrs["faculties"]) > 1) ||
			(count($inputParamsArrs["forms"]) > 1) ||
			(count($inputParamsArrs["educType"]) > 1) ||
			((count($inputParamsIds) + count($inputParamsArrs["faculties"]) + count($inputParamsArrs["forms"]) + count($inputParamsArrs["educType"])) > 1)) {
			foreach ($inputParamsArrs as $param => $arr) {
				if (count($arr) == 0) {
					continue;
				}
				$field = $arr[count($arr)-1]["field"];

				for ($i=0; $i < count($arr)-1; $i++) { 
					$name = $arr[$i]["name"];
					$id = $arr[$i]["id"];
					$extraQueryInline = "SELECT $field " . $extraQueryPart;
					$extraQuery = "SELECT COUNT(*) AS value FROM ($extraQueryInline) AS subQuery WHERE subQuery.$field = '$id'";
					$result = $mysqli->query($extraQuery) or die ("Ошибка в '$extraQuery': " . mysqli_error($mysqli));
					$obj = $result->fetch_assoc();
					$Parameterobj["label"] = $name;
					$Parameterobj["value"] = $obj["value"];
					array_push($response, $Parameterobj);
				}
			}
		}
		$query = "SELECT COUNT(*) AS Total " . $query;
		$result = $mysqli->query($query) or die ("Ошибка в '$query': " . mysqli_error($mysqli));
		mysqli_close($mysqli);
		$sum = 0;
		for ($i=0; $i < count($response); $i++) { 
			$sum += $response[$i]["value"];
		}
		$total["label"] = "total";
		$total["value"] = $sum;
		array_push($response, $total);

		$obj = $result->fetch_assoc();
		$Parameterobj["label"] = 'Интегрированный';
		$Parameterobj["value"] = $obj["Total"];
		array_push($response, $Parameterobj);
		// print_r($response);	
	}else if (count($source) == 2) {
		foreach ($tablesPersonal as $key => $value) {
			if (isset($_POST[$key])) {
				$postValue = $_POST[$key];
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
			if (isset($_POST[$key])) {
				$postValue = $_POST[$key];
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

		if (isset($_POST["groupNumber"])){
			$groupNumber = $_POST["groupNumber"];
		}
		if (isset($_POST["dipdatefrom"])){
			$dipdatefrom = $_POST["dipdatefrom"];
		}
		if(isset($_POST["dipdateto"])){
			$dipdateto = $_POST["dipdateto"];
		}
		if(isset($_POST["isDoctor"])){
			$isDoctor = $_POST["isDoctor"];
		}
		if(isset($_POST["gender"])){
			$gender = $_POST["gender"];
		}
		if(isset($_POST["isCowoker"])){
			if ($_POST["isCowoker"] === "true") {
				$isCowoker = 1;
			}else{
				$isCowoker = 0;
			}
		}
		if(isset($_POST["experiance"])){
			$experiance = $_POST["experiance"];
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
		$extraQuery = "SELECT * " . $query;
		$query = "SELECT COUNT(*) AS Total " . $query;
		$result = $mysqli->query($query) or die ("Ошибка: " . mysqli_error($mysqli));
		$response = $result->fetch_assoc();
		// print_r($response);	
	}
	// echo $query;
	// print_r($_POST);
	echo json_encode($response);
?>