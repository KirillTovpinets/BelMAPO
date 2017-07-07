app = angular.module 'belmapo', [], ($httpProvider) ->
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
	$httpProvider.defaults.transformRequest = [ (data) ->
		param = (obj) ->
			query = ''
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
	
app.controller "LastList", [ 'getListService', '$scope' , (getListService, $scope) -> 
	$scope.list = {}
	getListService.get().then (data) ->
		$scope.list = data.data	
]

app.controller "NationalityCtrl", ['getNationalityService', '$scope', (getNationalityService, $scope) ->
	nationalityList = []
	$('#NationalityChart').preloader 'start'
	getNationalityService.get().then (data) ->
		nationalityList = data.data
		for nationality in nationalityList
		  nationality.y = parseInt nationality.y
		NationalityConfig = 
			theme: "theme1"
			title:
				text: "Классификация по национальности"
			animationEnabled: true
			data: [
				type: "doughnut"
				dataPoints: nationalityList
			]
		$('#NationalityChart').preloader 'stop'
		NationalityChart = new CanvasJS.Chart "NationalityChart", NationalityConfig
		NationalityChart.render()
]

app.controller "FacultyCtrl", ['getFacultyService', '$scope', (getFacultyService, $scope) ->
	faculties = []
	getFacultyService.get().then (data) ->
		facultyList = data.data
		for faculty in facultyList
		  faculty.y = parseInt faculty.y
		FacultyConfig = 
			theme: "theme1"
			title: 
				text: "Статистика по факультетам"
			animationEnabled: true
			data: [
				type: "doughnut"
				dataPoints: facultyList
			]
		FactultyChart = new CanvasJS.Chart "FacultyChart", FacultyConfig
		FactultyChart.render()
]
$("#age").slider(
	min: 0
	max: 100
	range: true
	values: [20, 50]
	slide: (event, ui) ->
		$("#fromAge").html ui.values[0]
		$("#toAge").html ui.values[1]
)