(function () {
    "use strict";

    angular
        .module("MinionCraft")
        .controller("ChooseLevelCtrl",
                     ["$scope", "$http", "$interval", ChooseLevelCtrl]);

    function ChooseLevelCtrl($scope, $http, $interval) {

      // Get player name 
      $http({
            method : "POST",
            url : "./functions/getProgress.php",
            data : { 'action': 'GetPlayerName'}
          })
        .then(function mySucces(response) {
            if (response.data == -1) {
              $scope.logIn = false;
            }
            else
            {
              $scope.logIn = true;
              $scope.playerName = response.data;
            }
          }, 
          function myError(response) {
            console.log(response);
        }); 

      // Get questions
      $http({
            method : "POST",
            url : "./functions/getQuestion.php",
            data : { 'action': 'GetLevels'}
          })
        .then(function mySucces(response) {
          $scope.levels = response.data;
          console.log( response.data);
          }, 
          function myError(response) {
            console.log(response);
        }); 

        $scope.theme1Filter = function(level)
        {
          return level.stage == 1;
        }
        $scope.theme2Filter = function(level)
        {
          return level.stage == 2;
        }
        $scope.theme3Filter = function(level)
        {
          return level.stage == 3;
        }
        $scope.theme4Filter = function(level)
        {
          return level.stage == 4;
        }

      $scope.Level = function(star, index)
      {
        console.log("star: " + star + "index: " + index);
        if (star != null) 
        {
          SetQuestionId(index);
        }
      }

      function SetQuestionId(index)
      {
        $http({
              method : "POST",
              url : "./functions/getQuestion.php",
              data : { 'action': 'SetQuestionId',
                       'questionId': index}
            })
          .then(function mySucces(response) {
            console.log( response.data);
            if (response.data == 1)
            {
              // go to game page
              window.location = "#/game";
            }
            else
            {
              console.log("questionId is not set");
            }
          }, 
          function myError(response) {
              console.log(response);
          }); 
      }
    }
}());
