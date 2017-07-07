app.factory "getSpecialityService", ($http) ->
	get: ->
		$http.get('./php/getInfo.php?info=speciality')
