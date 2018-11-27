/**
 * 基于select2
 */
(function () {
    'use strict';

    angular
        .module('z.angular.select', [])

        .directive('zSelect', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    ngModel: '='
                    //multiple:'@'
                },
                link: function (scope, element, attrs, controller) {

                    scope.$on("$destroy", function () {
                        element.prop("disabled", true);
                        //element.select2('close');
                        if(scope.select2) {
                            scope.select2.trigger("select2:close");
                        }
                    });

                    //scope.ngModel = "";
                    scope.select2 = null;

                    $timeout(function () {
                        if(scope.select2) {
                            scope.select2.val(scope.ngModel);
                            scope.select2.trigger("change");
                        }else{
                            element.val(scope.ngModel);
                            element.trigger("change");
                        }
                    });

                    var select2Option = {
                        //placeholder: "Select a state"
                        width: '100%',
                        //allowClear: true,
                        tags: false
                    };

                    //隐藏下拉菜单中的搜索框
                    if (attrs.minimumResultsForSearch) {
                        select2Option.minimumResultsForSearch = attrs.minimumResultsForSearch;
                    }

                    if (element.is('select')) {
                        if (element.hasClass("form-control")) {
                            element.hover(function () {
                                scope.select2 = element.select2(select2Option);
                                scope.select2.data("select2").$container.addClass("z-select");
                                if(element.css("max-width") !== "none"){
                                    scope.select2.data("select2").$container.css({maxWidth:element.css("max-width")});
                                }
                            })
                        } else {
                            scope.select2 = element.select2(select2Option);
                        }
                    } else {
                        throw new Error("此指令需是用在select标签上");
                    }

                    //$timeout(function() {
                    //    $(element.next().find('.select2-selection')).on('blur',function() {
                    //        $timeout(function() {
                    //            element.select2('close');
                    //        });
                    //    });
                    //});

                    if (attrs.multiple) {
                        if (attrs.tags === "true") {
                        } else {
                            element.parent().addClass("hidden-select2");
                        }
                    }

                    scope.$watch('ngModel', function () {
                        $timeout(function () {
                            if(scope.select2) {
                                scope.select2.val(scope.ngModel);
                                scope.select2.trigger("change");
                            }else{
                                element.val(scope.ngModel);
                                element.trigger("change");
                            }
                        });
                    });

                }
            };
        }]);
}());
