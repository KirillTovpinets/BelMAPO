app.factory "addSP", ['$http', ($http) ->
	add: (data) ->
		$http.get 'php/addSpeciality.php', data
]