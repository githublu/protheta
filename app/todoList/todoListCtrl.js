/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('MinionCraft')
	.controller('TodoListCtrl', function TodoListCtrl($scope, $routeParams, $filter, $location, $http, store) {
		'use strict';

		var params = $location.search();
        $scope.id = params.id;

        store.get($scope.id);
        var todo = {};
        todo = store.todo;
        todo.key = $scope.id;
		todo.title = todo.title;
		
        var tag = todo.title.split("#");
        var newTitle = tag[0];
        if (todo.title.charAt(0) != '#') 
        {
        	tag.splice(0, 1);
        }
        
        todo.newTitle = newTitle;
        todo.tag = tag;
        $scope.todo = todo;

        // get player name
      	$http({
            method : "POST",
            url : "./functions/getWebApp.php",
            data : { 'action': 'GetWebApp',
        			 'tag': JSON.stringify(todo.tag)}
          })
        .then(function mySucces(response) {
        	console.log(response.data);
          }, 
          function myError(response) {
            console.log(response);
        }); 

		$scope.status = '';

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			store.put(todo, todo.key)
				.then(function success() {}, function error() {
					todo.completed = !todo.completed;
				});
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === $scope.originalTodo.title) {
				$scope.editedTodo = null;
				return;
			}

			store[todo.title ? 'put' : 'delete'](todo)
				.then(function success() {}, function error() {
					todo.title = $scope.originalTodo.title;
				})
				.finally(function () {
					$scope.editedTodo = null;
				});
		};
	});
