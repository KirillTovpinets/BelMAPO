app.factory "getParams", ($http) ->
	get: ->
		$http.get "php/getParams.php"