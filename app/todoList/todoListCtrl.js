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
        $scope.todo = {};
        $scope.todo = store.todo;
        $scope.todo.key = $scope.id;
		var title = $scope.todo.title;

        $scope.needsSave = false;
        $scope.apps = {};
        $scope.hasUserSystemApp = false;
        $scope.hasSystemApp = false;
        
        // get web apps for this todo
        GetWebApps();

        // Add user preferences
        $scope.upsertPreference = function (app)
        {
        	upsert(app);
        }

		$scope.status = '';
		$scope.changeFunction=function()
		{
			if (title != $scope.todo.title) {
				$scope.needsSave = true;
			}
			else
			{
				$scope.needsSave = false;
			}
		}

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}
			store.put(todo, todo.key)
				.then(function success() {}, function error() {
					todo.completed = !todo.completed;
				});
		};

		$scope.removeTodo = function (todo) {
			store.delete(todo);
			$('.modal-backdrop').remove();
			window.location = "#/todo";
		};

		$scope.editTodo = function (todo) {
			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function () {
			$scope.todo.title = $scope.todo.title.trim();

			if ($scope.todo.title === title) {
				return;
			}

			title = $scope.todo.title;
			GetWebApps();

			store.put($scope.todo, $scope.todo.key)
				.then(function success(){}, function error(){
						$scope.todo.title = title
					});

			$scope.changeFunction();
		};

		$('textarea').val($scope.todo.title);
		$('textarea').each(function () {
			  this.setAttribute('style', 'height:' + (this.scrollHeight+ 50) + 'px;overflow-y:hidden;');
			}).on('input', function () {
			  this.style.height = 'auto';
			  this.style.height = (this.scrollHeight) + 'px';
			});

		function GetWebApps()
		{
			ParseTag();
			// get web apps
	      	$http({
	            method : "POST",
	            url : "./functions/getWebApp.php",
	            data : { 'action': 'GetWebApp',
	        			 'tag': JSON.stringify($scope.todo.tag)}
	          })
	        .then(function mySucces(response) {
	        	console.log(response.data);
	        	parseApps(response.data);
	          }, 
	          function myError(response) {
	            console.log(response);
	        }); 
		}

		function ParseTag()
		{
			var tag = $scope.todo.title.split("#");
	        var newTitle = tag[0];
	        if ($scope.todo.title.charAt(0) != '#') 
	        {
	        	tag.splice(0, 1);
	        }
	        
	        $scope.todo.newTitle = newTitle;
	        $scope.todo.tag = tag;
		}

		async function parseApps(systemApps)
		{
			var userApps = await readAll();
			// Display userApps if they also exist in systemApps and sort by frequency
			// Many userApps, and few system apps
			var userSystemApps = [];
			for (var i = 0; i < systemApps.length; i++) {
				for (var j = 0; j < userApps.length; j++) {
					if (systemApps[i].name == userApps[j].name) {
						userSystemApps.push(userApps[j]);
						systemApps.splice(systemApps.indexOf(systemApps[i]), 1);
					}
				}
			}

			if (userSystemApps.length > 0) {
				$scope.hasUserSystemApp = true;
			}
			else
			{
				$scope.hasUserSystemApp = false;
			}

			if (systemApps.length > 0) {
				$scope.hasSystemApp = true;
			}
			else
			{
				$scope.hasSystemApp = false;
			}

        	$scope.apps = systemApps;
			$scope.userSystemApps = userSystemApps;
			$scope.$apply();
		}
	});