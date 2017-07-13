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
  '$scope', 'getPersonalInfo', 'getOptions', 'saveChanges', 'removeSP', 'addSP', function($scope, getPersonalInfo, getOptions, saveChanges, removeSP, addSP) {
    var oldInfo, personId;
    $scope.doctor = {
      isDoctor: false
    };
    getOptions.get().then(function(data) {
      var country, department, est, faculty, makeAuto, organization, region;
      makeAuto = function(data) {
        var auto, j, len, value;
        auto = [];
        for (j = 0, len = data.length; j < len; j++) {
          value = data[j];
          auto.push(value.name);
        }
        return auto;
      };
      est = makeAuto(data.data.estList);
      app = makeAuto(data.data.appList);
      country = makeAuto(data.data.countryList);
      organization = makeAuto(data.data.organizationList);
      region = makeAuto(data.data.regionList);
      department = makeAuto(data.data.departmentList);
      faculty = makeAuto(data.data.facultyList);
      $("#ee").autocomplete({
        source: est,
        minLength: 9,
        select: function(event, ui) {
          return $scope.doctor.EstName = this.value;
        }
      });
      $("#app").autocomplete({
        source: app,
        minLength: 4,
        select: function(event, ui) {
          return $scope.doctor.AppName = this.value;
        }
      });
      $("#country").autocomplete({
        source: country,
        minLength: 3,
        select: function(event, ui) {
          return $scope.doctor.ResName = this.value;
        }
      });
      $("#organization").autocomplete({
        source: organization,
        minLength: 3,
        select: function(event, ui) {
          return $scope.doctor.OrgName = this.value;
        }
      });
      $("#region").autocomplete({
        source: region,
        minLength: 3,
        select: function(event, ui) {
          return $scope.doctor.RegName = this.value;
        }
      });
      $("#department").autocomplete({
        source: department,
        minLength: 3,
        select: function(event, ui) {
          return $scope.doctor.DepName = this.value;
        }
      });
      return $("#faculty").autocomplete({
        source: faculty,
        minLength: 3,
        select: function(event, ui) {
          return $scope.doctor.FacName = this.value;
        }
      });
    });
    $(".date-picker").datepicker({
      dateFormat: "yy-mm-dd"
    });
    personId = document.location.href.split("=")[1];
    oldInfo = {};
    getPersonalInfo.get(personId).then(function(response) {
      $scope.doctor.id = personId;
      $scope.doctor = response.data.general;
      return $scope.doctor.specialities = response.data.additional;
    });
    $scope.removeSP = function(id) {
      var data;
      data = {};
      data.idPerson = $scope.doctor.id;
      data.idSP = id;
      alert(data.idSP);
      return removeSP["delete"](data).then(function() {});
    };
    $scope.addSP = function() {
      var idPerson;
      idPerson = $scope.doctor.id;
      return removeSP["delete"](idPerson).then(function() {});
    };
    $scope.RefreshBtn = function(trigger) {
      angular.copy($scope.doctor, oldInfo);
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
      var data, hasChaned, key, ref, value;
      alert($scope.doctor.EstName);
      data = {};
      hasChaned = false;
      ref = $scope.doctor;
      for (key in ref) {
        value = ref[key];
        if (value !== oldInfo[key]) {
          data[key] = value;
          hasChaned = true;
        }
      }
      if (hasChaned) {
        data.id = personId;
        return saveChanges.save(data).then(function(response) {
          alert(response.data);
          $('input').not('.not-changeble').attr("readonly", "readonly");
          $('hr').css("display", "block");
          $('#save').css("display", "none");
          $('#refresh').css("display", "initial");
          $('#cansel').css("display", "initial");
          return $('#canselRefresh').css("display", "none");
        });
      } else {
        return alert("NO changes");
      }
    };
  }
]);
