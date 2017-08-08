app.controller("AddDoctorController", [
  'getOptions', '$scope', 'savePersonSrv', function(getOptions, $scope, savePersonSrv) {
    $scope.doctor = {
      name: "Кирилл",
      surname: "Товпинец",
      patername: "Александрович",
      birthday: "1994-02-10",
      EstName: "Витебский государственный медицинский институт",
      AppName: "программист",
      specialities: ["Врач-психиатр"],
      qualifications: ["Врач-дерматолог"],
      ResName: "Беларусь",
      OrgName: "БелМАПО",
      RegName: "Минск",
      diploma_start: "2017-06-20",
      tel_number: "+375(29)853-75-96",
      DepName: "ЦИТ",
      isDoctor: false,
      isCowoker: false,
      insurance_number: "3100294E006PB9",
      diploma_number: "123456789",
      FacName: "ФИЭ",
      exp: 10,
      expAdd: 15
    };
    $scope.newSP = {
      name: ""
    };
    $scope.newQu = {
      name: ""
    };
    $scope.ShowEducInfo = function() {
      $("#personalInfo").removeClass("active");
      $(".nav-tabs a[href='#personalInfo']").parent().removeClass("active");
      $(".nav-tabs a[href='#personalInfo']").attr("aria-expanded", "false");
      $("#studInfo").addClass("active");
      $(".nav-tabs a[href='#studInfo']").parent().addClass("active");
      return $(".nav-tabs a[href='#studInfo']").attr("aria-expanded", "true");
    };
    getOptions.get().then(function(data) {
      var app, cathedras, country, course, department, est, faculty, makeAuto, organization, qualifications, region, specialities;
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
      specialities = makeAuto(data.data.SpecialityList);
      qualifications = makeAuto(data.data.QualificationList);
      country = makeAuto(data.data.countryList);
      organization = makeAuto(data.data.organizationList);
      region = makeAuto(data.data.regionList);
      department = makeAuto(data.data.departmentList);
      faculty = makeAuto(data.data.facultyList);
      $scope.faculties = data.data.mapo_faculties;
      cathedras = makeAuto(data.data.mapo_cathedra);
      course = makeAuto(data.data.mapo_course);
      $scope.educType = data.data.mapo_educType;
      $scope.residPlace = data.data.mapo_ResidPlace;
      $scope.forms = data.data.mapo_formEduc;
      $("#cathedra").autocomplete({
        source: cathedras,
        minLength: 5,
        select: function(event, ui) {
          return $scope.doctor.cathedra = this.value;
        }
      });
      $("#courseName").autocomplete({
        source: course,
        minLength: 5,
        select: function(event, ui) {
          return $scope.doctor.course = this.value;
        }
      });
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
    $("#AddpersonalInfo .date-picker").datepicker({
      dateFormat: "yy-mm-dd"
    });
    $scope.triggerAdd = true;
    $scope.SaveNewSP = function() {
      if ($scope.newSP.name === "") {
        $("#personalSp input").css("box-shadow", "0 0 3px 0 #f00");
        return;
      }
      $scope.doctor.specialities.push($scope.newSP.name);
      $("#addSP span").removeClass("fa-times");
      $("#addSP span").addClass("fa-plus");
      $("#addSP").css("color", "green");
      return $("#personalSp").css("display", "none");
    };
    $scope.SaveNewQu = function() {
      if ($scope.newQu.name === "") {
        $("#personalQu input").css("box-shadow", "0 0 3px 0 #f00");
        return;
      }
      $scope.doctor.qualifications.push($scope.newQu.name);
      $("#addQu span").removeClass("fa-times");
      $("#addQu span").addClass("fa-plus");
      $("#addQu").css("color", "green");
      return $("#personalQu").css("display", "none");
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
    $scope.Error = function() {
      return notify.showNotification("Ошибка. Проверьте правильность введённых данных", 'danger');
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
    $scope.ResetBtn = function() {
      return $scope.doctor = {
        specialities: [],
        qualifications: []
      };
    };
    return $scope.SavePerson = function() {
      var data;
      data = $scope.doctor;
      return savePersonSrv.save(data).then(function(data) {
        notify.showNotification("Слушатель зачислен", 'success');
        return $scope.doctor = {};
      });
    };
  }
]);
