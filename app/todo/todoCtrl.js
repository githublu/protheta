/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('MinionCraft')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter, store) {
		'use strict';

		var todos = $scope.todos = [];// store.todos;
		//var todoKeys = store.todoKeys;
		for(var key in store.todoKeys)
		{
			var todo = JSON.parse(store.todoKeys[key]);
			todo.key = key;
			console.log(todo);
			todos.push(todo);
		}

		$scope.newTodo = '';
		$scope.editedTodo = null;
		$scope.status = '';

		console.log(todos);
		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
			$scope.cleatCompleteStyle = ($scope.completedCount > 0) ? "height:40px;" : "height:20px;" 
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		// $scope.$on('$routeChangeSuccess', function () {
		// 	var status = $scope.status = $routeParams.status || '';
		// 	$scope.statusFilter = (status === 'active') ?
		// 		{ completed: false } : (status === 'completed') ?
		// 		{ completed: true } : {};
		// });

		$scope.showFilter = function(data)
		{
			var status = $scope.status = data || '';
			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
		}

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;
			var newKey = guid();
			store.insert(newKey, newTodo)
				.then(function success() {
					$scope.newTodo = '';
				})
				.finally(function () {
					$scope.saving = false;
				});
		};

		// $scope.editTodo = function (todo) {
		// 	$scope.editedTodo = todo;
		// 	// Clone the original todo to restore it on demand.
		// 	$scope.originalTodo = angular.extend({}, todo);
		// };

		// $scope.saveEdits = function (todo, event) {
		// 	// Blur events are automatically triggered after the form submit event.
		// 	// This does some unfortunate logic handling to prevent saving twice.
		// 	if (event === 'blur' && $scope.saveEvent === 'submit') {
		// 		$scope.saveEvent = null;
		// 		return;
		// 	}

		// 	$scope.saveEvent = event;

		// 	if ($scope.reverted) {
		// 		// Todo edits were reverted-- don't save.
		// 		$scope.reverted = null;
		// 		return;
		// 	}

		// 	todo.title = todo.title.trim();

		// 	if (todo.title === $scope.originalTodo.title) {
		// 		$scope.editedTodo = null;
		// 		return;
		// 	}

		// 	store[todo.title ? 'put' : 'delete'](todo)
		// 		.then(function success() {}, function error() {
		// 			todo.title = $scope.originalTodo.title;
		// 		})
		// 		.finally(function () {
		// 			$scope.editedTodo = null;
		// 		});
		// };

		$scope.revertEdits = function (todo) {
			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {
			store.delete(todo);
		};

		$scope.saveTodo = function (todo) {
			store.put(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			store.put(todo, todo.key)
				.then(function success() {}, function error() {
					todo.completed = !todo.completed;
				});
		};

		$scope.clearCompletedTodos = function () {
			store.clearCompleted();
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});
		};

		$scope.goTodo = function (todo)
		{
			console.log(todo);
			window.location = "#/todoList?id=" + todo;
		}

		function guid() {
		  function s4() {
		    return Math.floor((1 + Math.random()) * 0x10000)
		      .toString(16)
		      .substring(1);
		  }
		  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		    s4() + '-' + s4() + s4() + s4();
		}
	});
