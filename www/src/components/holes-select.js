statracker.directive('holesSelect', [
    '$parse',
    function($parse){
        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            template: '<div class="holes-container button-bar"><a class="button button-holes button-small">9</a><a class="button button-holes button-small">18</a></div>',
            link: function(scope, elem, attrs, ngModelCtrl){
                var buttons = elem.find('a'),
                    value = $parse(attrs.ngModel)(scope),
                    updateButtons;

                updateButtons = function (value) {
                    angular.forEach(buttons, function (btn) {
                        var b = angular.element(btn);
                        if (btn.innerText == value) { // jshint ignore: line
                            if (!b.hasClass('button-calm')) {
                                b.addClass('button-calm');
                                b.removeClass('button-outline');
                            } else {
                                b.removeClass('button-stable');
                                b.addClass('button-outline');
                            }
                        } else {
                            if (b.hasClass('button-calm')) {
                                b.removeClass('button-calm');
                                b.addClass('button-outline');
                            } else {
                                b.addClass('button-stable');
                                b.removeClass('button-outline');
                            }
                        }
                    });
                };

                elem.bind('click', function () {
                    if (value === undefined) {
                        value = 18;
                    } else if (value === 9) {
                        value = 18;
                    } else {
                        value = 9;
                    }
                    ngModelCtrl.$setViewValue(value);
                    updateButtons(value);
                });

                updateButtons(value);
            }
        };
    }
]);