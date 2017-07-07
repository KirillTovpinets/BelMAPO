(function() {
  var app, list;

  app = angular.module('belmapo', []);

  list = 'list';

  app.controller("LastList", function(arg) {
    var list;
    list = arg[0];
  });

}).call(this);
