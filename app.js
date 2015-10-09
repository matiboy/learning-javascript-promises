angular.module('SmashBoard', []).controller('TvController', function($scope, $http) {
  var now = Math.floor(new Date().getTime() / 1000);
  var url = 'http://redape.cloudapp.net/tvguidea/singleslot/'+now+'?channels=[1,159,63,64]&format=json&o=1'
  var ajaxPromise = $http.get(url);
  ajaxPromise.then(function weGotData(response) {
    $scope.channels = response.data.events;
  });
}).controller('LocationController', function($scope, LocationService) {
  LocationService.getGeolocation().then(function(geoposition) {
    $scope.coordinates = geoposition.coords;
  });
}).factory('LocationService', function($q) {
  return {
    getGeolocation: function() {
      var getGeo = $q.defer();
      window.navigator.geolocation.getCurrentPosition(function(geo){
        getGeo.resolve(geo);
      });

      return getGeo.promise;
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('say-what');
  var output = document.getElementById('status');
  input.addEventListener('blur', function(){
    console.debug('Exited input');
    var speaking = new Promise(function executor(success, failure){
      var duration = Math.random()*10000;
      setTimeout(function(){
        success({
          elapsedTime: duration
        });
      }, duration);
    });
  });
});









