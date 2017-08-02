app.controller "ReportsCtrl", ['getParams', '$scope', 'buildReport', (getParams, $scope, buildReport) ->
	$scope.params = {}
	$scope.filterParams = {}
	$scope.filterParams.personal = {}
	$scope.filterParams.educational = {}
	$scope.filterParams.tableIds = []
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


		$("#ee").autocomplete({
			source: estArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.personal.est = this.value
				$scope.reportAction(1)
		})
		$("#resid").autocomplete({
			source: residArr
			select: (event, ui) ->
				$scope.filterParams.personal.resid = this.value
				$scope.reportAction(1)
		})
		$("#app").autocomplete({
			source: appArr
			minLength: 3
			select: (event, ui) ->
				$scope.filterParams.personal.app = this.value
				$scope.reportAction(1)
		})
		$("#org").autocomplete({
			source: orgArr
			minLength: 3
			select: (event, ui) ->
				$scope.filterParams.personal.org = this.value
				$scope.reportAction(1)
		})
		$("#dep").autocomplete({
			source: depArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.personal.dep = this.value
				$scope.reportAction(1)
		})
		$("#fac").autocomplete({
			source: facArr
			minLength: 7
			select: (event, ui) ->
				$scope.filterParams.personal.fac = this.value
				$scope.reportAction(1)
		})

		$("#cathedra").autocomplete({
			source: cathedras
			minLength: 4
			select: (event, ui) ->
				$scope.filterParams.educational.cathedra = this.value
				$scope.reportAction(2)
		})
		$("#course").autocomplete({
			source: coursesBel
			minLength: 4
			select: (event, ui) ->
				$scope.filterParams.educational.course = this.value
				$scope.reportAction(2)
		})

		$("#DipDateFrom").datepicker({
			dateFormat: "yy-mm-dd"
			onSelect: (date, ui) ->
				$scope.filterParams.personal.dipdatefrom = date
				$scope.reportAction(1)
		})

		$("#DipDateTo").datepicker({
			dateFormat: "yy-mm-dd"
			onSelect: (date, ui) ->
				$scope.filterParams.personal.dipdateto = date
				$scope.reportAction(1)
		})
	$scope.SelectRegionAction = ($event) ->
		if $scope.filterParams.regions == undefined
			  $scope.filterParams.personal.regions = []

		$scope.filterParams.personal.regions = checkValue $event.currentTarget.value, $scope.filterParams.personal.regions
		$scope.reportAction(1)
			  
	$scope.reportAction = (flag) ->
		$('#Results').preloader 'start'
		if $("#DipDateFrom").datepicker("getDate") == null
			$scope.filterParams.personal.dipdatefrom = undefined
		if $("#DipDateTo").datepicker("getDate") == null
			$scope.filterParams.personal.dipdateto = undefined
		$scope.filterParams.tableIds = checkValue flag, $scope.filterParams.tableIds, 1
		data = $scope.filterParams
		buildReport.build(data).then (data) ->
			alert data.data
			# if flag
			# 	alert data.data
			$scope.total = data.data.Total
			$('#Results').preloader 'stop'

	$scope.SelectFacultyAction = ($event) ->
		if $scope.filterParams.educational.faculties == undefined
			  $scope.filterParams.educational.faculties = []

		$scope.filterParams.educational.faculties = checkValue $event.currentTarget.value, $scope.filterParams.educational.faculties
		$scope.reportAction(2)

	$scope.SelectFormAction = ($event) ->
		if $scope.filterParams.educational.forms == undefined
			  $scope.filterParams.forms = []

		$scope.filterParams.educational.forms = checkValue $event.currentTarget.value, $scope.filterParams.educational.forms
		$scope.reportAction(2)

	$scope.SelectEducTypeAction = ($event) ->
		if $scope.filterParams.educational.educTypes == undefined
			  $scope.filterParams.educTypes = []

		$scope.filterParams.educational.educTypes = checkValue $event.currentTarget.value, $scope.filterParams.educational.educTypes
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
