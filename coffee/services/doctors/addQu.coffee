app.factory "addQu", ['$http', ($http) ->
	add: (data) ->
		$http.get 'php/addQualification.php', data
]