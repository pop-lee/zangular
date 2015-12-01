/**
 *
 */
(function() {
  'use strict';

  angular.module("z.angular.viewstack",[])
    .directive( 'zViewstack', function () {
      return {
        restrict: 'A',
        scope:{
          viewIndex:"="
        },
        link: function(scope, element, attrs, ctrls) {
          var options = {
            keyboard:false,
            wrap:false,
            interval:false
          }
          element.carousel(options);

          scope.$watch("viewIndex",function(newValue) {
            element.carousel(newValue);
          });

          //scope.toPrev = function() {
          //  element.carousel('prev');
          //};
          //
          //scope.toNext = function() {
          //  element.carousel('next');
          //}
        }
      };
    })
  ;

}());
