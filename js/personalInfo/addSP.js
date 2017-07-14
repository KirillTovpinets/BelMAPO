app.factory("addSP", [
  '$http', function($http) {
    return {
      add: function(data) {
        return $http.get('php/addSpeciality.php', data);
      }
    };
  }
]);
