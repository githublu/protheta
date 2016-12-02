//directive for log in
    angular
        .module("MinionCraft")
        .directive('logIn', ["$http", "$interval", function ($http, $interval) {
    return {
        restrict: 'E',
        scope: false,
        link: function ($scope, element, attrs) {
        $scope.ShowLogInTab = true;
        $scope.signUpError = false;
        $scope.logInError = false;
        $scope.LogIn = function(name, password)
            {
                if (name === undefined || name === null)
                {
                    name = "";
                }
                if (password === undefined || password === null)
                {
                    console.log("null");
                    password = "";
                }
                $http({
                    method : "POST",
                    url : "../functions/logIn.php",
                    data : { 'action': 'LogIn',
                             'name': name,
                             'password': password}
                    })
                    .then(function mySucces(response) {
                        console.log(response.data);
                        $scope.login = response.data;
                        if (response.data.StatusCode == 2) {
                            $http({
                              method : "POST",
                              url : "./functions/getProgress.php",
                              data : { 'action': 'SaveProgress'}
                            })
                          .then(function mySucces(response) {
                            $scope.saved = "Your progress has been saved!";
                          }, 
                            function myError(response) {
                          });
                          
                          // get player name
                          GetPlayerName();
                          
                          window.location = "#/game";
                          $('#LogInModal').modal('toggle');
                        }
                        else
                        {
                          $scope.logInError=true;
                          $scope.name = "";
                          $scope.password = "";
                          $scope.logInMessage = response.data.msg;
                        }
                    }, 
                    function myError(response) {
                        console.log(response);
                }); 
            }

          $scope.SignUp = function(name, email, password)
          {
            $scope.signUpError = false;
            if (name === undefined || name === null)
            {
                name = "";
            }
            if (email === undefined || email === null)
            {
                email = "";
            }
            if (password === undefined || password === null)
            {
                password = "";
            }
            $http({
                method : "POST",
                url : "functions/logIn.php",
                data : { 'action': 'SignUp',
                         'name': name,
                         'email': email,
                         'password': password}
            })
            .then(function mySucces(response) {
                console.log(response.data);
                if (response.data.StatusCode == 2) {
                    $http({
                      method : "POST",
                      url : "functions/getProgress.php",
                      data : { 'action': 'SaveProgress'}
                    })
                  .then(function mySucces(response) {
                    $scope.saved = "Your progress has already been saved!";
                  }, 
                    function myError(response) {
                  });

                  GetPlayerName();
                  window.location = "#/game";
                  $('#LogInModal').modal('toggle');
                }
                else
                {
                  $scope.signUpError = true;
                  $scope.name = "";
                  $scope.password = "";
                  $scope.email = "";
                  $scope.signUpMsg = response.data.msg;
                }
            }, 
            function myError(response) {
              console.log("errr");
                console.log(response);
            }); 
          }

          $scope.ShowLogIn = function()
          {
            $scope.ShowLogInTab = true;
          }

          $scope.ShowSignUp = function()
          {
            $scope.ShowLogInTab = false;
          }

          function GetPlayerName()
          {
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
          }
        },
        templateUrl: 'app/directives/LogInTemplate.html'
    };
}]);