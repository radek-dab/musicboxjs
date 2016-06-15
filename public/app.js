var app = angular.module('app', ['ngFileUpload']);

app.controller('ApplicationCtrl', function ($scope, $http, $window, Upload) {
  $scope.getStatus = function () {
    $http.get('/api/status').then(function (res) {
      $scope.status = res.data;
    });
  };

  $scope.play = function(id) {
    $http.get('/api/play/'+id).then(function(res) {
      //$scope.status = res.data;
    });
  };

  $scope.pause = function () {
    //state: stop, play, pause
    if ($scope.status.state === 'stop') {
      $http.get('/api/play').then(function (res) {
        //$scope.status = res.data;
      });
    } else {
      var arg = $scope.status.state == 'play' ? 1 : 0;

      $http.get('/api/pause/' + arg).then(function (res) {
        //$scope.status = res.data;
      });
    };
  };

  $scope.previous = function () {
    $http.get('/api/prev').then(function (res) {
      //$scope.status = res.data;
    });
  };

  $scope.next = function () {
    $http.get('/api/next').then(function (res) {
     // $scope.status = res.data;
    });
  };

  $scope.clear = function () {
    $http.get('/api/plclear').then(function (res) {
      $scope.songs = null;
      //$scope.status = res.data;
    });
  };

  $scope.addall = function () {
    $http.get('/api/pladdall').then(function (res) {
      //$scope.songs = res.data;
      //$scope.getStatus();
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
      //$scope.status = res.data;
    });
    //$scope.getPlaylist();
  };

  $scope.getPlaylist = function () {
    $http.get('/api/plsongs').then(function (res) {
      if (res.data.length >= 1 && 'file' in res.data[0])
        $scope.songs = res.data;
      else
        $scope.songs = null;
    });
  };

  $scope.getStatus();
  $scope.getPlaylist();

  // Events

  $scope.$on('status', function(event, data) {
    $scope.$apply(function() {
      $scope.status = data;
    });
  });

  $scope.$on('playlist', function(event, data) {
    $scope.$apply(function() {
      $scope.songs = data;
    });
  });

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

app.run(function($rootScope, $timeout) {
  (function connect() {
    var wsUrl = 'ws://' + window.location.host;
    var ws = new WebSocket(wsUrl);

    ws.onopen = function() {
      console.log('WebSocket ' + wsUrl + ' connected.');
    };

    ws.onclose = function() {
      console.log('WebSocket ' + wsUrl + ' disconnected.',
                  'Reconnect in 10 seconds.');
      $timeout(connect, 10000);
    };

    ws.onmessage = function(msg) {
      var data = JSON.parse(msg.data);
      $rootScope.$broadcast(data.event, data.data);
    };
  })();
});

app.filter('percentage', function() {
  return function(val) {
    return angular.isNumber(val) ? Math.round(val * 100) : val;
  };
});
