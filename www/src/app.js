// StaTracker Mobile App
'use strict';

angular.module('constants', [])
    .constant('apiUrl', '@@apiUrl')
    .constant('tokenUrl', '@@tokenUrl')
    .constant('clientId', '@@clientId');

var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages', 'ngCordova', 'nvd3', 'constants']);