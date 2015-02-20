statracker.factory('toaster', [
    '$window',
    '$cordovaToast',
    '$q',
    function ($window, $cordovaToast, $q) {
        var isLive = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test($window.navigator.userAgent);
        return {
            toastSuccess: function (message) {
                var defer = $q.defer();
                if (isLive) {
                    defer.resolve($cordovaToast.show(message, 'short', 'center'));
                } else {
                    defer.resolve();
                }
                return defer.promise;
            },
            toastError: function (message) {
                var defer = $q.defer();
                console.error(message);
                if (isLive) {
                    defer.resolve($cordovaToast.show(message, 'short', 'center'));
                } else {
                    defer.resolve();
                }
                return defer.promise;
            }
        };
    }
]);