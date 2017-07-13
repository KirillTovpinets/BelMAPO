app.factory("saveChanges", [
  '$http', function($http) {
    return {
      save: function(data) {
        return $http.post("./php/saveChanges.php", data);
      }
    };
  }
]);
