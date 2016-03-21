/**
 * 基于select2
 */
(function () {
  'use strict';

  angular
    .module('z.angular.select', [])

    .directive('zSelect', ['$templateCache','$compile',function ($templateCache,$compile) {
      return {
        restrict: 'A',
        //require:'ngModel',
        scope: {
          //multiple:'@'
        },
        link: function (scope, element, attrs, controller) {

          //scope.ngModel = "";

          var select2Option = {
            //placeholder: "Select a state"
            width: '100%',
            //allowClear: true,
            tags:false
          };

            if(attrs.minimumResultsForSearch) {
                select2Option.minimumResultsForSearch = attrs.minimumResultsForSearch;
            }

          if(element.is('select')) {
            element.select2(select2Option);
          } else {
            throw error("此指令需是用在select标签上");
          }

          if(attrs.multiple) {
            if(attrs.tags==="true") {
            } else {
              element.parent().addClass("hidden-select2");
            }
          }

        }
      };
    }]);
}());
