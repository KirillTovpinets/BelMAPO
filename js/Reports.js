app.controller("ReportsCtrl", [
  'getParams', '$scope', function(getParams, $scope) {
    $scope.params = {};
    return getParams.get().then(function(data) {
      var appArr, depArr, estArr, facArr, makeAuto, orgArr, regArr, residArr;
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
      regArr = makeAuto($scope.params.regArr);
      depArr = makeAuto($scope.params.depArr);
      facArr = makeAuto($scope.params.facArr);
      $("#ee").autocomplete({
        source: estArr,
        minLength: 7
      });
      $("#resid").autocomplete({
        source: residArr,
        minLength: 7
      });
      $("#app").autocomplete({
        source: appArr,
        minLength: 7
      });
      $("#org").autocomplete({
        source: orgArr,
        minLength: 7
      });
      $("#reg").autocomplete({
        source: regArr,
        minLength: 7
      });
      $("#dep").autocomplete({
        source: depArr,
        minLength: 7
      });
      $("#fac").autocomplete({
        source: facArr,
        minLength: 7
      });
      $("#DipDate").slider({
        range: true,
        values: [10, 90],
        min: 0,
        step: 1,
        max: 100,
        slide: function(event, ui) {
          var dateFrom, dateTo;
          dateFrom = new Date($("#DipDateFrom").val());
          dateTo = new Date($("#DipDateTo").val());
          dateFrom.setDate(dateFrom.getDate() + ui.values[0]);
          dateTo.setDate(dateTo.getDate() + ui.values[1]);
          $("#DipDateFrom").val(dateFrom.getFullYear() + "-" + dateFrom.getMonth() + "-" + dateFrom.getDate());
          return $("#DipDateTo").val(dateTo.getFullYear() + "-" + dateTo.getMonth() + "-" + dateTo.getDate());
        }
      });
      $("#DipDateFrom").val("1956-01-01");
      return $("#DipDateTo").val("2017-01-01");
    });
  }
]);
