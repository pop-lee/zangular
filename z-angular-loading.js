/**
 * Created by z on 10/26/15.
 */
(function() {
  'use strict';

angular
  .module('z.angular.loading', [])

  .directive('zLoading',['$http','$compile','$timeout','$templateCache','$rootScope',function($http,$compile,$timeout,$templateCache,$rootScope) {
    return {
      restrict:'A',
      scope: {
        zLoading:'='
      },
      link: function(scope,element,attrs,controller){
        var hiddenTimer;

        if(!$rootScope.loadingModal) {
          var loadingHTML = $templateCache.get("template/zLoading/zLoading.html");

          var loadingModal = $compile(loadingHTML)(scope);
          $rootScope.loadingModal = loadingModal;
          loadingModal.appendTo(angular.element('body')).hide();
        }

        scope.$watch('zLoading',function(newValue,oldValue) {
          //if(newValue == oldValue) {
          //  return;
          //}
          if(newValue&&newValue.constructor == Boolean) {
            $timeout.cancel(hiddenTimer);
            $rootScope.loadingModal.show();
          } else {
            hiddenTimer = $timeout(function() {
              $rootScope.loadingModal.hide();
            }, 200);
          }

        });
      }
    };
  }]);
}());
