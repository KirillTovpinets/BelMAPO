var app;

app = angular.module("personalInfoApp", []);

app.controller("personalInfoCtrl", [
  '$scope', 'getPersonalInfo', function($scope, getPersonalInfo) {
    var personId;
    $scope.doctor = {};
    personId = document.location.href.split("=")[1];
    return getPersonalInfo.get(personId).then(function(response) {
      alert(response.data);
      return $scope.doctor = response.data;
    });
  }
]);
