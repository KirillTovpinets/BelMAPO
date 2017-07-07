app.factory("getListService", function($http) {
  return {
    get: function() {
      return $http.get('./php/getInfo.php?info=lastten');
    }
  };
});
