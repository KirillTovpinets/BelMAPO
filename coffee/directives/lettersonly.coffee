app.directive "onlyLettersInput", ->
	{
		require: "ngModel"
		link: (scope, element, attr, ngModelCtrl) ->
			fromUser = (text) ->
				transformedInput = text.replace /[^а-яА-Я\s]/g, ''

				if transformedInput != text
					ngModelCtrl.$setViewValue transformedInput
					do ngModelCtrl.$render
				return transformedInput
			ngModelCtrl.$parsers.push fromUser
	}