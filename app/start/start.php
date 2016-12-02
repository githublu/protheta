<div ng-controller="StartCtrl" class="start">
    <div class = "container board">
	    <div class="tutorial line1">
	    	You will be given a set of 5 pictures with different colors and shapes.  Like this:
	    </div>
	    <div class="asset1">
	    </div>
	    <div class="tutorial line2">
	    	And for each round, you will be given anther two pictures that are in wrong color or wrong shape or a same picture above. 
	    	<br>
	    	<div class="bc"></div>
			Select the correct anwser from those five pictures. A correct anwser can be:
			<br>
			1. Color and shape match
	    </div>
	    <div class="asset2">
	    </div>
	    <div class="tutorial line3">
	    2. Neither color nor shape appears
	    </div>
	    <div class="asset3">
	    </div>

	    <div class="startbtn" ng-click="QuickStart()">
	    </div>

	    <div class="loginbtn" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#LogInModal">
	    </div>
	</div>
	<log-in />
</div>