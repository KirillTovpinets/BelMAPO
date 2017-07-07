(function() {
  app.factory('TryLogin', [
    '$http', function($http) {
      return {
        login: function(person) {
          return $http.post('php/login.php', person);
        }
      };
    }
  ]);

}).call(this);
