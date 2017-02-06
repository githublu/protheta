(function () {
    "use strict";

  var app = angular.module('MinionCraft', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ui.bootstrap']);

  app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }]);

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
    // .when("/feature", {
    //     templateUrl  : 'app/feature/feature.php'
    // })
    .when("/category", {
      controller: 'CategoryCtrl',
      templateUrl  : 'app/category/category.php',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.getAll(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    })
    .when("/me", {
      controller: 'MeCtrl',
      templateUrl: 'app/me/me.php',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.getAll(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    })
    .when("/trending", {
        templateUrl  : 'app/trending/trending.php'
    })
    .when("/setting", {
        templateUrl  : 'app/setting/setting.php'
    })
    .when("/test", {
        templateUrl  : 'test.php'
    })
    .when("/todo", {
      controller: 'TodoCtrl',
      templateUrl: 'app/todo/todo.html',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.getAll(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    })
    .when("/todoList", {
      controller: 'TodoListCtrl',
      templateUrl: 'app/todoList/todoList.html',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            //module.getAll(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    })
    .otherwise({
        redirectTo  : '/start'
    });
  });

}());