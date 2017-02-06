<!doctype html>
<html ng-app="ui.bootstrap.demo">
  <head>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-sanitize.js"></script>
    <script src="//angular-ui.github.io/bootstrap/ui-bootstrap-tpls-2.5.0.js"></script>
    <script src="testCtrl.js"></script>
    <link href="//netdna.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>

<style>
  .horizontal-collapse {
    height: 70px;
  }
  .navbar-collapse.in {
    overflow-y: hidden;
  }
</style>
<div ng-controller="CollapseDemoCtrl">
	<p>Resize window to less than 768 pixels to display mobile menu toggle button.</p>
	<nav class="navbar navbar-default" role="navigation">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" ng-click="isNavCollapsed = !isNavCollapsed">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">A menu</a>
		</div>
		<div class="collapse navbar-collapse" uib-collapse="isNavCollapsed">
			<ul class="nav navbar-nav">
				<li><a href="#">Link 1</a></li>
				<li><a href="#">Link 2</a></li>
			</ul>
		</div>
	</nav>
	<hr>
	<button type="button" class="btn btn-default" ng-click="isCollapsed = !isCollapsed">Toggle collapse Vertically</button>
	<hr>
	<div uib-collapse="isCollapsed">
		<div class="well well-lg">Some content</div>
	</div>

	<button type="button" class="btn btn-default" ng-click="isCollapsedHorizontal = !isCollapsedHorizontal">Toggle collapse Horizontally</button>
	<hr>
	<div class="horizontal-collapse" uib-collapse="isCollapsedHorizontal" horizontal>
		<div class="well well-lg">Some content</div>
	</div>
</div>
  </body>
</html>
