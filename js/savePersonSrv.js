app.factory("savePersonSrv", function($http) {
  return {
    save: function(data) {
      return $http.post("php/savePerson.php", data);
    }
  };
});
