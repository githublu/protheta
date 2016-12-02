<div ng-controller="ChooseLevelCtrl" class="chooseLevel">
<nav-bar></nav-bar>

	<div class = "container">
		<p class="title">Select level to play</p>
		<div class="row">
			<div class="theme1 theme">
			</div>		
			<div class="scrollrow">
				<div class="card"  ng-repeat="level in levels | filter: theme1Filter track by $index" ng-click="Level(level.star, $index+1)">
					<div class="levelText">{{level.prefix}}{{level.question_id}}</div>
					<div class="stars s{{level.star}}"></div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="theme2 theme">
			</div>
			<div class="scrollrow">
				<div class="card"  ng-repeat="level in levels | filter: theme2Filter track by $index" ng-click="Level(level.star, $index+4)">
					<div class="levelText">{{level.prefix}}{{level.question_id}}</div>
					<div class="stars s{{level.star}}"></div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="theme3 theme">
			</div>
			<div class="scrollrow">
				<div class="card"  ng-repeat="level in levels | filter: theme3Filter track by $index" ng-click="Level(level.star, $index+6)">
					<div class="levelText">{{level.prefix}}{{level.question_id}}</div>
					<div class="stars s{{level.star}}"></div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="theme4 theme">
			</div>
			<div class="scrollrow">
				<div class="card"  ng-repeat="level in levels | filter: theme4Filter track by $index" ng-click="Level(level.star, $index+8)">
					<div class="levelText">{{level.prefix}}{{level.question_id}}</div>
					<div class="stars s{{level.star}}"></div>
				</div>
			</div>
		</div>
	</div>
</div>