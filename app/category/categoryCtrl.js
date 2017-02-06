/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('MinionCraft')
	.controller('CategoryCtrl', function TodoListCtrl($scope, $routeParams, $filter, $http, store) {
		'use strict';
  		
  		$scope.isCollapsed = false;
  		//$scope.cats = [];

  		// get the category from db
    	$http({
          method : "POST",
          url : "./functions/getWebApp.php",
          data : { 'action': 'GetWebAppForCategory'}
        })
      .then(function mySucces(response) {
      	console.log(response.data);
      	$scope.cats = response.data;
        }, 
        function myError(response) {
          console.log(response);
      }); 
        
  		// register user click
      $scope.upsertPreference = function (app)
      {
        store.addUserPreferences(app.name, app)
          .then(function success(){}, function error(){
          });
      }


	});