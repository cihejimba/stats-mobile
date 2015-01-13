// StaTracker Mobile App
'use strict';

angular.module('constants', [])
    .constant('apiUrl', '@@apiUrl')
    .constant('clientId', '@@clientId');

var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages', 'ngResource', 'constants']);