app.factory("addQu", [
  '$http', function($http) {
    return {
      add: function(data) {
        return $http.get('php/addQualification.php', data);
      }
    };
  }
]);
