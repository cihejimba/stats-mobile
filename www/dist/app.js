// StaTracker Mobile App
'use strict';

angular.module('constants', [])
    .constant('apiUrl', 'https://localhost:44300/')
    .constant('clientId', '73788e966f4c4c289a3a8f12f9aae744');

var statracker = angular.module('statracker', ['ionic', 'angular-storage', 'angular-jwt', 'ngMessages', 'constants']);