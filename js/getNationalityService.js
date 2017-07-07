app.factory("getNationalityService", function($http) {
  return {
    get: function() {
      return $http.get('./php/getInfo.php?info=nationality');
    }
  };
});
