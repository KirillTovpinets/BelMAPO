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
		include: ['main', 'getLastList', 'getNationalityService', 'getFacultyService', 'getSpecialityService']
		insertRequire: ['main', 'getLastList', 'getNationalityService', 'getFacultyService', 'getSpecialityService']
		out: 'all.js'
		wrap: off
	.pipe do uglify
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
	.pipe gulp.dest 'dist/js'
	.pipe do connect.reload


gulp.task 'coffee', ->
	gulp.src ['coffee/Angular/main.coffee', 'coffee/services/*.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'coffeeDoctorList', ->
	gulp.src ['coffee/Angular/DoctorList.coffee', 'coffee/services/doctors/*.coffee']
	.pipe(coffee({bare:true}))
	.pipe gulp.dest 'js'

gulp.task 'LoginCoffee', ->
	gulp.src 'coffee/Angular/login.coffee'
	.pipe do coffee
	.pipe gulp.dest 'dist/js'
	.pipe do connect.reload

# gulp.task 'ServiceCoffee', ->
# 	gulp.src 'coffee/services/*.coffee'
# 	.pipe do coffee
# 	.pipe gulp.dest 'dist/js/Angular/services'
# 	.pipe do connect.reload

gulp.task 'connect', ->
	connect.server
		port: 1337
		livereload: on
		root: './dist'

gulp.task 'watch', ->
	gulp.watch 'jade/*.jade', ['jade']
	gulp.watch 'stylus/*.styl', ['stylus']
	gulp.watch 'coffee/*.coffee', ['build']
	gulp.watch 'coffee/Angular/*.coffee', ['build', 'buildDoctorList']
	gulp.watch 'coffee/services/*.coffee', ['build']
	gulp.watch 'coffee/services/doctors/*.coffee', ['buildDoctorList']

gulp.task 'default', ['jade', 'stylus', 'LoginCoffee', 'connect', 'build', 'buildDoctorList', 'watch']