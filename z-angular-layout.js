/**
 * Created by z on 11/1/15.
 */
(function() {
  'use strict';

  angular.module("z.angular.layout",[])
    .directive('zLayout',['$window',function($window) {
      return {
        restrict:'A',
        require:["?^zLayout"],
        scope: {
          zLayout:"@",
          zWidth:"@",
          zHeight:"@"
        },
        controller:function($scope) {
          $scope._childDisplay = [];
          $scope._childAbsoluteTotalWidth = 0;
          $scope._childAbsoluteTotalHeight = 0;

          /**
           * 由父级来运算，原因是要先筛选出绝对宽高，再计算百分比宽高
           */
          $scope.updateDisplay = function () {

            if(!$scope.getWidth) {
              return;//未完成初始化
            }

            var percent;
            if ($scope.zLayout === "horizontal") {
              $scope._childAbsoluteTotalWidth = 0;
              var width;
              var childScope;
              var zWidth;
              //遍历子元素,先查找定义宽度不为百分比的,即宽高定义为绝对像素值的元素,计算出占用的宽度,剩余的宽度再通过百分比进行计算
              for(var i = 0;i < $scope._childDisplay.length;i ++) {
                childScope = $scope._childDisplay[i];
                zWidth = childScope.zWidth;
                if (childScope.zWidth.indexOf("%") != -1) {//代表为百分比
                  continue;
                } else if (childScope.zWidth.indexOf("px") != -1) {
                  width = childScope.zWidth.substring(0, childScope.zWidth.indexOf("px"));
                } else {
                  width = childScope.zWidth;
                }
                width = parseInt(width)
                childScope.setWidth(Math.floor(width));
                childScope.updateDisplay();
                $scope._childAbsoluteTotalWidth += width;
              }

              for(var i = 0;i < $scope._childDisplay.length;i ++) {
                childScope = $scope._childDisplay[i];
                zWidth = childScope.zWidth;
                if (childScope.zWidth.indexOf("%") != -1) {//代表为百分比
                  percent = childScope.zWidth.substring(0, childScope.zWidth.indexOf("%"));
                  childScope.setWidth(Math.floor(($scope.getWidth()-$scope._childAbsoluteTotalWidth) * percent / 100));//剪掉绝对宽度后剩余的宽度，再剪掉滚动条的宽度
                  childScope.updateDisplay();
                }
              }
            } else if($scope.zLayout === "vertical") {
              $scope._childAbsoluteTotalHeight = 0;
              var height;
              var childScope;
              var zHeight;
              for(var i = 0;i < $scope._childDisplay.length;i ++) {
                childScope = $scope._childDisplay[i];
                zHeight = childScope.zHeight;
                if (childScope.zHeight.indexOf("%") != -1) {//代表为百分比
                  continue;
                } else if (childScope.zHeight.indexOf("px") != -1) {
                    height = childScope.zHeight.substring(0, childScope.zHeight.indexOf("px"));
                } else {
                  height = childScope.zHeight;
                }
                height = parseInt(height);
                childScope.setHeight(Math.floor(height));
                childScope.updateDisplay();
                $scope._childAbsoluteTotalHeight += height;
              }

              for(var i = 0;i < $scope._childDisplay.length;i ++) {
                childScope = $scope._childDisplay[i];
                zHeight = childScope.zHeight;
                if (childScope.zHeight.indexOf("%") != -1) {//代表为百分比
                  percent = childScope.zHeight.substring(0, childScope.zHeight.indexOf("%"));
                  childScope.setHeight(Math.floor(($scope.getHeight()-$scope._childAbsoluteTotalHeight) * percent / 100));
                  childScope.updateDisplay();
                }
              }
            }
          }

          this.addChild = function(childScope) {
            $scope._childDisplay.push(childScope);

            childScope.$watch('zWidth',function() {
              if($scope.zLayout === "horizontal") {
                $scope.updateDisplay();
              } else {
                childScope.setWidth(childScope.zWidth);
              }
            });

            childScope.$watch('zHeight',function() {
              if($scope.zLayout === "vertical") {
                $scope.updateDisplay();
              } else {
                childScope.setHeight(childScope.zHeight);
              }
            });
            $scope.updateDisplay();
          };
        },
        link: function(scope,element,attrs,controller){

          element.css('float','left');

          scope.getWidth = function() {
            return element.width();
          }
          scope.getHeight = function() {
            return element.height();
          }
          scope.setWidth = function(width) {
            //element.innerWidth(width);
            element.outerWidth(width);
          }
          scope.setHeight = function(height) {
            //element.innerHeight(height);
            element.outerHeight(height);
          }

          if(!scope.zWidth) {
            scope.setWidth("100%");
          }
          if(!scope.zHeight) {
            scope.setHeight("100%");
          }

          if(element.parent()) {
            if(element.parent().attr('z-layout')) {
              element.parent().controller( 'zLayout' ).addChild(scope);
            } else {
              //scope.setWidth(scope.zWidth);
              //scope.setHeight(scope.zHeight);
              var window = angular.element($window);
              window.on('resize',function() {
                scope.updateDisplay();
              });
            }
          }
        }
      };
    }])

    .directive('zFrameHeader',['$rootScope',function($rootScope) {
      return {
        restrict:'A',
        link: function(scope,element,attrs,controller){
          $rootScope.headerHeight = element.height();
        }
      };
    }])
    .directive('zFrameNav',['$window','$rootScope',function($window,$rootScope) {
      return {
        restrict:'A',
        link: function(scope,element,attrs,controller){
          var window = angular.element($window);
          window.on('resize',function () {
            scope.resize();
          });

          scope.resize = function() {
            if(!$rootScope.headerHeight) {
              $rootScope.headerHeight = 0;
            }
            element.height(window.height() - $rootScope.headerHeight);
          }

          scope.resize();

        }
      };
    }])
    .directive('zFrameContent',['$window','$rootScope',function($window,$rootScope) {
      return {
        restrict:'A',
        link: function(scope,element,attrs,controller){
          var window = angular.element($window);
          window.on('resize',function () {
            scope.resize();
          });

          scope.resize = function() {
            if(!$rootScope.headerHeight) {
              $rootScope.headerHeight = 0;
            }
            element.height(window.height() - $rootScope.headerHeight);
          }

          scope.resize();

        }
      };
    }])

  ;

}());
