statracker.factory('toaster', [
    '$window',
    '$ionicPopup',
    '$timeout',
    '$q',
    function ($window, $ionicPopup, $timeout, $q) {
        return {
            toastSuccess: function (message) {
                var defer = $q.defer();
                var popup = $ionicPopup.alert({
                    title: 'Success!',
                    template: message
                });
                popup.then(function(res) {
                    defer.resolve(message);
                });
                $timeout(function() {
                    popup.close();
                }, 1500);
                return defer.promise;
            },
            toastError: function (message) {
                var defer = $q.defer();
                var popup = $ionicPopup.alert({
                    title: 'Fail!',
                    template: message
                });
                popup.then(function(res) {
                    defer.resolve(message);
                });
                $timeout(function() {
                    popup.close();
                }, 3000);
                return defer.promise;
            }
        };
    }
]);