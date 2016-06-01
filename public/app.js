var app = angular.module('app', [])
app.controller('ApplicationCtrl', function ($scope, $http) {
  $scope.getStatus = function () {
    $http.get('/api/status').then(function (res) {
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
      $scope.songs = res.data;
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
    $scope.getPlaylist();
  };

  $scope.getPlaylist = function () {
    $http.get('/api/plsongs').then(function (res) {
      $scope.songs = res.data;
    });
  };

  $scope.getStatus();
  $scope.getPlaylist();
});