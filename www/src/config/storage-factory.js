statracker.factory('localStore', ['store', function(store) {
    return store.getNamespacedStore('stk');
}]);
