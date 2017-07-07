app.factory("findDoctor", function($http) {
  return {
    get: function(data) {
      return $http.post("./php/findDoctor.php", data);
    }
  };
});
