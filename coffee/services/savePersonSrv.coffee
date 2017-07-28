app.factory "savePersonSrv", ($http) ->
	save: (data) ->
		$http.post "php/savePerson.php", data