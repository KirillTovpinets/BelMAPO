app.controller("OptionsCtrl", [
  "getOptions", "findDoctor", "$scope", function(getOptions, findDoctor, $scope) {
    $scope.establishment = [];
    $scope.appointment = [];
    $scope.speciality = [];
    $scope.qualification = [];
    $scope.category = [];
    $scope.doctors = [];
    $scope.find = {
      gender: {
        id: '1',
        name: 'Мужской'
      },
      options: [
        {
          id: '1',
          name: "Мужской"
        }, {
          id: '2',
          name: "Женский"
        }
      ],
      fromAge: 20,
      toAge: 50
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
          $scope.find.establishment = ui.value;
          return $scope.findAction();
        }
      });
      $("#app").autocomplete({
        source: app,
        minLength: 4,
        select: function(event, ui) {
          $scope.find.appointment = ui.value;
          return $scope.findAction();
        }
      });
      $("#mainSp").autocomplete({
        source: mainSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_main = ui.value;
          return $scope.findAction();
        }
      });
      $("#repSp").autocomplete({
        source: repSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_rep = ui.value;
          return $scope.findAction();
        }
      });
      $("#otherSp").autocomplete({
        source: otherSpeciality,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.speciality_other = ui.value;
          return $scope.findAction();
        }
      });
      $("#mainQual").autocomplete({
        source: mainQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_main = ui.value;
          return $scope.findAction();
        }
      });
      $("#addQual").autocomplete({
        source: repQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_add = ui.value;
          return $scope.findAction();
        }
      });
      return $("#otherQual").autocomplete({
        source: otherQualification,
        minLength: 3,
        select: function(event, ui) {
          $scope.find.qualification_other = ui.value;
          return $scope.findAction();
        }
      });
    });
    return $scope.findAction = function() {
      var data;
      data = this.find;
      $('#DoctorList').preloader('start');
      return findDoctor.get(data).then(function(response) {
        $scope.doctors = response.data;
        return $('#DoctorList').preloader('stop');
      });
    };
  }
]);
