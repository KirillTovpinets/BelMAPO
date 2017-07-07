app.factory("getFacultyService", function($http) {
  return {
    get: function() {
      return $http.get('./php/getInfo.php?info=faculty');
    }
  };
});
