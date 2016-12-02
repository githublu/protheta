//directive for log in
    angular
        .module("MinionCraft")
        .directive('navBar', ["$http", "$interval", function ($http, $interval) {
    return {
        restrict: 'E',
        scope: false,
        link: function ($scope, element, attrs) {
          $scope.ChooseLevel = function()
          {
            Stop();
            window.location = "#/chooseLevel";
          }

          $scope.StartNewGame = function() 
          {
            window.location = "#/game";
            $scope.Start();
          }

          $scope.SaveProgress = function()
          {
            $scope.StopTimer();

            if($scope.logIn)
            {
              // show saved
              $scope.saved = "Your progress has been saved!";
            }
            else
            {
              // pop sign up/lognin page 
              $('#LogInModal').modal('toggle');
            }
          }

          $scope.Reset = function()
          {
            $http({
                method : "POST",
                url : "./functions/logIn.php",
                data : { 'action': 'Reset'}
              })
            .then(function mySucces(response) {
                console.log("session is destroied");
                window.location = "#/start";
              }, 
              function myError(response) {
                console.log(response);
            }); 
          }

          function Stop()
          {
            if (angular.isDefined(stop)) {
              $interval.cancel(stop);
              stop = undefined;
            }
          }
        },

        templateUrl: '/app/directives/NavBarTemplate.html'
    };
}]);