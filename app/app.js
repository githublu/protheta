(function () {
    "use strict";

  var app = angular.module('MinionCraft',['ngSanitize', 'ngRoute']);

  app.config(function($routeProvider) {
    var routeConfig = {
      controller: 'TodoCtrl',
      templateUrl: 'app/todo/todo.html',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.get(); // Fetch the todo records in the background.
            return module;
          });
        }
      }
    };

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
    .when("/feature", {
        templateUrl  : 'app/feature/feature.php'
    })
    .when("/category", {
        templateUrl  : 'app/category/category.php'
    })
    .when("/me", {
        templateUrl  : 'app/me/me.php'
    })
    .when("/trending", {
        templateUrl  : 'app/trending/trending.php'
    })
    .when("/setting", {
        templateUrl  : 'app/setting/setting.php'
    })
    .when("/todo", {
      controller: 'TodoCtrl',
      templateUrl: 'app/todo/todo.html',
      resolve: {
        store: function (todoStorage) {
          // Get the correct module (API or localStorage).
          return todoStorage.then(function (module) {
            module.get(); // Fetch the todo records in the background.
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
            module.getAll(); // Fetch the todo records in the background.
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