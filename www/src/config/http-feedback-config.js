statracker.config([
    '$httpProvider',
    function ($httpProvider) {

        //broadcast an event with the start and end of each http call
        $httpProvider.interceptors.push(['$rootScope', '$q', '$injector', function($rootScope, $q, $injector) {
            var toaster;
            return {
                request: function(config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                response: function(response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                responseError: function (rejection) {
                    toaster = toaster || $injector.get('toaster');
                    $rootScope.$broadcast('loading:hide');
                    if (rejection.data.message) toaster.toastError(rejection.data.message);
                    else if (rejection.data.Message) toaster.toastError(rejection.data.Message);
                    else toaster.toastError(rejection.data);
                    return $q.reject(rejection);
                }
            };
        }]);
    }
]);

//register listeners to the http start and end events we configured above
statracker.run(['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: '<i class="icon ion-loading-b"></i>', noBackdrop: true});
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });
}]);
