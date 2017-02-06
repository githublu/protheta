/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('MinionCraft')
	.controller('MeCtrl', function MeCtrl($scope, $routeParams, $filter, $http, store) {
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

		$scope.RemoveUserApp = function (name)
		{
			store.deleteApp(name);
			GetApps();
		}

		function GetApps()
		{
			$scope.apps = [];
			store.getAllApps()
			.then(function success(data){
				for(var key in data)
				{
					$scope.apps.push(JSON.parse(data[key]));
				}
			},function error(){
			});

			console.log($scope.apps);
		}

		$scope.OrderApps = function (orderKey)
		{
			$scope.orderKey = orderKey;
			$scope.userOrder = $scope.order[$scope.orderKey];
		}
	});