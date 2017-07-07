app.controller "OptionsCtrl", ["getOptions", "findDoctor", "$scope", (getOptions, findDoctor, $scope) ->
	$scope.establishment = []
	$scope.appointment = []
	$scope.speciality = []
	$scope.qualification = []
	$scope.category = []
	$scope.doctors = []
	$scope.find = {
		gender: {id: '1', name: 'Мужской'}
		options: [
			{id: '1', name: "Мужской"},
			{id: '2', name: "Женский"}
		]
	}

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
		}
		$("#app").autocomplete {
			source: app
			minLength: 4
		}
		$("#mainSp").autocomplete {
			source: mainSpeciality
			minLength: 3
		}
		$("#repSp").autocomplete {
			source: repSpeciality
			minLength: 3
		}
		$("#otherSp").autocomplete {
			source: otherSpeciality
			minLength: 3
		}
		$("#mainQual").autocomplete {
			source: mainQualification
			minLength: 3
		}
		$("#addQual").autocomplete {
			source: repQualification
			minLength: 3
		}
		$("#otherQual").autocomplete {
			source: otherQualification
			minLength: 3
		}

	$scope.findAction = ->
		data = this.find
		findDoctor.get(data).then (response) ->
			$scope.doctors = response.data
]