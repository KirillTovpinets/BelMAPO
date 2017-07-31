app.factory("getParams", function($http) {
  return {
    get: function() {
      return $http.get("php/getParams.php");
    }
  };
});
