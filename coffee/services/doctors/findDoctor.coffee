app.factory "findDoctor", ($http) ->
	get: (data) ->
		$http.post "./php/findDoctor.php", data