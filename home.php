<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Game1</title>

    <!-- Style sheets -->
<link rel="stylesheet" type="text/css" href="./app/game/gameStyle.css">
<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="./app/start/startStyle.css">
<link rel="stylesheet" type="text/css" href="./app/chooseLevel/chooseLevelStyle.css">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

</head>

<body ng-app="MinionCraft" class="gameBody">
    <div ng-view></div>
	     <!-- <div ng-include="'app/game.php'"></div> -->

    <!-- Library Scripts -->
    <script src="js/jquery-1.11.3.min.js"></script>
    <script src="js/angular.js"></script>
    <script src="js/angular-sanitize.js"></script>
    <script src="js/angular-resource.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/angular-route.js"></script>
    <!-- Application Script -->
    <script src="app/app.js"></script>
    <!-- Controllers -->
    <script src="app/game/gameCtrl.js"></script>
    <script src="app/start/startCtrl.js"></script>
    <script src="app/chooseLevel/chooseLevelCtrl.js"></script>
    <!-- Controllers -->
    <script src="app/directives/LogInCtrl.js"></script>
    <script src="app/directives/NavBarCtrl.js"></script>
    <script src="app/todo/todoCtrl.js"></script>
    <script src="app/todo/todoStorage.js"></script>
    <script src="app/todoList/todoListCtrl.js"></script>
</body>

</html>