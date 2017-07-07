app.factory("getOptions", function($http) {
  return {
    get: function() {
      return $http.get("./php/getOptions.php");
    }
  };
});
