var app = angular.module('app', ['ngFileUpload']);

app.controller('ApplicationCtrl', function ($scope, $http, $window, Upload) {
  $scope.getStatus = function () {
    $http.get('/api/status').then(function (res) {
      $scope.status = res.data;
    });
  };

  $scope.play = function(id) {
    $http.get('/api/play/'+id).then(function(res) {
      $scope.status = res.data;
    });
  };

  $scope.pause = function () {
    //state: stop, play, pause
    if ($scope.status.state === 'stop') {
      $http.get('/api/play').then(function (res) {
        $scope.status = res.data;
      });
    } else {
      var arg = $scope.status.state == 'play' ? 1 : 0;

      $http.get('/api/pause/' + arg).then(function (res) {
        $scope.status = res.data;
      });
    };
  };

  $scope.previous = function () {
    $http.get('/api/prev').then(function (res) {
      $scope.status = res.data;
    });
  };

  $scope.next = function () {
    $http.get('/api/next').then(function (res) {
      $scope.status = res.data;
    });
  };

  $scope.clear = function () {
    $http.get('/api/plclear').then(function (res) {
      $scope.songs = null;
      $scope.status = res.data;
    });
  };

  $scope.addall = function () {
    $http.get('/api/pladdall').then(function (res) {
      //$scope.songs = res.data;
      $scope.getStatus();
    });
  };

  $scope.getFileName = function (file) {
    if (!file)
      return;
    var split = file.split('/');
    return split[split.length - 1];
  };

  $scope.shuffle = function () {
    $http.get('/api/plshuffle').then(function (res) {
      $scope.status = res.data;
    });
    //$scope.getPlaylist();
  };

  $scope.getPlaylist = function () {
    $http.get('/api/plsongs').then(function (res) {
      $scope.songs = res.data;
    });
  };

  $scope.getStatus();
  $scope.getPlaylist();

  // WebSocket

  var wsUrl = 'ws://' + window.location.host;
  var ws = new WebSocket(wsUrl);
  ws.onopen = function() {
    console.log('WebSocket ' + wsUrl + ' connected');
  };
  ws.onclose = function() {
    console.log('WebSocket ' + wsUrl + ' disconnected');
  };
  ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    if ('event' in data) {
      switch (data.event) {
        case 'status':
          $scope.getStatus();
          break;
        case 'playlist':
          $scope.getPlaylist();
          $scope.getStatus();
          break;
      }
    }
  };

  // Upload

  $scope.uploadFiles = function(file, invalidFiles) {
    if (!file) return;
    Upload.upload({
      url: '/api/upload',
      data: {file: file}
    }).then(function(res) {
      $scope.uploadProgress = null;
      $window.alert('Successfully uploaded new song.');
    }, function(err) {
      $scope.uploadProgress = null;
      $window.alert('An error occured during upload.');
    }, function(evt) {
      $scope.uploadProgress = evt.loaded / evt.total;
    });
  };
});

app.filter('percentage', function() {
  return function(val) {
    return angular.isNumber(val) ? Math.round(val * 100) : val;
  };
});

app.controller('ProgressBarCtrl', function($scope, $interval) {
  var interval = null;

  function startInterval() {
    if (interval) return;
    interval = $interval(function() {
      $scope.elapsed += 1;
    }, 1000);
  }

  function stopInterval() {
    if (!interval) return;
    $interval.cancel(interval);
    interval = null;
  }

  $scope.$watch('status', function() {
    if (!$scope.status) return;
    $scope.state = $scope.status.state;
    if ($scope.state == 'stop') {
      $scope.duration = null;
      $scope.elapsed = null;
    } else {
      var time = $scope.status.time; // Format: elapsed:duration
      $scope.duration = Number(time.substring(time.lastIndexOf(':') + 1));
      $scope.elapsed = Number($scope.status.elapsed); // More accurate than above one
      if ($scope.state == 'play')
        startInterval();
      else
        stopInterval();
    }
  });

  $scope.calculateProgress = function() {
    return $scope.elapsed / $scope.duration * 100 + '%';
  };
});
