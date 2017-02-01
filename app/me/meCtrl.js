/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('MinionCraft')
	.controller('MeCtrl', function TodoListCtrl($scope, $routeParams, $filter, $http) {
		'use strict';
		$scope.apps = [];
		$scope.order = [];
		$scope.orderKey = '-lastUpdateTime';
		$scope.order['-lastUpdateTime'] = "Most Recent";
		$scope.order['name'] = "Name";
		$scope.order['category'] = "Category";
		$scope.userOrder = $scope.order[$scope.orderKey];
		
		//var init = await init();
		GetApps();

		$scope.RemoveUserApp = async function (name)
		{
			await remove(name);
			GetApps();
		}

		async function GetApps()
		{
			$scope.apps = await readAll();
			$scope.$apply();
			console.log($scope.apps);
		}

		$scope.OrderApps = function (orderKey)
		{
			$scope.orderKey = orderKey;
			$scope.userOrder = $scope.order[$scope.orderKey];
		}

	});