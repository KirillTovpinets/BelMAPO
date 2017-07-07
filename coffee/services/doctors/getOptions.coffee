app.factory "getOptions", ($http) ->
	get: ->
		$http.get "./php/getOptions.php"