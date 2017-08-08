gulp = require 'gulp'
jade = require 'gulp-jade'
connect = require 'gulp-connect'
stylus = require 'gulp-stylus'
coffee = require 'gulp-coffee'
uglify = require 'gulp-uglify'
clean = require 'gulp-clean'
rjs = require 'gulp-requirejs'
postcss = require 'gulp-postcss'
minifyCSS = require 'gulp-minify-css'
sourcemaps = require 'gulp-sourcemaps'
rename = require 'gulp-rename'
minifyHTML = require 'gulp-minify-html'

gulp.task 'jade', ->
	gulp.src 'jade/*.jade'
	.pipe do jade
	.pipe gulp.dest 'dist'
	.pipe do connect.reload
gulp.task 'stylus', ->
	gulp.src 'stylus/*.styl'
	.pipe stylus set: ['compress']
	.pipe do minifyCSS
	.pipe gulp.dest 'dist/css'
	.pipe do connect.reload

gulp.task 'build', ['coffee'], ->
	rjs
		baseUrl: 'js'
		name: '../bower_components/almond/almond'
		include: ['main', 'getListService', 'getNationalityService', 'getFacultyService', 'getSpecialityService']
		insertRequire: ['main', 'getListService', 'getNationalityService', 'getFacultyService', 'getSpecialityService']
		out: 'all.js'
		wrap: off
	# .pipe do uglify
	.pipe gulp.dest 'dist/js'
	.pipe do connect.reload

	# gulp.src 'js/', read: no
	# .pipe do clean

gulp.task 'buildDoctorList', ['coffeeDoctorList'], ->
	rjs
		baseUrl: 'js'
		name: '../bower_components/almond/almond'
		include: ['DoctorList', 'getOptions', 'findDoctor']
		insertRequire: ['DoctorList', 'getOptions', 'findDoctor']
		out: 'Doctors.js'
		wrap: off
	# .pipe do uglify
	.pipe gulp.dest 'dist/js/Angular'

gulp.task 'buildPersonalInfo', ['coffeePersonalInfo'], ->
	rjs
		baseUrl: 'js/personalInfo'
		name: '../../bower_components/almond/almond'
		include: ['personalInfo', 'getPersonalInfo', 'saveChanges', 'getOptions','removeSP','addSP', 'addQu']
		insertRequire: ['personalInfo', 'getPersonalInfo', 'saveChanges', 'getOptions','removeSP','addSP', 'addQu']
		out: 'personalInfo.js'
		wrap: off
	# .pipe do uglify
	.pipe gulp.dest 'dist/js/Angular'
	.pipe do connect.reload

gulp.task 'buildAddDoctor', ['coffeeAddDoctor'], ->
	rjs
		baseUrl: 'js'
		name: '../bower_components/almond/almond'
		include: ['AddDoctor', 'addForm', 'lettersonly', 'getOptions','savePersonSrv']
		insertRequire: ['AddDoctor', 'addForm', 'lettersonly', 'getOptions','savePersonSrv']
		out: 'AddDoctor.js'
		wrap: off
	.pipe gulp.dest 'dist/js/Angular'

gulp.task 'buildReports', ['coffeeReports'], ->
	rjs
		baseUrl: 'js'
		name: '../bower_components/almond/almond'
		include: ['Reports', 'getParams', 'buildReport']
		insertRequire: ['Reports', 'getParams', 'buildReport']
		out: 'Reports.js'
		wrap: off
	.pipe gulp.dest 'dist/js/Angular'

gulp.task 'coffee', ->
	gulp.src ['coffee/Angular/main.coffee', 'coffee/services/*.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'coffeeDoctorList', ->
	gulp.src ['coffee/Angular/DoctorList.coffee', 'coffee/services/doctors/*.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'coffeeAddDoctor', ->
	gulp.src ['coffee/Angular/AddDoctor.coffee', 
				'coffee/directives/*.coffee', 
				'coffee/services/doctors/getOptions.coffee',
				'coffee/services/savePersonSrv.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'coffeeReports', ->
	gulp.src ['coffee/Angular/Reports.coffee', 
				'coffee/services/reports/*.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'coffeePersonalInfo', ->
	gulp.src ['coffee/Angular/personalInfo.coffee', 
				'coffee/services/doctors/getPersonalInfo.coffee', 
				'coffee/services/doctors/saveChanges.coffee',
				'coffee/services/doctors/getOptions.coffee',
				'coffee/services/doctors/removeSP.coffee',
				'coffee/services/doctors/addSP.coffee',
				'coffee/services/doctors/addQu.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js/personalInfo'

gulp.task 'LoginCoffee', ->
	gulp.src 'coffee/Angular/login.coffee'
	.pipe do coffee
	.pipe gulp.dest 'dist/js'

gulp.task 'watch', ->
	gulp.watch 'jade/*.jade', ['jade']
	gulp.watch 'stylus/*.styl', ['stylus']
	gulp.watch 'coffee/*.coffee', ['build']
	gulp.watch 'coffee/Angular/*.coffee', ['build', 'buildDoctorList', 'buildPersonalInfo', 'buildAddDoctor', 'buildReports']
	gulp.watch 'coffee/services/*.coffee', ['build', 'buildAddDoctor']
	gulp.watch 'coffee/services/doctors/*.coffee', ['buildDoctorList', 'buildPersonalInfo']
	gulp.watch 'coffee/services/reports/*.coffee', ['buildReports']
	gulp.watch 'coffee/directives/*.coffee', ['buildAddDoctor']

gulp.task 'default', ['jade', 'stylus', 'LoginCoffee', 'build', 'buildDoctorList', 'buildPersonalInfo', 'buildAddDoctor', 'buildReports', 'watch']