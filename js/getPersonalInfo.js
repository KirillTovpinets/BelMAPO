app.factory("getPersonalInfo", [
  '$http', function($http) {
    return {
      get: function(id) {
        return $http.get('php/getPersonalInfo.php?id=' + id);
      }
    };
  }
]);
