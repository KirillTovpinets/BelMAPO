app.factory("buildReport", function($http) {
  return {
    build: function(params) {
      return $http.post("php/buildReport.php", params);
    }
  };
});
