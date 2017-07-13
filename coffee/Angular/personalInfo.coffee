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

app.controller "personalInfoCtrl", [ '$scope', 'getPersonalInfo', 'getOptions', 'saveChanges', 'removeSP', 'addSP', ($scope, getPersonalInfo, getOptions, saveChanges, removeSP, addSP) ->
	$scope.doctor = { isDoctor: false }
	
	getOptions.get().then (data) ->
		makeAuto = (data) ->
			auto = []
			for value in data
				auto.push value.name
			return auto

		est = makeAuto data.data.estList
		app = makeAuto data.data.appList
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

	personId = document.location.href.split("=")[1];
	oldInfo = {}

	getPersonalInfo.get(personId).then (response) ->
		$scope.doctor.id = personId
		$scope.doctor = response.data.general
		$scope.doctor.specialities = response.data.additional
		

	$scope.removeSP = (id) ->
		data = {}
		data.idPerson = $scope.doctor.id
		data.idSP = id
		alert data.idSP
		removeSP.delete(data).then ->

	$scope.addSP = ->
		idPerson = $scope.doctor.id
		removeSP.delete(idPerson).then ->

	$scope.RefreshBtn = (trigger) ->
		angular.copy $scope.doctor, oldInfo
		if trigger	
			$('input').not('.not-changeble').removeAttr "readonly"
			$('hr').css "display", "none"
			$('#save').css "display", "block"
			$('#refresh').css "display", "none"
			$('#cansel').css "display", "none"
			$('#canselRefresh').css "display", "block"
		else
			$('input').not('.not-changeble').attr "readonly", "readonly"
			$('hr').css "display", "block"
			$('#save').css "display", "none"
			$('#refresh').css "display", "initial"
			$('#cansel').css "display", "initial"
			$('#canselRefresh').css "display", "none"
	$scope.CloseBtn = ->
		parent.$.fancybox.close()
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