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
  '$scope', 'getPersonalInfo', 'getOptions', 'saveChanges', 'removeSP', 'addSP', 'addQu', function($scope, getPersonalInfo, getOptions, saveChanges, removeSP, addSP, addQu) {
    var oldInfo, personId;
    $scope.doctor = {
      isDoctor: false
    };
    $scope.newSP = {
      name: ""
    };
    $scope.newQu = {
      name: ""
    };
    getOptions.get().then(function(data) {
      var country, department, est, faculty, makeAuto, organization, qualifications, region, specialities;
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
      specialities = makeAuto(data.data.SpecialityList);
      qualifications = makeAuto(data.data.QualificationList);
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
      $("#personalSp input").autocomplete({
        source: specialities,
        minLength: 4,
        select: function(event, ui) {
          return $scope.newSP.name = this.value;
        }
      });
      $("#personalQu input").autocomplete({
        source: qualifications,
        minLength: 4,
        select: function(event, ui) {
          return $scope.newQu.name = this.value;
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
    $(".date-picker").datepicker("option", "disabled", true);
    personId = document.location.href.split("=")[1];
    oldInfo = {};
    getPersonalInfo.get(personId).then(function(response) {
      $scope.doctor.id = personId;
      $scope.doctor = response.data.general;
      $scope.doctor.specialities = response.data.specialities;
      return $scope.doctor.qualifications = response.data.qualifications;
    });
    $scope.RefreshBtn = function(trigger) {
      angular.copy($scope.doctor, oldInfo);
      if (trigger) {
        $('#personalInfo input').not('.not-changeble').removeAttr("readonly");
        $(".date-picker").datepicker("option", "disabled", false);
        $('hr').css("display", "none");
        $('#save').css("display", "block");
        $('#refresh').css("display", "none");
        $('#cansel').css("display", "none");
        return $('#canselRefresh').css("display", "block");
      } else {
        $('#personalInfo  input').not('.not-changeble').attr("readonly", "readonly");
        $(".date-picker").datepicker("option", "disabled", true);
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
    $scope.triggerAdd = true;
    $scope.SaveNewSP = function() {
      if ($scope.newSP.name === "") {
        $("#personalSp input").css("box-shadow", "0 0 3px 0 #f00");
        return;
      }
      data.name = $scope.newSP.name;
      data.idPerson = $scope.doctor.id;
      return addSP.add(data).then(function(data) {
        return $scope.doctor.specialities.push(data.data);
      });
    };
    $scope.SaveNewQu = function() {
      if ($scope.newQu.name === "") {
        $("#personalQu input").css("box-shadow", "0 0 3px 0 #f00");
        return;
      }
      data.name = $scope.newQu.name;
      data.idPerson = $scope.doctor.id;
      return addQu.add(data).then(function(data) {
        return $scope.doctor.qualifications.push(data.data);
      });
    };
    $scope.showSpFieldAction = function() {
      if ($scope.triggerAdd) {
        $("#addSP span").removeClass("fa-plus");
        $("#addSP span").addClass("fa-times");
        $("#addSP").css("color", "red");
        $("#personalSp").css("display", "inline");
        return $scope.triggerAdd = !$scope.triggerAdd;
      } else {
        $("#addSP span").removeClass("fa-times");
        $("#addSP span").addClass("fa-plus");
        $("#addSP").css("color", "green");
        $("#personalSp").css("display", "none");
        $scope.triggerAdd = !$scope.triggerAdd;
        return $scope.newSP.name = "";
      }
    };
    $scope.showQuFieldAction = function() {
      if ($scope.triggerAdd) {
        $("#addQu span").removeClass("fa-plus");
        $("#addQu span").addClass("fa-times");
        $("#addQu").css("color", "red");
        $("#personalQu").css("display", "inline");
        return $scope.triggerAdd = !$scope.triggerAdd;
      } else {
        $("#addQu span").removeClass("fa-times");
        $("#addQu span").addClass("fa-plus");
        $("#addQu").css("color", "green");
        $("#personalQu").css("display", "none");
        $scope.triggerAdd = !$scope.triggerAdd;
        return $scope.newQu.name = "";
      }
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
