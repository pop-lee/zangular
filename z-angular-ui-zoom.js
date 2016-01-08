/**
 * Created by LiYunpeng on 1/8/16.
 */
(function() {
  'use strict';

  angular.module("z.angular.zoom",[])
    .directive('zZoom',['$timeout',function($timeout) {
      return {
        restrict:'A',
        scope: {
        },
        controller:function($scope) {

        },
        link: function(scope,element,attrs,controller){
          scope.currentTo = 1;
          scope.gap = 0.1;
          scope.delay = 400;

          $timeout(function() {
            scope.reallyWidth = element.width();
            scope.reallyHeight = element.height();
          })

          element.css('float','left');
          element.on('mousewheel',function(e) {

            //最终要缩放的值
            var zoomTo;

            if(e.originalEvent.wheelDelta /120 > 0) {
              //放大,拉滚轮

              //放大最多不超过原有尺寸
              if(scope.currentTo>=1) {
                return;
              }

              scope.currentTo = scope.currentTo + scope.gap;

              //鼠标滚轮期望值大于原有大小,则以原有大小为准
              if(scope.currentTo>1) {
                scope.currentTo = 1;
              }
              zoomTo = scope.currentTo;
            } else {
              //缩小,推滚轮
              var widthTo = 1;
              var heightTo = 1;
              if(element.width()>element.parent().width()) {
                widthTo = element.parent().width()/scope.reallyWidth;
              } else {
                widthTo = 1;
              }
              if(element.height()>element.parent().height()) {
                heightTo = element.parent().height()/reallyHeight;
              } else {
                heightTo = 1;
              }

              var minZoom = Math.min(widthTo,heightTo);
              if(scope.currentTo<minZoom) {
                return;
              } else {
                scope.currentTo = scope.currentTo - scope.gap;
              }

              zoomTo = Math.max(scope.currentTo,minZoom);
            }

            element.animate({'zoom':Math.floor(zoomTo*100)/100},scope.delay);
          });
        }
      };
    }])
}());
