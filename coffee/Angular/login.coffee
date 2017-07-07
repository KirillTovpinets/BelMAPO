app = angular.module 'login', []

$('.message a').click ->
	$('form').animate {height: "toggle", opacity: "toggle"}, "slow"

