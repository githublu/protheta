(function () {
    "use strict";

  var app = angular.module('MinionCraft',['ngSanitize', 'ngRoute']);

  app.config(function($routeProvider) {
     $routeProvider
      .when("/game", {
          templateUrl  : 'app/game/game.php'
      })
      .when("/start", {
          templateUrl  : 'app/start/start.php'
      })
      .when("/chooseLevel", {
          templateUrl  : 'app/chooseLevel/chooselevel.php'
      })
      .otherwise({
          redirectTo  : '/start'
      });
  });

}());