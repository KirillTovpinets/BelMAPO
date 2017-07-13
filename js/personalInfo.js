var app;

app = angular.module("personalInfoApp", [], function($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.transformRequest = [
    function(data) {
      var param;
      param = function(obj) {
        var fullSubName, i, innerObj, j, k, l, len, name, query, ref, ref1, subName, subValue, value;
        query = '';
        innerObj = [];
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

app.controller("personalInfoCtrl", [
  '$scope', 'getPersonalInfo', 'saveChanges', function($scope, getPersonalInfo, saveChanges) {
    var personId;
    $scope.doctor = {
      isDoctor: false
    };
    $(".date-picker").datepicker({
      dateFormat: "yy-mm-dd"
    });
    personId = document.location.href.split("=")[1];
    getPersonalInfo.get(personId).then(function(response) {
      return $scope.doctor = response.data;
    });
    $scope.RefreshBtn = function(trigger) {
      if (trigger) {
        $('input').not('.not-changeble').removeAttr("readonly");
        $('hr').css("display", "none");
        $('#save').css("display", "block");
        $('#refresh').css("display", "none");
        $('#cansel').css("display", "none");
        return $('#canselRefresh').css("display", "block");
      } else {
        $('input').not('.not-changeble').attr("readonly", "readonly");
        $('hr').css("display", "block");
        $('#save').css("display", "none");
        $('#refresh').css("display", "initial");
        $('#cansel').css("display", "initial");
        return $('#canselRefresh').css("display", "none");
      }
    };
    $scope.CloseBtn = function() {
      return parent.$.fancybox.close();
    };
    return $scope.SaveBtn = function() {
      var data;
      data = $scope.doctor;
      alert("HELLO");
      return saveChanges.save(data).then(function(response) {
        $('input').not('.not-changeble').attr("readonly", "readonly");
        $('hr').css("display", "block");
        $('#save').css("display", "none");
        $('#refresh').css("display", "initial");
        $('#cansel').css("display", "initial");
        return $('#canselRefresh').css("display", "none");
      });
    };
  }
]);
