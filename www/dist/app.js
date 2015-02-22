// StaTracker Mobile App
'use strict';

angular.module('constants', [])
    .constant('apiUrl', 'https://statsapi.azurewebsites.net/api/v1/')
    .constant('tokenUrl', 'https://statsapi.azurewebsites.net/token')
    .constant('clientId', '73788e966f4c4c289a3a8f12f9aae744');

var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages', 'nvd3', 'constants']);