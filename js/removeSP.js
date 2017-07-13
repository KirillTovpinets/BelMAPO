app.factory("removeSP", [
  '$http', function($http) {
    return {
      "delete": function(data) {
        return $http.get('php/removeSpeciality.php', data);
      }
    };
  }
]);
