app.factory "removeSP", ['$http', ($http) ->
	delete: (data) ->
		$http.get 'php/removeSpeciality.php', data
]