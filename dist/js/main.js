var app;

app = angular.module('belmapo', []);

app.controller("LastList", [
  'getListService', function(getListService) {
    this.list = Object;
    return getListService.get.then(function(data) {
      return this.list = data.data;
    })();
  }
]);
