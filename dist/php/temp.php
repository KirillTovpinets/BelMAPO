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