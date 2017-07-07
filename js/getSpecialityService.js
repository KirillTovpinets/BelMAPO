app.factory("getSpecialityService", function($http) {
  return {
    get: function() {
      return $http.get('./php/getInfo.php?info=speciality');
    }
  };
});
