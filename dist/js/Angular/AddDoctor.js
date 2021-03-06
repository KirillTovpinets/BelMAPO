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

define("AddDoctor", function(){});

app.directive("profile", function() {
  return {
    restrict: 'E',
    templateUrl: 'profile.html'
  };
});

define("addForm", function(){});

app.directive("onlyLettersInput", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attr, ngModelCtrl) {
      var fromUser;
      fromUser = function(text) {
        var transformedInput;
        transformedInput = text.replace(/[^а-яА-Я\s]/g, '');
        if (transformedInput !== text) {
          ngModelCtrl.$setViewValue(transformedInput);
          ngModelCtrl.$render();
        }
        return transformedInput;
      };
      return ngModelCtrl.$parsers.push(fromUser);
    }
  };
});

define("lettersonly", function(){});

app.factory("getOptions", function($http) {
  return {
    get: function() {
      return $http.get("./php/getOptions.php");
    }
  };
});

define("getOptions", function(){});

app.factory("savePersonSrv", function($http) {
  return {
    save: function(data) {
      return $http.post("php/savePerson.php", data);
    }
  };
});

define("savePersonSrv", function(){});


require(["AddDoctor", "addForm", "lettersonly", "getOptions", "savePersonSrv"]);
