statracker.directive('puttsInput', [
    '$parse',
    function ($parse) {
        return {
            restrict: 'AE',
            templateUrl: 'src/rounds/shortgame/putts-input.html',
            replace: true,
            require: 'ngModel',
            link: function (scope, element, attributes, controller) {

                var putts = element.find('circle'),
                    initialValue = $parse(attributes.ngModel)(scope);

                var clearPutts = function () {
                    putts.forEach(function (putt) {
                        if (!putt.hasClass('unselected')) putt.addClass('unselected');
                        if (putt.hasClass('selected')) putt.removeClass('selected');
                    });
                };

                var showPutt = function(value) {
                    putts.forEach(function (putt) {
                        var puttValue = parseInt(putt.getAttribute(('data-value')));
                        if (puttValue === value) {
                            if (!putt.hasClass('selected')) putt.addClass('selected');
                            if (putt.hasClass('unselected')) putt.removeClass('unselected');
                        } else {
                            if (!putt.hasClass('unselected')) putt.addClass('unselected');
                            if (putt.hasClass('selected')) putt.removeClass('selected');
                        }
                    });
                };

                if (initialValue !== undefined) {
                    showPutt(initialValue);
                } else {
                    clearPutts();
                }

                putts.bind('click', function () {
                    var value = parseInt(this.getAttribute(('data-value')));
                    controller.$setViewValue(value);
                    showPutt(value);
                    scope.$apply();
                });
            }
        };
    }
]);