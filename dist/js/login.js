(function() {
  var app;

  app = angular.module('login', []);

  $('.message a').click(function() {
    return $('form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "slow");
  });

}).call(this);
