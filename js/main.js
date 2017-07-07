var app;

app = angular.module('belmapo', [], function($httpProvider) {
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

app.controller("LastList", [
  'getListService', '$scope', function(getListService, $scope) {
    $scope.list = {};
    return getListService.get().then(function(data) {
      return $scope.list = data.data;
    });
  }
]);

app.controller("NationalityCtrl", [
  'getNationalityService', '$scope', function(getNationalityService, $scope) {
    var nationalityList;
    nationalityList = [];
    $('#NationalityChart').preloader('start');
    return getNationalityService.get().then(function(data) {
      var NationalityChart, NationalityConfig, j, len, nationality;
      nationalityList = data.data;
      for (j = 0, len = nationalityList.length; j < len; j++) {
        nationality = nationalityList[j];
        nationality.y = parseInt(nationality.y);
      }
      NationalityConfig = {
        theme: "theme1",
        title: {
          text: "Классификация по национальности"
        },
        animationEnabled: true,
        data: [
          {
            type: "doughnut",
            dataPoints: nationalityList
          }
        ]
      };
      $('#NationalityChart').preloader('stop');
      NationalityChart = new CanvasJS.Chart("NationalityChart", NationalityConfig);
      return NationalityChart.render();
    });
  }
]);

app.controller("FacultyCtrl", [
  'getFacultyService', '$scope', function(getFacultyService, $scope) {
    var faculties;
    faculties = [];
    return getFacultyService.get().then(function(data) {
      var FactultyChart, FacultyConfig, faculty, facultyList, j, len;
      facultyList = data.data;
      for (j = 0, len = facultyList.length; j < len; j++) {
        faculty = facultyList[j];
        faculty.y = parseInt(faculty.y);
      }
      FacultyConfig = {
        theme: "theme1",
        title: {
          text: "Статистика по факультетам"
        },
        animationEnabled: true,
        data: [
          {
            type: "doughnut",
            dataPoints: facultyList
          }
        ]
      };
      FactultyChart = new CanvasJS.Chart("FacultyChart", FacultyConfig);
      return FactultyChart.render();
    });
  }
]);
