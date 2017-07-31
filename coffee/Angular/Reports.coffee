app.controller "ReportsCtrl", ['getParams', '$scope', (getParams, $scope) ->
	$scope.params = {}
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
		regArr = makeAuto $scope.params.regArr
		depArr = makeAuto $scope.params.depArr
		facArr = makeAuto $scope.params.facArr
		$("#ee").autocomplete({
			source: estArr
			minLength: 7
		})
		$("#resid").autocomplete({
			source: residArr
			minLength: 7
		})
		$("#app").autocomplete({
			source: appArr
			minLength: 7
		})
		$("#org").autocomplete({
			source: orgArr
			minLength: 7
		})
		$("#reg").autocomplete({
			source: regArr
			minLength: 7
		})
		$("#dep").autocomplete({
			source: depArr
			minLength: 7
		})
		$("#fac").autocomplete({
			source: facArr
			minLength: 7
		})

		$("#DipDate").slider({
			range: true
			values: [10, 90]
			min: 0
			step: 1
			max: 100
			slide: (event, ui) ->
				dateFrom = new Date($("#DipDateFrom").val());
				dateTo = new Date($("#DipDateTo").val());
				dateFrom.setDate(dateFrom.getDate() + ui.values[0]);
				dateTo.setDate(dateTo.getDate() + ui.values[1]);
				$("#DipDateFrom").val(dateFrom.getFullYear() + "-" + dateFrom.getMonth() + "-" + dateFrom.getDate());
				$("#DipDateTo").val(dateTo.getFullYear() + "-" + dateTo.getMonth() + "-" + dateTo.getDate());
		});

		$("#DipDateFrom").val("1956-01-01")

		$("#DipDateTo").val("2017-01-01")
		# appArr
		# orgArr
		# regArr
		# depArr
		# facArr


]
