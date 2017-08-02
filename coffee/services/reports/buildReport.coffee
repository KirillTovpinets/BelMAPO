app.factory "buildReport", ($http) ->
	build: (params) ->
		$http.post "php/buildReport.php", params