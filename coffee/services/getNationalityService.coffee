app.factory "getNationalityService", ($http) ->
	get: ->
		$http.get('./php/getInfo.php?info=nationality')
