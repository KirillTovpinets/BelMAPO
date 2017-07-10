app.controller "OptionsCtrl", ["getOptions", "findDoctor", "$scope", (getOptions, findDoctor, $scope) ->
	$scope.establishment = []
	$scope.appointment = []
	$scope.speciality = []
	$scope.qualification = []
	$scope.category = []
	$scope.doctors = []
	$scope.find = {
		fromAge: 20
		toAge: 50
		offset: 0
		count: 6
	}

	$("#age").slider(
		min: 0
		max: 100
		range: true
		values: [20, 50]
		slide: (event, ui) ->
			$("#fromAge").html ui.values[0]
			$("#toAge").html ui.values[1]
		change: (event, ui) ->
			# $("#fromAgeHidden").val(ui.values[0])
			# $("#toAgeHidden").val(ui.values[1])
			$scope.find.fromAge = ui.values[0]
			$scope.find.toAge = ui.values[1]
			do $scope.findAction
	)
	getOptions.get().then (data) ->
		makeAuto = (data) ->
			auto = []
			for value in data
				auto.push value.name
			return auto

		est = makeAuto data.data.estList
		app = makeAuto data.data.appList
		mainSpeciality = makeAuto data.data.mainSpecialityList
		repSpeciality = makeAuto data.data.repSpecialityList
		otherSpeciality = makeAuto data.data.otherSpecialityList
		mainQualification = makeAuto data.data.mainQualificationList
		repQualification = makeAuto data.data.repQualificationList
		otherQualification = makeAuto data.data.otherQualificationList

		$( "#ee" ).autocomplete {
			source: est
			minLength: 9
			select: (event, ui) ->
				$scope.find.establishment = this.value
				do $scope.findAction
		}

		# appointment
		# speciality_main
		# speciality_rep
		# speciality_other
		# qualification_main
		# qualification_add
		# qualification_other
		$("#app").autocomplete {
			source: app
			minLength: 4
			select: (event, ui) ->
				$scope.find.appointment = this.value
				do $scope.findAction
		}
		$("#mainSp").autocomplete {
			source: mainSpeciality
			minLength: 3
			select: (event, ui) ->
				$scope.find.speciality_main = this.value
				do $scope.findAction
		}
		$("#repSp").autocomplete {
			source: repSpeciality
			minLength: 3
			select: (event, ui) ->
				$scope.find.speciality_rep = this.value
				do $scope.findAction
		}
		$("#otherSp").autocomplete {
			source: otherSpeciality
			minLength: 3
			select: (event, ui) ->
				$scope.find.speciality_other = this.value
				do $scope.findAction
		}
		$("#mainQual").autocomplete {
			source: mainQualification
			minLength: 3
			select: (event, ui) ->
				$scope.find.qualification_main = this.value
				do $scope.findAction
		}
		$("#addQual").autocomplete {
			source: repQualification
			minLength: 3
			select: (event, ui) ->
				$scope.find.qualification_add = this.value
				do $scope.findAction
		}
		$("#otherQual").autocomplete {
			source: otherQualification
			minLength: 3
			select: (event, ui) ->
				$scope.find.qualification_other = this.value
				do $scope.findAction
		}
	scrollCounter = -400
	$scope.findAction = ->
		data = this.find
		$('#DoctorList').preloader 'start'
		$scope.find.offset = 0
		$scope.find.count = 6
		scrollCounter = -400
		findDoctor.get(data).then (response) ->
			# alert response.data.length
			# alert response.data
			$scope.doctors = response.data
			$('#DoctorList').preloader 'stop'
	$scope.getDoctorLink = (id) ->
		return "doctorInfo.html?id=" + id

	$(".main-panel").scroll ->
		scrollOffsetTop = $(".main-panel").children().first().offset().top
		if scrollOffsetTop < scrollCounter
		  scrollCounter -= 400
		  $scope.find.offset += $scope.doctors.length
		  data = $scope.find
		  findDoctor.get(data).then (response) ->
		  	# alert response.data
		  	for obj in response.data
		  		$scope.doctors.push obj
		  	# alert response.data.length
		  	$scope.find.offset += response.data.length
		  
]