app.factory "getFacultyService", ($http) ->
	get: ->
		$http.get('./php/getInfo.php?info=faculty'); 
