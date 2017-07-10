app.controller("OptionsCtrl", [
  "getOptions", "findDoctor", "$scope", function(getOptions, findDoctor, $scope) {
    var scrollCounter;
    $scope.establishment = [];
    $scope.appointment = [];
    $scope.speciality = [];
    $scope.qualification = [];
    $scope.category = [];
    $scope.doctors = [];
    $scope.find = {
      fromAge: 20,
      toAge: 50,
      offset: 0,
      count: 6
    };
    $("#age").slider({
      min: 0,
      max: 100,
      range: true,
      values: [20, 50],
      slide: function(event, ui) {
        $("#fromAge").html(ui.values[0]);
        return $("#toAge").html(ui.values[1]);
      },
      change: function(event, ui) {
        $scope.find.fromAge = ui.values[0];
        $scope.find.toAge = ui.values[1];
        return $scope.findAction();
      }
    });
    getOptions.get().then(function(data) {
      var app, est, mainQualification, mainSpeciality, makeAuto, otherQualification, otherSpeciality, repQualification, repSpeciality;
      makeAuto = function(data) {
        var auto, i, len, value;
        auto = [];
        for (i = 0, len = data.length; i < len; i++) {
          value = data[i];
          auto.push(value.name);
        }
        return auto;
      };
      est = makeAuto(data.data.estList);
      app = makeAuto(data.data.appList);
      mainSpeciality = makeAuto(data.data.mainSpecialityList);
      repSpeciality = makeAuto(data.data.repSpecialityList);
      otherSpeciality = makeAuto(data.data.otherSpecialityList);
      mainQualification = makeAuto(data.data.mainQualificationList);
      repQualification = makeAuto(data.data.repQualificationList);
      otherQualification = makeAuto(data.data.otherQualificationList);
      $("#ee").autocomplete({
        source: est,
        minLength: 9,
        select: function(event, ui) {
          $scope.find.establishment = this.value;
          return $scope.findAction();
        }
      });
      $("#app").autocomplete({
        source: app,
        minLength: 4,
        select: function(event, ui) {
          $scope.find.appointment = this.value;
          return $scope.findAction();
        }
      });
      $("#mainSp").autocomplete({
        source: mainSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_main = this.value;
          return $scope.findAction();
        }
      });
      $("#repSp").autocomplete({
        source: repSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_rep = this.value;
          return $scope.findAction();
        }
      });
      $("#otherSp").autocomplete({
        source: otherSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_other = this.value;
          return $scope.findAction();
        }
      });
      $("#mainQual").autocomplete({
        source: mainQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_main = this.value;
          return $scope.findAction();
        }
      });
      $("#addQual").autocomplete({
        source: repQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_add = this.value;
          return $scope.findAction();
        }
      });
      return $("#otherQual").autocomplete({
        source: otherQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_other = this.value;
          return $scope.findAction();
        }
      });
    });
    scrollCounter = -400;
    $scope.findAction = function() {
      var data;
      data = this.find;
      $('#DoctorList').preloader('start');
      $scope.find.offset = 0;
      $scope.find.count = 6;
      scrollCounter = -400;
      return findDoctor.get(data).then(function(response) {
        $scope.doctors = response.data;
        return $('#DoctorList').preloader('stop');
      });
    };
    $scope.getDoctorLink = function(id) {
      return "doctorInfo.html?id=" + id;
    };
    return $(".main-panel").scroll(function() {
      var data, scrollOffsetTop;
      scrollOffsetTop = $(".main-panel").children().first().offset().top;
      if (scrollOffsetTop < scrollCounter) {
        scrollCounter -= 400;
        $scope.find.offset += $scope.doctors.length;
        data = $scope.find;
        return findDoctor.get(data).then(function(response) {
          var i, len, obj, ref;
          ref = response.data;
          for (i = 0, len = ref.length; i < len; i++) {
            obj = ref[i];
            $scope.doctors.push(obj);
          }
          return $scope.find.offset += response.data.length;
        });
      }
    });
  }
]);
