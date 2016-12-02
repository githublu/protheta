(function () {
    "use strict";

    angular
        .module("MinionCraft")
        .controller("StartCtrl",
                     ["$scope", "$http", "$interval", StartCtrl]);

    function StartCtrl($scope, $http, $interval) {
      $scope.QuickStart = function()
      {
      	window.location = "#/game";
      }
    }
}());
