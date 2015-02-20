// StaTracker Mobile App
'use strict';

angular.module('constants', [])
    .constant('apiUrl', 'https://localhost:44300/api/v1/')
    .constant('tokenUrl', 'https://localhost:44300/token')
    .constant('clientId', '73788e966f4c4c289a3a8f12f9aae744');

var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages', 'ngCordova', 'nvd3', 'constants']);