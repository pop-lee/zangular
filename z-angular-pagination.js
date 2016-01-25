/**
 * Created by LiYunpeng on 11/19/15.
 *
 * dataCount 数据总条数
 * curPage 当前页数
 * perPage 每页显示多少条
 * showPageTag 是否显示页签按钮
 * maxTag 一次最多能显示多少页
 *
 */
(function() {
  'use strict';

  angular.module("z.angular.pagination",[])
    .directive('zPagination',['$window',function($window) {
      return {
        restrict:'AE',
        templateUrl:'template/zPagination/zPagination.html',
        scope: {
          dataCount:'=?',
          perPage:'=?',
          curPage:'=?',
          showPageTag:'=?',
          maxTag:'=?'
        },
        link: function(scope,element,attrs,controller){

          if(!scope.maxTag) {
            scope.maxTag = 10;
          }

          if(!scope.curPage) {
            scope.curPage = 1;
          }

          if(!scope.showPageTag) {
            scope.showPageTag = "true";
          }

          if(!scope.dataCount) {
            scope.dataCount = 0;
          }

          if(!scope.perPage) {
            scope.perPage = 10;
          }

          //当前页签开始页数
          scope.start = scope.curPage;
          //当前页签结束页数
          //scope.end = scope.curPage + scope.maxTag - 1;
          //页签列表
          scope.tagList = [];
          //总页数
          scope.pageTotal = 1;

          scope.pageInput = null;

          scope.toPage = function(page){
            var toPage = parseInt(page);
            if(toPage < 1) toPage = 1;
            if(toPage > scope.pageTotal) toPage = scope.pageTotal;
            if(toPage < scope.start || toPage>scope.end){
              scope.start = Math.min(Math.floor((toPage-1)/scope.maxTag) * scope.maxTag + 1, scope.pageTotal - scope.maxTag + 1);
            }
            scope.curPage = toPage;
          };

          scope.inputPage = function(ev){
            if(ev.keyCode == 13 && typeof(scope.pageInput) == "number"){
              scope.toPage(scope.pageInput);
              scope.pageInput = null;
            }
          };

          scope.toFirst = function() {
            scope.toPage(1);
          };

          scope.toEnd = function() {
            scope.toPage(scope.pageTotal);
          };

          scope.toPrev = function() {
            scope.toPage(scope.curPage - 1);
          };

          scope.toNext = function() {
            scope.toPage(scope.curPage + 1);
          };

          scope.toPrevGroup = function() {
            scope.start = Math.max(scope.start - scope.maxTag,1);
          };

          scope.toNextGroup = function() {
            scope.start = Math.min(scope.start + scope.maxTag,scope.pageTotal + 1 - scope.maxTag);
          };

          scope.$watch('dataCount',function(newValue) {
            scope.pageTotal = Math.ceil(scope.dataCount/scope.perPage);
            scope.end = Math.min(scope.start + scope.maxTag - 1,scope.pageTotal);
            refreshTag();
          });

          scope.$watch('start',function() {
            scope.end = Math.min(scope.start + scope.maxTag - 1,scope.pageTotal);
            refreshTag();
          });

          var refreshTag = function() {
            scope.tagList = [];
            for(var i = scope.start;i<=scope.end;i ++) {
              scope.tagList.push(i);
            }
          }
        }
      };
    }])
  ;

}());
