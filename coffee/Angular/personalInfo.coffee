app = angular.module "personalInfoApp", [], ($httpProvider) ->
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
	$httpProvider.defaults.transformRequest = [ (data) ->
		param = (obj) ->
			query = ''
			innerObj = []
			for name of obj
				value = obj[name]
				if value instanceof Array
					for i in [0..value.length]
						subValue = value[i]
						fullSubName = name + '[' + i + ']'
						innerObj[fullSubName] = subValue
						query += param(innerObj) + '&';
				else if value instanceof Object
					for subName in value
						for i in [0..value.length]
							subValue = value[subName]
							fullSubName = name + '[' + subName + ']'
							innerObj[fullSubName] = subValue
							query += param(innerObj) + '&'
				else if value isnt undefined and value isnt null
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
			return if query.length then query.substr(0, query.length - 1) else query
		return if angular.isObject(data) and String(data) isnt '[object File]' then param(data) else data
	]
	return

app.controller "personalInfoCtrl", [ '$scope', 'getPersonalInfo', 'getOptions', 'saveChanges', 'removeSP', 'addSP', 'addQu', ($scope, getPersonalInfo, getOptions, saveChanges, removeSP, addSP, addQu) ->
	$scope.doctor = { isDoctor: false }
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

		# ee
		# country
		# app
		# organization
		# region
		# department
		# faculty

		# ng-model="doctor.EstName"
		# ng-model="doctor.ResName"
		# ng-model="doctor.diploma_start"
		# ng-model="doctor.AppName"
		# ng-model="doctor.tel_number"
		# ng-model="doctor.OrgName"
		# ng-model="doctor.RegName"
		# ng-model="doctor.insurance_number"
		# ng-model="doctor.DepName"
		# ng-model="doctor.FacName"
		# ng-model="doctor.diploma_number"
		$( "#ee" ).autocomplete {
			source: est
			minLength: 9
			select: (event, ui) ->
				$scope.doctor.EstName = this.value
				# for i in [1...1000]
				# 	i = i
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

	$(".date-picker").datepicker({
		dateFormat: "yy-mm-dd"
		})
	$( ".date-picker" ).datepicker( "option", "disabled", true );

	personId = document.location.href.split("=")[1];
	oldInfo = {}

	getPersonalInfo.get(personId).then (response) ->
		$scope.doctor.id = personId
		$scope.doctor = response.data.general
		$scope.doctor.specialities = response.data.specialities
		$scope.doctor.qualifications = response.data.qualifications

	$scope.RefreshBtn = (trigger) ->
		angular.copy $scope.doctor, oldInfo
		if trigger	
			$('#personalInfo input').not('.not-changeble').removeAttr "readonly"
			$(".date-picker").datepicker "option", "disabled", false 
			$('hr').css "display", "none"
			$('#save').css "display", "block"
			$('#refresh').css "display", "none"
			$('#cansel').css "display", "none"
			$('#canselRefresh').css "display", "block"
		else
			$('#personalInfo  input').not('.not-changeble').attr "readonly", "readonly"
			$(".date-picker").datepicker "option", "disabled", true 
			$('hr').css "display", "block"
			$('#save').css "display", "none"
			$('#refresh').css "display", "initial"
			$('#cansel').css "display", "initial"
			$('#canselRefresh').css "display", "none"
	$scope.CloseBtn = ->
		parent.$.fancybox.close()
	$scope.triggerAdd = true
	$scope.SaveNewSP = ->
		if $scope.newSP.name == ""
		  $("#personalSp input").css "box-shadow", "0 0 3px 0 #f00"
		  return
		data.name = $scope.newSP.name
		data.idPerson = $scope.doctor.id
		addSP.add(data).then (data) ->
			$scope.doctor.specialities.push(data.data)

	$scope.SaveNewQu = ->
		if $scope.newQu.name == ""
		  $("#personalQu input").css "box-shadow", "0 0 3px 0 #f00"
		  return
		data.name = $scope.newQu.name
		data.idPerson = $scope.doctor.id
		addQu.add(data).then (data) ->
			$scope.doctor.qualifications.push(data.data)

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

	$scope.SaveBtn = ->
		alert $scope.doctor.EstName
		data = {}
		hasChaned = false
		for key, value of $scope.doctor
			if value != oldInfo[key]
				data[key] = value
				hasChaned = true
		if hasChaned
			data.id = personId
			saveChanges.save(data).then (response) ->
				alert response.data
				$('input').not('.not-changeble').attr "readonly", "readonly"
				$('hr').css "display", "block"
				$('#save').css "display", "none"
				$('#refresh').css "display", "initial"
				$('#cansel').css "display", "initial"
				$('#canselRefresh').css "display", "none"
		else alert "NO changes"
]