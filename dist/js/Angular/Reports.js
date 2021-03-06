/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../bower_components/almond/almond", function(){});

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

define("Reports", function(){});

app.factory("getParams", function($http) {
  return {
    get: function() {
      return $http.get("php/getParams.php");
    }
  };
});

define("getParams", function(){});

app.factory("buildReport", function($http) {
  return {
    build: function(params) {
      return $http.post("php/buildReport.php", params);
    }
  };
});

define("buildReport", function(){});


require(["Reports", "getParams", "buildReport"]);
