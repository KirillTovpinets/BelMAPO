	app = angular.module "personalInfoApp", []

	app.controller "personalInfoCtrl", [ '$scope', 'getPersonalInfo', ($scope, getPersonalInfo) ->
		$scope.doctor = {}

		personId = document.location.href.split("=")[1];
		getPersonalInfo.get(personId).then (response) ->
			alert response.data
			$scope.doctor = response.data
	]