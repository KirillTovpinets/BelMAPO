app.factory("addSP", [
  '$http', function($http) {
    return {
      add: function(id) {
        return $http.get('php/addSpeciality.php', id);
      }
    };
  }
]);
