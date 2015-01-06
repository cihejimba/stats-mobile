'use strict';

statracker.config([
    '$httpProvider',
    function ($httpProvider) {

        //broadcast an event with the start and end of each http call
        $httpProvider.interceptors.push(function($rootScope, $q) {
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
                    $rootScope.$broadcast('loading:hide');
                    //TODO: toast a message
                    return $q.reject(rejection);
                }
            };
        });
    }
    //register listeners to the http start and end events we configured above
]).run(['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({template: 'Loading...', noBackdrop: true}); //TODO: something nicer
    });
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide();
    });
}]);
