statracker.directive('goto', [
    '$ionicPopover',
    function ($ionicPopover) {
        return {
            restrict: 'AE',
            template: '<button class="button button-small button-clear" ng-click="open($event)">Hole {{hole}}</button>',
            scope: {
                hole: '=',
                holes: '='
            },
            link: function(scope) {

                $ionicPopover.fromTemplateUrl('src/rounds/goto-popover.html', {
                    scope: scope
                }).then(function(popover) {
                    scope.popover = popover;
                });

                scope.open = function(e) {
                    scope.popover.show(e);
                };

                scope.goto = function(hole) {
                    if (hole <= scope.holes) {
                        scope.$emit('hole_change', hole);
                    }
                    scope.popover.hide();
                };

                scope.$on('$destroy', function() {
                    scope.popover.remove();
                });
            }
        };
    }
]);
