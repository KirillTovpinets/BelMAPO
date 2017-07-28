app.controller "AddDoctorController", ['getOptions','$scope', 'savePersonSrv', (getOptions, $scope, savePersonSrv) -> 
	$scope.doctor = {
		name: "Кирилл"
		surname: "Товпинец"
		patername: "Александрович"
		birthday: "1994-02-10"
		EstName: "Витебский государственный медицинский институт"
		AppName: "программист"
		specialities: ["Врач-психиатр"]
		qualifications: ["Врач-дерматолог"]
		ResName: "Беларусь"
		OrgName: "БелМАПО"
		RegName: "Минск"
		diploma_start: "2017-06-20"
		tel_number: "+375(29)853-75-96"
		DepName: "ЦИТ"
		isDoctor: true
		insurance_number: "3100294E006PB9"
		diploma_number: "123456789"
		FacName: "ФИЭ"
		exp: 10
		expAdd: 15
	}
	$scope.newSP = { name: ""}
	$scope.newQu = { name: ""}
	getOptions.get().then (data) ->
		makeAuto = (data) ->
			auto = []
			for value in data
				auto.push value.name
			return auto

		est = makeAuto data.data.estList
		app = makeAuto data.data.appList
		specialities = makeAuto data.data.SpecialityList
		qualifications = makeAuto data.data.QualificationList
		country = makeAuto data.data.countryList
		organization = makeAuto data.data.organizationList
		region = makeAuto data.data.regionList
		department = makeAuto data.data.departmentList
		faculty = makeAuto data.data.facultyList

		$( "#ee" ).autocomplete {
			source: est
			minLength: 9
			select: (event, ui) ->
				$scope.doctor.EstName = this.value
		}

		$("#app").autocomplete {
			source: app
			minLength: 4
			select: (event, ui) ->
				$scope.doctor.AppName = this.value
		}
		$("#personalSp input").autocomplete {
			source: specialities
			minLength: 4
			select: (event, ui) ->
				$scope.newSP.name = this.value
		}

		$("#personalQu input").autocomplete {
			source: qualifications
			minLength: 4
			select: (event, ui) ->
				$scope.newQu.name = this.value
		}
		$("#country").autocomplete {
			source: country
			minLength: 3
			select: (event, ui) ->
				$scope.doctor.ResName = this.value
		}
		$("#organization").autocomplete {
			source: organization
			minLength: 3
			select: (event, ui) ->
				$scope.doctor.OrgName = this.value
		}

		$("#region").autocomplete {
			source: region
			minLength: 3
			select: (event, ui) ->
				$scope.doctor.RegName = this.value
		}

		$("#department").autocomplete {
			source: department
			minLength: 3
			select: (event, ui) ->
				$scope.doctor.DepName = this.value
		}

		$("#faculty").autocomplete {
			source: faculty
			minLength: 3
			select: (event, ui) ->
				$scope.doctor.FacName = this.value
		}

	$("#AddpersonalInfo .date-picker").datepicker({
		dateFormat: "yy-mm-dd"
	})

	$scope.triggerAdd = true
	$scope.SaveNewSP = ->
		if $scope.newSP.name == ""
		  $("#personalSp input").css "box-shadow", "0 0 3px 0 #f00"
		  return
		$scope.doctor.specialities.push($scope.newSP.name);
		$("#addSP span").removeClass "fa-times"
		$("#addSP span").addClass "fa-plus"
		$("#addSP").css "color", "green"
		$("#personalSp").css "display", "none"

	$scope.SaveNewQu = ->
		if $scope.newQu.name == ""
		  $("#personalQu input").css "box-shadow", "0 0 3px 0 #f00"
		  return
		$scope.doctor.qualifications.push($scope.newQu.name);
		$("#addQu span").removeClass "fa-times"
		$("#addQu span").addClass "fa-plus"
		$("#addQu").css "color", "green"
		$("#personalQu").css "display", "none"

	$scope.showSpFieldAction = ->
		if $scope.triggerAdd
			$("#addSP span").removeClass "fa-plus"
			$("#addSP span").addClass "fa-times"
			$("#addSP").css "color", "red"
			$("#personalSp").css "display", "inline"
			$scope.triggerAdd = !$scope.triggerAdd
		else
			$("#addSP span").removeClass "fa-times"
			$("#addSP span").addClass "fa-plus"
			$("#addSP").css "color", "green"
			$("#personalSp").css "display", "none"
			$scope.triggerAdd = !$scope.triggerAdd
			$scope.newSP.name = ""

	$scope.showQuFieldAction = ->
		if $scope.triggerAdd
			$("#addQu span").removeClass "fa-plus"
			$("#addQu span").addClass "fa-times"
			$("#addQu").css "color", "red"
			$("#personalQu").css "display", "inline"
			$scope.triggerAdd = !$scope.triggerAdd
		else
			$("#addQu span").removeClass "fa-times"
			$("#addQu span").addClass "fa-plus"
			$("#addQu").css "color", "green"
			$("#personalQu").css "display", "none"
			$scope.triggerAdd = !$scope.triggerAdd
			$scope.newQu.name = ""
	$scope.ResetBtn = ->
		$scope.doctor = {
			specialities: []
			qualifications: []
		}
	$scope.SavePerson = ->
		data = $scope.doctor
		savePersonSrv.save(data).then (data) ->
			alert data.data
]
