app.factory "getListService", ($http) ->
	get: ->
		$http.get('./php/getInfo.php?info=lastten');
