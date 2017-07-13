app.factory "getPersonalInfo", ['$http', ($http) ->
	get: (id) ->
		$http.get 'php/getPersonalInfo.php?id=' + id
]