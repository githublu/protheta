
<link rel="stylesheet" type="text/css" href="./app/me/me.css">
<div ng-controller="MeCtrl" class="me">
  <div class="list-group">
    <div class="list-group-item row nav nav-pills" style="margin-right: 0px;">


            <div class="form-group">
          <input type="text" class="form-control" placeholder="Search">
        </div>
        <!-- <p style="display:inline-block; margin: 0px;">Sort by most recent</p> -->
        <li role="presentation" class="dropdown"> 
          <a class="dropdown-toggle" id="drop6" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style="padding: 0px"> Order By {{userOrder}} 
          <span class="caret"></span> 
          </a> 
          <ul class="dropdown-menu  dropdown-menu-right" aria-labelledby="drop3"> 
            <li>
              <a ng-click="OrderApps('-lastUpdateTime')" ng-show="orderKey != '-lastUpdateTime'">Most Recent</a>
            </li> 
            <li>
              <a ng-click="OrderApps('name')" ng-show="orderKey != 'name'">Name</a>
            </li> 
            <li>
              <a ng-click="OrderApps('category')" ng-show="orderKey != 'category'">Category</a>
              </li> 
          </ul> 
        </li>
    </div>
  </div>
  <div ng-repeat="app in apps | orderBy : orderKey">
  <div class="list-group-item">
    <a href={{app.url}} style="width:65%; display: inline-block;">
      <span class="list-group-item-heading">{{app.name}}</span>
    </a>
    <div style="width:33%; display: inline-block;">
      <span class="glyphicon glyphicon-trash" style="float: right;" aria-hidden="true" ng-click="RemoveUserApp(app.name)"></span>
    <span class="list-group-item-text">{{app.cat}}</span>
    </div>

    
  </div>
  </div>
</div>

