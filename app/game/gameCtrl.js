(function () {
    "use strict";

    angular
        .module("MinionCraft")
        .controller("GameCtrl",
                     ["$scope", "$http", "$interval", GameCtrl]);

    function GameCtrl($scope, $http, $interval) {
      $scope.timeout = 5000;
      $scope.numCorrect = 0;
      $scope.time = 5;
      $scope.showBox = false;
      $scope.correctAnsPath = '';
      $scope.clearCount = 0;
      $scope.nextStage = false;
      $scope.logIn = false;
      $scope.currentLevel = 1;
      $scope.leaders = [];
      $scope.showLeaderBoard = false;
      $scope.showHideLeaders = "Show Leader Board";
      $scope.gameIsFinished = false;

      var gameTimer = null;
      var stop;
      var stageCounter = 0;
      var star = 0;
      var secondStar = 0;
      var thirdStar = 0;
      
      // get player name
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

      Start(false);
      
      $scope.Start = function (nextStage)
      {
        Start(nextStage);
        if(nextStage)
        {
          $scope.nextStage = false;
          stageCounter = 0;
        }
        
        $scope.numCorrect = 0;
      }

      $scope.Choose = function (choice)
      {
        if(!$scope.gameIsFinished)
        {
          if(choice == $scope.correctAns)
          {
            $scope.numCorrect++;
            
            $scope.time = DifficultyBalancer(stageCounter);

            stageCounter++;
            if(stageCounter >= $scope.clearCount)
            {

              // show if want to go to next stage or keep playing
              console.log("Stage passed");
              $scope.nextStage = true;
              star = 1;
            }

            if ($scope.numCorrect >= secondStar && star < 2) 
            {
              star = 2;
            }

            if ($scope.numCorrect >= thirdStar && star < 3) 
            {
              star = 3;
            }

            Start(false);
          }
          else
          {
            $scope.StopTimer();

          }
        }
        else
        {
          Stop();
        }
      }

      $scope.StopTimer = function()
      {
        Stop();
        if(!$scope.gameIsFinished)
        {
          $scope.time = 0;
          $scope.showBox = true;
          $scope.gameIsFinished = true;
        }

        console.log("star: " + star);

        $http({
          method : "POST",
          url : "./functions/getQuestion.php",
          data : { 'action': 'UpdateUserProgress',
                   'nextStage' : $scope.nextStage,
                   'star' : star}
          })
        .then(function mySucces(response) {
          console.log(response.data);
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

      $scope.HideShowBox = function()
      {
        $scope.showBox = false;
      }

      // $scope.Reset = function()
      // {
      //   $http({
      //       method : "POST",
      //       url : "./functions/logIn.php",
      //       data : { 'action': 'Reset'}
      //     })
      //   .then(function mySucces(response) {
      //       console.log("session is destroied");
      //       window.location = "#/start";
      //     }, 
      //     function myError(response) {
      //       console.log(response);
      //   }); 
      // }

      $scope.ShowLeaderBoard = function()
      {
        if(!$scope.showLeaderBoard)
        {
          $http({
              method : "POST",
              url : "./functions/getProgress.php",
              data : { 'action': 'ShowLeaderBoard'}
            })
          .then(function mySucces(response) {
              $scope.leaders = response.data;
            }, 
            function myError(response) {
              console.log(response);
          }); 
          $scope.showLeaderBoard = true;
          $scope.showHideLeaders = "Hide Leader Board";
        }
        else
        {
          $scope.showLeaderBoard = false;
          $scope.showHideLeaders = "Show Leader Board";
        }
      }

      // $scope.ChooseLevel = function()
      // {
      //   Stop();
      //   window.location = "#/chooseLevel";
      // }

    // helper functions ****************************************************
      function Start(next)
      {
        $scope.time = 5;
        $scope.showBox = false;
        if (next) 
        {
          star = 0;
        }

        if (angular.isDefined(stop))
        {
          Stop();
        }

        $scope.gameIsFinished = false;
        console.log("nextStage: " + next);
        $http({
              method : "POST",
              url : "./functions/getQuestion.php",
              data : { 'action': 'GetQuestion',
                      'nextStage' : next,
                      'star' : star}
            })
          .then(function mySucces(response) {
              console.log(response.data);
              if (response.data.userId != -1)
              {
                $scope.logIn = true;
              }

              $scope.clearCount = response.data.clearCount;
              secondStar = response.data.secondStar;
              thirdStar = response.data.thirdStar;
              $scope.currentLevel = response.data.question_id;

              // set up question
              var isChar1 = 0;
              angular.forEach(response.data.question, function(value, key) {
                if (isChar1 == 0)
                {
                  $scope.Question1 = "background-image:url("+value+")";
                }
                else
                {
                  $scope.Question2 = "background-image:url("+value+")";
                }

                isChar1 = 1;
              });

              $scope.answers = [];

              // set up answers
              angular.forEach(response.data.optionSet, function(value, key) {
                $scope.answers[key] = "background-image:url("+value+")";
              });

              $scope.correctAns = response.data.answer;
              $scope.correctAnsPath = "background-image:url("+response.data.answerPath+")";
            }, 
            function myError(response) {
              console.log(response);
          }); 

          //$interval start
          stop = $interval(function() {
            if ($scope.time > 0) {
              $scope.time = $scope.time - 1;
            }
          }, 1000);
        }

        // $scope.SaveProgress = function()
        // {
        //   $scope.StopTimer();

        //   if($scope.logIn)
        //   {
        //     // show saved
        //     $scope.saved = "Your progress has been saved!";
        //   }
        //   else
        //   {
        //     // pop sign up/lognin page 
        //     $('#LogInModal').modal('toggle');
        //   }
        // }

        function DifficultyBalancer (stageCounter)
        {
          if(stageCounter < 8)
          {
            return 5;
          }
          else if (stageCounter < 16) 
          {
            return 4;
          }
          else if(stageCounter < 32)
          {
            return 3;
          }
          else if(stageCounter < 64)
          {
            return 2;
          }
          else
          {
            return 0;
          }
        }
      }
}());
