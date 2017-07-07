(function() {
  var app;

  app = angular.module('login', [], function($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [
      function(data) {
        var param;
        param = function(obj) {
          var fullSubName, i, j, k, l, len, name, query, ref, ref1, subName, subValue, value;
          query = '';
          for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
              for (i = j = 0, ref = value.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
              }
            } else if (value instanceof Object) {
              for (k = 0, len = value.length; k < len; k++) {
                subName = value[k];
                for (i = l = 0, ref1 = value.length; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
                  subValue = value[subName];
                  fullSubName = name + '[' + subName + ']';
                  innerObj[fullSubName] = subValue;
                  query += param(innerObj) + '&';
                }
              }
            } else if (value !== void 0 && value !== null) {
              query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
          }
          if (query.length) {
            return query.substr(0, query.length - 1);
          } else {
            return query;
          }
        };
        if (angular.isObject(data) && String(data) !== '[object File]') {
          return param(data);
        } else {
          return data;
        }
      }
    ];
  });

  $('.message a').click(function() {
    return $('form').animate({
      height: "toggle",
      opacity: "toggle"
    }, "slow");
  });

}).call(this);
