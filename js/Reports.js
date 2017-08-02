app.controller("ReportsCtrl", [
  'getParams', '$scope', 'buildReport', function(getParams, $scope, buildReport) {
    var checkValue;
    $scope.params = {};
    $scope.filterParams = {};
    $scope.filterParams.personal = {};
    $scope.filterParams.educational = {};
    $scope.filterParams.tableIds = [];
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
          $scope.filterParams.personal.est = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#resid").autocomplete({
        source: residArr,
        select: function(event, ui) {
          $scope.filterParams.personal.resid = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#app").autocomplete({
        source: appArr,
        minLength: 3,
        select: function(event, ui) {
          $scope.filterParams.personal.app = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#org").autocomplete({
        source: orgArr,
        minLength: 3,
        select: function(event, ui) {
          $scope.filterParams.personal.org = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#dep").autocomplete({
        source: depArr,
        minLength: 7,
        select: function(event, ui) {
          $scope.filterParams.personal.dep = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#fac").autocomplete({
        source: facArr,
        minLength: 7,
        select: function(event, ui) {
          $scope.filterParams.personal.fac = this.value;
          return $scope.reportAction(1);
        }
      });
      $("#cathedra").autocomplete({
        source: cathedras,
        minLength: 4,
        select: function(event, ui) {
          $scope.filterParams.educational.cathedra = this.value;
          return $scope.reportAction(2);
        }
      });
      $("#course").autocomplete({
        source: coursesBel,
        minLength: 4,
        select: function(event, ui) {
          $scope.filterParams.educational.course = this.value;
          return $scope.reportAction(2);
        }
      });
      $("#DipDateFrom").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date, ui) {
          $scope.filterParams.personal.dipdatefrom = date;
          return $scope.reportAction(1);
        }
      });
      return $("#DipDateTo").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function(date, ui) {
          $scope.filterParams.personal.dipdateto = date;
          return $scope.reportAction(1);
        }
      });
    });
    $scope.SelectRegionAction = function($event) {
      if ($scope.filterParams.regions === void 0) {
        $scope.filterParams.personal.regions = [];
      }
      $scope.filterParams.personal.regions = checkValue($event.currentTarget.value, $scope.filterParams.personal.regions);
      return $scope.reportAction(1);
    };
    $scope.reportAction = function(flag) {
      var data;
      $('#Results').preloader('start');
      if ($("#DipDateFrom").datepicker("getDate") === null) {
        $scope.filterParams.personal.dipdatefrom = void 0;
      }
      if ($("#DipDateTo").datepicker("getDate") === null) {
        $scope.filterParams.personal.dipdateto = void 0;
      }
      $scope.filterParams.tableIds = checkValue(flag, $scope.filterParams.tableIds, 1);
      data = $scope.filterParams;
      return buildReport.build(data).then(function(data) {
        alert(data.data);
        $scope.total = data.data.Total;
        return $('#Results').preloader('stop');
      });
    };
    $scope.SelectFacultyAction = function($event) {
      if ($scope.filterParams.educational.faculties === void 0) {
        $scope.filterParams.educational.faculties = [];
      }
      $scope.filterParams.educational.faculties = checkValue($event.currentTarget.value, $scope.filterParams.educational.faculties);
      return $scope.reportAction(2);
    };
    $scope.SelectFormAction = function($event) {
      if ($scope.filterParams.educational.forms === void 0) {
        $scope.filterParams.forms = [];
      }
      $scope.filterParams.educational.forms = checkValue($event.currentTarget.value, $scope.filterParams.educational.forms);
      return $scope.reportAction(2);
    };
    $scope.SelectEducTypeAction = function($event) {
      if ($scope.filterParams.educational.educTypes === void 0) {
        $scope.filterParams.educTypes = [];
      }
      $scope.filterParams.educational.educTypes = checkValue($event.currentTarget.value, $scope.filterParams.educational.educTypes);
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
