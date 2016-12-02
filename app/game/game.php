<div ng-controller="GameCtrl" class="game">
<nav-bar></nav-bar>
    <div class = "container board">
    	<div class="row">
    		<div class="score">
    			Score: {{numCorrect}}/{{clearCount}}
    		</div>
    		<div class="score">
    			Level: {{currentLevel}}
    		</div>
    		<div class="timer">
    			<p class="time">{{time === 0 && !gameIsFinished && StopTimer() || time}}</p>
    		</div>
    	</div>
	    <div class="row">
		  <div class="questionRow">
		  	<div class="backImg question" id="question" style={{Question1}}></div>
		  	<div class="backImg question" id="question" style={{Question2}}></div>
		  </div>
		</div>
		<div ng-repeat="ans in answers track by $index" class="ans">
		  		<div class="backImg option ans{{$index}}" style={{ans}} ng-click='Choose($index)'></div>
		</div>
<!-- 		<button type="submit" class="btn btn-primary" style="float: right; position: relative; margin-top: 30px;" ng-click='Start()' ng-hide="showBox">Start Game</button>
		<button type="submit" class="btn btn-primary" style="float: right; position: relative; margin-top: 30px;" ng-click='Reset()' ng-hide="showBox">Reset Game</button> -->
	</div>

	<!-- Modal -->
	<div class="modal showBox" id="showBox" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" ng-show="showBox" style="z-index: 1;">
	  <div class="modal-dialog" role="document" style="z-index: 0">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click='HideShowBox()'><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="myModalLabel">Game finished!</h4>
	      </div>
	      <div class="modal-body">
	        <h2 style="display: inline;">
	        	<h2 class="gameText">You scored {{numCorrect}}!</h2>
	        	<h2 class="gameText">the correct answer is:  		  	
		        	<div class="backImg option" style={{correctAnsPath}}>
			  		</div>
			  	</h2>
	        </h2>
	        <p>{{saved}}</p>
	        <div class="leaderBoard">
	        	<div class="showBoard" ng-click='ShowLeaderBoard()'>
	        		{{showHideLeaders}}
	        	</div>
	        	<div class="leaderBoard">
	        		<table class="table table-striped" ng-show='showLeaderBoard'> 
	        			<thead>
	        				<tr> <th>#</th> <th>First Name</th> <th>Highest Level</th></tr> 
	        			</thead> 
	        			<tbody> 
		        			<tr ng-repeat="leader in leaders track by $index"> 
		        				<th scope="row">{{$index+1}}</th> 
		        				<td>{{leader.name}}</td> 
		        				<td>{{leader.maxscore}}</td>
		        			</tr>
	        			 </tbody> 
	        		</table>
	        	</div>
	        </div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-primary" ng-click='SaveProgress()'>Save Progress</button>	      
	        <button type="button" class="btn btn-primary" ng-click='Start(false)'>Play again</button>
	        <button type="button" class="btn btn-success" ng-click='Start(true)' ng-show="nextStage">Next Level</button>
	      </div>
	    </div>
	  </div>
	</div>
<div class="startNewGame" ng-show="gameIsFinished && !showBox" ng-click='Start(false)'></div>
	<log-in />
</div>