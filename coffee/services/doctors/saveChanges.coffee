app.factory "saveChanges", ['$http', ($http) ->
	save: (data) ->
		$http.post "./php/saveChanges.php", data
]