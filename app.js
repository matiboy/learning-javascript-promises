angular.module('SmashBoard', []).controller('TvController', function($scope, $http) {
  var now = Math.floor(new Date().getTime() / 1000);
  var url = 'http://redape.cloudapp.net/tvguidea/singleslot/'+now+'?channels=[1,159,63,64]&format=json&o=1'
  var ajaxPromise = $http.get(url);
  ajaxPromise.then(function weGotData(response) {
    $scope.channels = response.data.events;
  });
})
.controller('LocationController', function($scope, LocationService){
  LocationService.getGeolocation().then(function geolocationReceived(geoposition) {
    $scope.coordinates = geoposition.coords;
  });
}).factory('LocationService', function($q) {
  return {
    getGeolocation: function() {
      var getGeo = $q.defer();
      window.navigator.geolocation.getCurrentPosition(function(geo) {
        getGeo.resolve(geo);
      });
      return getGeo.promise;
    }
  };
});
document.addEventListener("DOMContentLoaded", function(event) {
  var charging = document.getElementById('charging');
  var level = document.getElementById('battery-level');

  navigator.getBattery().then(function(batteryManager) {
    console.log(batteryManager);
    charging.innerText = batteryManager.charging  ? 'Yes' : 'No';
    level.innerText = (batteryManager.level * 100)+'%';
    level.className = 'fa fa-battery-' + Math.round(batteryManager.level * 4);
  })
});
document.addEventListener("DOMContentLoaded", function(event) {
  var click = document.getElementById('click-me');
  var last = document.getElementById('last');
  click.addEventListener('mousedown', function() {
    var clicking = new Promise(function executor(resolve, reject) {
      var start = new Date();
      click.onmouseout = reject;

      click.onmouseup = function() {
        console.debug('Mouse out');
        resolve(new Date() - start);
      }
    });

    clicking.then(function(duration) {
      last.innerText = (duration/1000) + ' seconds';
    }, function(message) {
      window.alert('Challenge incomplete');
    })
  })
});
document.addEventListener("DOMContentLoaded", function(event) {
  var input = document.getElementById('say-what');
  var output = document.getElementById('status');
  input.addEventListener('blur', function() {
    console.debug('Exited input');
    var speaking = new Promise(function executor(success, failure) {
      // var duration = Math.random() * 10000;
      // setTimeout(function() {
      //   success({
      //     elapsedTime: duration
      //   });
      // }, duration);
      var msg = new SpeechSynthesisUtterance(input.value);
      msg.onend = success;
      speechSynthesis.speak(msg);
    });
    output.innerText = 'Speaking';
    speaking.then(function(event) {
      console.debug(event);
      output.innerText = 'Speech completed in '+event.elapsedTime/1000+ ' seconds';
    });
  });
});
