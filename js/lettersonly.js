app.directive("onlyLettersInput", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attr, ngModelCtrl) {
      var fromUser;
      fromUser = function(text) {
        var transformedInput;
        transformedInput = text.replace(/[^а-яА-Я\s]/g, '');
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return transformedInput;
      };
      return ngModelCtrl.$parsers.push(fromUser);
    }
  };
});
