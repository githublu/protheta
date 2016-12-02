//directive for define filter
//isolated scope
(function () {
    "use strict";
    angular
        .module("MinionCraft")
        .directive('backImg', [function () {
          return function(scope, element, attrs){
              var url = attrs.backImg;
              element.css({
                  'background-image': 'url(' + url +')',
                  'background-size' : 'cover'
              });
          };
    }]);
}());