app.controller "ReportsCtrl", ['getParams', '$scope', 'buildReport', (getParams, $scope, buildReport) ->
	$scope.params = {}
	$scope.filterParams = {}
	$scope.filterParams.tableIds = []
	$scope.ParamLabels = [
		"Учреждение образования", #0
		"Гражданство", #1
		"Дата получения диплома", #2
		"Должность", #
		"Звание кандидата медицинских нук", #3
		"Организация", #4
		"Область", #5
		"Пол", #6
		"Сотрудник", #7
		"Опыт работы", #8
		"Отдел", #9
		"Факультет", #10
		"Факультет БелМАПО", #11
		"Кафедра БелМАПО", #12
		"Курс", #13
		"Форма обучения", #14
		"Номер группы", #15
		"Тип обучения" #16
	]
	$scope.LabelsToDisplay = []
	getParams.get().then (data) ->
		$scope.params = data.data
		makeAuto = (data) ->
			auto = []
			for value in data
				auto.push value.name
			return auto
		estArr = makeAuto $scope.params.estArr
		residArr = makeAuto $scope.params.residArr
		appArr = makeAuto $scope.params.appArr
		orgArr = makeAuto $scope.params.orgArr
		depArr = makeAuto $scope.params.depArr
		facArr = makeAuto $scope.params.facArr
		cathedras = makeAuto $scope.params.cathBel

		$scope.faculties = $scope.params.facBel
		cathedras = makeAuto $scope.params.cathBel
		coursesBel = makeAuto $scope.params.coursesBel
		$scope.forms = $scope.params.formBel
		$scope.educTypes = $scope.params.educTypeBel
		$scope.regions = data.data.regArr

		# PersonalInfo
		#================
		# filterParams.est
		# filterParams.resid
		# filterParams.DipDateFrom
		# filterParams.DipDateTo
		# filterParams.app
		# filterParams.isDoctor
		# filterParams.org
		# filterParams.gender
		# filterParams.isCowoker
		# filterParams.experiance
		# filterParams.dep
		# filterParams.fac

		# EducationalInfo
		# =================
		# filterParams.cathedra
		# filterParams.course
		# filterParams.groupNumber

		# filterParams.regions
		# filterParams.faculties
		# filterParams.forms
		# filterParams.educTypes
		$("#ee").autocomplete({
			source: estArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.est = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[0]
				$scope.reportAction(1)
		})
		$("#resid").autocomplete({
			source: residArr
			select: (event, ui) ->
				$scope.filterParams.resid = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[1]
				$scope.reportAction(1)
		})
		$("#app").autocomplete({
			source: appArr
			minLength: 3
			select: (event, ui) ->
				$scope.filterParams.app = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[3]
				$scope.reportAction(1)
		})
		$("#org").autocomplete({
			source: orgArr
			minLength: 3
			select: (event, ui) ->
				$scope.filterParams.org = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[6]
				$scope.reportAction(1)
		})
		$("#dep").autocomplete({
			source: depArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.dep = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[9]
				$scope.reportAction(1)
		})
		$("#fac").autocomplete({
			source: facArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.fac = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[10]
				$scope.reportAction(1)
		})

		$("#cathedra").autocomplete({
			source: cathedras
			minLength: 4
			select: (event, ui) ->
				$scope.filterParams.cathedra = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[12]
				$scope.reportAction(2)
		})
		$("#course").autocomplete({
			source: coursesBel
			minLength: 4
			select: (event, ui) ->
				$scope.filterParams.course = this.value
				$scope.LabelsToDisplay = $scope.ParamLabels[13]
				$scope.reportAction(2)
		})

		$("#DipDateFrom").datepicker({
			dateFormat: "yy-mm-dd"
			onSelect: (date, ui) ->
				$scope.filterParams.dipdatefrom = date
				$scope.LabelsToDisplay = $scope.ParamLabels[2]
				$scope.reportAction(1)
		})

		$("#DipDateTo").datepicker({
			dateFormat: "yy-mm-dd"
			onSelect: (date, ui) ->
				$scope.filterParams.dipdateto = date
				$scope.LabelsToDisplay = $scope.ParamLabels[2]
				$scope.reportAction(1)
		})
	$scope.SelectRegionAction = ($event) ->
		if $scope.filterParams.regions == undefined
			  $scope.filterParams.regions = []

		$scope.filterParams.regions = checkValue $event.currentTarget.value, $scope.filterParams.regions
		$scope.LabelsToDisplay = $scope.ParamLabels[5]
		$scope.reportAction(1)
			  
	$scope.reportAction = (flag) ->
		if $scope.filterParams.est is undefined and $scope.filterParams.resid is undefined and $scope.filterParams.DipDateFrom is undefined and $scope.filterParams.DipDateTo is undefined and $scope.filterParams.app is undefined and $scope.filterParams.isDoctor is undefined and $scope.filterParams.org is undefined and $scope.filterParams.gender is undefined and $scope.filterParams.isCowoker is undefined and $scope.filterParams.experiance is undefined and $scope.filterParams.dep is undefined and $scope.filterParams.fac is undefined
			index = $scope.filterParams.tableIds.indexOf(1)
			if index > -1
				$scope.filterParams.tableIds.splice index, 1
				flag = 0
		if $scope.filterParams.cathedra is undefined and $scope.filterParams.course is undefined and $scope.filterParams.groupNumber is undefined and ($scope.filterParams.regions is undefined or $scope.filterParams.regions.length is 0) and ($scope.filterParams.faculties is undefined or $scope.filterParams.faculties.length is 0) and ($scope.filterParams.forms is undefined or $scope.filterParams.forms.length is 0) and ($scope.filterParams.educTypes is undefined or $scope.filterParams.educTypes.length is 0)
			index = $scope.filterParams.tableIds.indexOf(2)
			if index > -1
				$scope.filterParams.tableIds.splice index, 1
				flag = 0
		$('#Results').preloader 'start'
		if $("#DipDateFrom").datepicker("getDate") == null
			$scope.filterParams.dipdatefrom = undefined
		if $("#DipDateTo").datepicker("getDate") == null
			$scope.filterParams.dipdateto = undefined
		if flag
			$scope.filterParams.tableIds = checkValue flag, $scope.filterParams.tableIds, 1
		data = $scope.filterParams
		buildReport.build(data).then (data) ->
			# alert data.data
			# if flag
			# 	alert data.data
			$scope.parameters = []
			for value in data.data
				if value.label isnt "total"
					$scope.parameters.push(value)
				else
					$scope.total = value.value
			if $scope.parameters.length is 1
			  $scope.total = $scope.parameters[0].value
			# $scope.total = data.data[data.data.length-1].value
			$('#Results').preloader 'stop'

	$scope.SelectFacultyAction = ($event) ->
		if $scope.filterParams.faculties == undefined
			  $scope.filterParams.faculties = []

		$scope.filterParams.faculties = checkValue $event.currentTarget.value, $scope.filterParams.faculties
		$scope.LabelsToDisplay = $scope.ParamLabels[11]
		$scope.reportAction(2)

	$scope.SelectFormAction = ($event) ->
		if $scope.filterParams.forms == undefined
			  $scope.filterParams.forms = []

		$scope.filterParams.forms = checkValue $event.currentTarget.value, $scope.filterParams.forms
		$scope.LabelsToDisplay = $scope.ParamLabels[14]
		$scope.reportAction(2)

	$scope.SelectEducTypeAction = ($event) ->
		if $scope.filterParams.educTypes == undefined
			  $scope.filterParams.educTypes = []

		$scope.filterParams.educTypes = checkValue $event.currentTarget.value, $scope.filterParams.educTypes
		$scope.LabelsToDisplay = $scope.ParamLabels[16]
		$scope.reportAction(2)

	checkValue = (value, array, flag) ->
		contain = false
		for valueArr in array
			if valueArr is value
				contain = true

		if not contain
			array.push value
		else
			if flag != 1
				valueToRemove = array.indexOf value
				if valueToRemove > -1
					array.splice valueToRemove, 1
		return array
]
