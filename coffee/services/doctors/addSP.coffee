app.factory "addSP", ['$http', ($http) ->
	add: (id) ->
		$http.get 'php/addSpeciality.php', id
]