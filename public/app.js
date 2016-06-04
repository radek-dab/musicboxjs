var app = angular.module('app', ['ngFileUpload'])
app.controller('ApplicationCtrl', function ($scope, $http) {
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
  
  $scope.uploadFormVisible = false;
  $scope.showUploadForm = function() {
    $scope.uploadFormVisible = !$scope.uploadFormVisible;
  }

  $scope.getStatus();
  $scope.getPlaylist();

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
});
app.controller('FileUpload', ['Upload', '$window', function (Upload, $window) {
  var vm = this;
  vm.submit = function () { //function to call on form submit
    if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
      vm.upload(vm.file); //call upload function
    }
  }
    
  vm.upload = function (file) {
    Upload.upload({
      url: 'http://localhost:3000/api/upload', //webAPI exposed to upload the file
      data: { file: file } //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if (resp.data.error_code === 0) { //validate success
        $window.alert('Success ' + resp.config.data.file.name + ' uploaded.');
      } else {
        $window.alert('an error occured');
      }
    }, function (resp) { //catch error
      console.log('Error status: ' + resp.status);
      $window.alert('Error status: ' + resp.status);
    }, function (evt) {
      console.log(evt);
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('Progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      vm.progress = 'Progress: ' + progressPercentage + '% '; // capture upload progress
    });
  };
}]);
