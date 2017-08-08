app.controller("ReportsCtrl", [
  'getParams', '$scope', 'buildReport', function(getParams, $scope, buildReport) {
    var checkValue;
    $scope.params = {};
    $scope.filterParams = {};
    $scope.filterParams.tableIds = [];
    $scope.ParamLabels = ["Учреждение образования", "Гражданство", "Дата получения диплома", "Должность", "Звание кандидата медицинских нук", "Организация", "Область", "Пол", "Сотрудник", "Опыт работы", "Отдел", "Факультет", "Факультет БелМАПО", "Кафедра БелМАПО", "Курс", "Форма обучения", "Номер группы", "Тип обучения"];
    $scope.LabelsToDisplay = [];
    getParams.get().then(function(data) {
      var appArr, cathedras, coursesBel, depArr, estArr, facArr, makeAuto, orgArr, residArr;
      $scope.params = data.data;
      makeAuto = function(data) {
        var auto, i, len, value;
        auto = [];
        for (i = 0, len = data.length; i < len; i++) {
          value = data[i];
          auto.push(value.name);
        }
        return auto;
      };
      estArr = makeAuto($scope.params.estArr);
      residArr = makeAuto($scope.params.residArr);
      appArr = makeAuto($scope.params.appArr);
      orgArr = makeAuto($scope.params.orgArr);
      depArr = makeAuto($scope.params.depArr);
      facArr = makeAuto($scope.params.facArr);
      cathedras = makeAuto($scope.params.cathBel);
      $scope.faculties = $scope.params.facBel;
      cathedras = makeAuto($scope.params.cathBel);
      coursesBel = makeAuto($scope.params.coursesBel);
      $scope.forms = $scope.params.formBel;
      $scope.educTypes = $scope.params.educTypeBel;
      $scope.regions = data.data.regArr;
      $("#ee").autocomplete({
        source: estArr,
        minLength: 7,
        select: function(event, ui) {
          $scope.filterParams.est = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[0];
          return $scope.reportAction(1);
        }
      });
      $("#resid").autocomplete({
        source: residArr,
        select: function(event, ui) {
          $scope.filterParams.resid = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[1];
          return $scope.reportAction(1);
        }
      });
      $("#app").autocomplete({
        source: appArr,
        minLength: 3,
        select: function(event, ui) {
          $scope.filterParams.app = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[3];
          return $scope.reportAction(1);
        }
      });
      $("#org").autocomplete({
        source: orgArr,
        minLength: 3,
        select: function(event, ui) {
          $scope.filterParams.org = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[6];
          return $scope.reportAction(1);
        }
      });
      $("#dep").autocomplete({
        source: depArr,
        minLength: 7,
        select: function(event, ui) {
          $scope.filterParams.dep = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[9];
          return $scope.reportAction(1);
        }
      });
      $("#fac").autocomplete({
        source: facArr,
        minLength: 7,
        select: function(event, ui) {
          $scope.filterParams.fac = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[10];
          return $scope.reportAction(1);
        }
      });
      $("#cathedra").autocomplete({
        source: cathedras,
        minLength: 4,
        select: function(event, ui) {
          $scope.filterParams.cathedra = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[12];
          return $scope.reportAction(2);
        }
      });
      $("#course").autocomplete({
        source: coursesBel,
        minLength: 4,
        select: function(event, ui) {
          $scope.filterParams.course = this.value;
          $scope.LabelsToDisplay = $scope.ParamLabels[13];
          return $scope.reportAction(2);
        }
      });
      $("#DipDateFrom").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date, ui) {
          $scope.filterParams.dipdatefrom = date;
          $scope.LabelsToDisplay = $scope.ParamLabels[2];
          return $scope.reportAction(1);
        }
      });
      return $("#DipDateTo").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date, ui) {
          $scope.filterParams.dipdateto = date;
          $scope.LabelsToDisplay = $scope.ParamLabels[2];
          return $scope.reportAction(1);
        }
      });
    });
    $scope.SelectRegionAction = function($event) {
      if ($scope.filterParams.regions === void 0) {
        $scope.filterParams.regions = [];
      }
      $scope.filterParams.regions = checkValue($event.currentTarget.value, $scope.filterParams.regions);
      $scope.LabelsToDisplay = $scope.ParamLabels[5];
      return $scope.reportAction(1);
    };
    $scope.reportAction = function(flag) {
      var data, index;
      if ($scope.filterParams.est === void 0 && $scope.filterParams.resid === void 0 && $scope.filterParams.DipDateFrom === void 0 && $scope.filterParams.DipDateTo === void 0 && $scope.filterParams.app === void 0 && $scope.filterParams.isDoctor === void 0 && $scope.filterParams.org === void 0 && $scope.filterParams.gender === void 0 && $scope.filterParams.isCowoker === void 0 && $scope.filterParams.experiance === void 0 && $scope.filterParams.dep === void 0 && $scope.filterParams.fac === void 0) {
        index = $scope.filterParams.tableIds.indexOf(1);
        if (index > -1) {
          $scope.filterParams.tableIds.splice(index, 1);
          flag = 0;
        }
      }
      if ($scope.filterParams.cathedra === void 0 && $scope.filterParams.course === void 0 && $scope.filterParams.groupNumber === void 0 && ($scope.filterParams.regions === void 0 || $scope.filterParams.regions.length === 0) && ($scope.filterParams.faculties === void 0 || $scope.filterParams.faculties.length === 0) && ($scope.filterParams.forms === void 0 || $scope.filterParams.forms.length === 0) && ($scope.filterParams.educTypes === void 0 || $scope.filterParams.educTypes.length === 0)) {
        index = $scope.filterParams.tableIds.indexOf(2);
        if (index > -1) {
          $scope.filterParams.tableIds.splice(index, 1);
          flag = 0;
        }
      }
      $('#Results').preloader('start');
      if ($("#DipDateFrom").datepicker("getDate") === null) {
        $scope.filterParams.dipdatefrom = void 0;
      }
      if ($("#DipDateTo").datepicker("getDate") === null) {
        $scope.filterParams.dipdateto = void 0;
      }
      if (flag) {
        $scope.filterParams.tableIds = checkValue(flag, $scope.filterParams.tableIds, 1);
      }
      data = $scope.filterParams;
      return buildReport.build(data).then(function(data) {
        var i, len, ref, value;
        $scope.parameters = [];
        ref = data.data;
        for (i = 0, len = ref.length; i < len; i++) {
          value = ref[i];
          if (value.label !== "total") {
            $scope.parameters.push(value);
          } else {
            $scope.total = value.value;
          }
        }
        if ($scope.parameters.length === 1) {
          $scope.total = $scope.parameters[0].value;
        }
        return $('#Results').preloader('stop');
      });
    };
    $scope.SelectFacultyAction = function($event) {
      if ($scope.filterParams.faculties === void 0) {
        $scope.filterParams.faculties = [];
      }
      $scope.filterParams.faculties = checkValue($event.currentTarget.value, $scope.filterParams.faculties);
      $scope.LabelsToDisplay = $scope.ParamLabels[11];
      return $scope.reportAction(2);
    };
    $scope.SelectFormAction = function($event) {
      if ($scope.filterParams.forms === void 0) {
        $scope.filterParams.forms = [];
      }
      $scope.filterParams.forms = checkValue($event.currentTarget.value, $scope.filterParams.forms);
      $scope.LabelsToDisplay = $scope.ParamLabels[14];
      return $scope.reportAction(2);
    };
    $scope.SelectEducTypeAction = function($event) {
      if ($scope.filterParams.educTypes === void 0) {
        $scope.filterParams.educTypes = [];
      }
      $scope.filterParams.educTypes = checkValue($event.currentTarget.value, $scope.filterParams.educTypes);
      $scope.LabelsToDisplay = $scope.ParamLabels[16];
      return $scope.reportAction(2);
    };
    return checkValue = function(value, array, flag) {
      var contain, i, len, valueArr, valueToRemove;
      contain = false;
      for (i = 0, len = array.length; i < len; i++) {
        valueArr = array[i];
        if (valueArr === value) {
          contain = true;
        }
      }
      if (!contain) {
        array.push(value);
      } else {
        if (flag !== 1) {
          valueToRemove = array.indexOf(value);
          if (valueToRemove > -1) {
            array.splice(valueToRemove, 1);
          }
        }
      }
      return array;
    };
  }
]);
