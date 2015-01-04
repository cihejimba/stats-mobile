statracker.config([
    '$ionicConfigProvider',
    function ($ionicConfigProvider) {
        'use strict';

        //$ionicConfigProvider.templates.maxPrefetch(0);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-ios7-arrow-left');
    }
]);
