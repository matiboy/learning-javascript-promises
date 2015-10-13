
var geolocationPromise;
function getGeolocation() {
  if(!geolocationPromise) {
    geolocationPromise = new Promise(function(resolve, reject){
      navigator.geolocation.getCurrentPosition(function(geo) {
        console.debug('Get geolocation received');
        resolve(geo);
      }, reject);
    });
  }
  return geolocationPromise;
}

angular.module('SmashBoard', []).controller('TvController', function($scope, $http) {
  var now = Math.floor(new Date().getTime() / 1000);
  var url = 'http://redape.cloudapp.net/tvguidea/singleslot/'+now+'?channels=[1,159,63,64]&format=json&o=1'
  var ajaxPromise = $http.get(url);
  ajaxPromise.then(function weGotData(response) {
    $scope.channels = response.data.events;
  });
})
.controller('WeatherForecastController', function($scope, $http, LocationService){
  /* URLs for the APIs:
  -> Google Geocode
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+geo.coords.latitude+','+geo.coords.longitude;
  -> AccuWeather city to id
  var url = 'http://apidev.accuweather.com/locations/v1/search?apikey=meSocYcloNe&q='+city
  -> AccuWeather id to forecast
  var url = 'http://apidev.accuweather.com/currentconditions/v1/'+result.Key+'.json?language=en&apikey=meSocYcloNe'
  */
})
.controller('LocationController', function($scope, LocationService){
  LocationService.getGeolocation().then(function geolocationReceived(geoposition) {
    $scope.coordinates = geoposition.coords;
    $scope.$digest();
  }).catch(function(){
    $scope.coordinates = {latitude: 'N/A', longitude: 'N/A'};
    $scope.$digest();
  });
}).factory('LocationService', function($q) {
  return {
    getGeolocation: function() {
      return getGeolocation();
    }
  };
});
document.addEventListener("DOMContentLoaded", function(event) {
  var address = document.getElementById('address');
  getGeolocation().then(function(geolocation){
    console.log('Using geolocation promise in location widget')
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
      +geolocation.coords.latitude + ','
      +geolocation.coords.longitude;

    var client = new XMLHttpRequest();
    client.onload = function() {
      address.innerText = JSON.parse(this.response).results[0].formatted_address;
    }
    client.open('GET', url);
    client.send();

  }).catch(function(){
    address.innerText = 'N/A';
  })
});
document.addEventListener("DOMContentLoaded", function(event) {
  var input = document.getElementById('city-input');
  var city = document.getElementById('city-name');
  var rejectFunction;
  input.addEventListener('keyup', function() {
    if(rejectFunction) {
      rejectFunction();
    }
    var myPromise = new Promise(function(resolve, reject){
      rejectFunction = reject;
      var start = new Date();
      getGeolocation().then(function(geolocation) {
        var client = new XMLHttpRequest();
        client.onload = function() {
          resolve([JSON.parse(this.response).results[0], new Date() - start]);
        }
        var coords = geolocation.coords;
        var bounds = (coords.latitude -0.1) + ',' + (coords.longitude -0.1) + '|' + (coords.latitude +0.1) + ',' + (coords.longitude +0.1);

        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
          +input.value+'&sensor=false'
          +'&bounds='+bounds;
        client.open('GET', url);
        client.send();
      })

    });

    myPromise.then(function(data) {
      var result = data[0];
      var duration = data[1];
      console.log(result, duration);
      console.debug('Call completed before key press');
      if(result) {
        city.innerText = result.formatted_address;
        document.getElementById('load-time').innerText = duration/1000 + 's';
      }
    })
  })
});
document.addEventListener("DOMContentLoaded", function(event) {
  var charging = document.getElementById('charging');
  var level = document.getElementById('battery-level');

  navigator.getBattery().then(function(batteryManager) {
    // console.log(batteryManager);
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
