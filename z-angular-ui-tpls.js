/**
 * Created by z on 10/26/15.
 */
angular.module("z.angular.ui.tpls", ['template/zDialog/zDialog.html','template/zLoading/zLoading.html','template/zPagination/zPagination.html']);

angular.module("template/zDialog/zDialog.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/zDialog/zDialog.html",
    "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\">\n"+
    "  <div class=\"modal-dialog\">\n"+
    "    <div class=\"modal-content panel panel-primary\">\n"+
    "      <div class=\"modal-header panel-heading\">\n"+
    "        <button type=\"button\" class=\"close\" ng-click=\"show=false\" ><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>\n"+
    "        <h4 class=\"modal-title\" id=\"myModalLabel\">&nbsp{{title}}</h4>\n"+
    "      </div>\n"+
    "      <div class=\"modal-body panel-body\">\n"+
    //"   <div ng-if=\"isShow\" ng-include=\"loadUrl\" ></div>\n"+
    "		<div id=\"dialogContent\"></div>\n"+
    "      </div>\n"+
    "      <div class=\"modal-footer panel-footer\">\n"+
    "        <button type=\"button\" class=\"btn btn-default\" ng-click=\"show=false\" >取消</button>\n"+
    "        <button ng-if=\"showSaveBtn\" type=\"button\" class=\"btn btn-primary\"  ng-click=\"save()\" ng-class=\"{true:'btn-default disabled',false:'btn-success' }[haveErrorClass]\">" +
    "        {{confirmBtnTxt!=undefined&&confirmBtnTxt!=''?confirmBtnTxt:'保存'}}</button>\n"+
    "      </div>\n"+
    "    </div>\n"+
    "  </div>\n"+
    "</div>\n"+
    "");
}]);

angular.module("template/zLoading/zLoading.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/zLoading/zLoading.html",
    "<div id='zLoading' style=\'z-index:1000000;position: absolute; width: 100%; height: 100%; display: block; background: black; opacity: 0.3; left: 0px; top: 0px;\'>\n" +
    " <table style=\'text-align: center; width: 100%; height: 100%;\'>\n" +
    "   <tr>" +
    "     <td><i class=\'fa fa-5x fa fa-cog fa-spin' style='color: white;\'></i></td>\n" +
    "   </tr>\n" +
    " </table>\n" +
    "</div>\n"
  );
}]);

angular.module("template/zPagination/zPagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/zPagination/zPagination.html",
    "  <div class='input-group z-pagination'>\n" +
    "    <div class='input-group-btn'>\n" +
    "       <button class='btn btn-default' aria-label='First' ng-click='toFirst()'>««</button>\n" +
    "       <button class='btn btn-default' aria-label='Previous' ng-click='toPrev()'>«</button>\n" +
    "       <button class='btn btn-default' aria-label='PreviousGroup' ng-if='start>1' ng-click='toPrevGroup()'>…</button>\n" +
    "       <button class='btn btn-default' ng-repeat='pageNum in tagList' ng-class='{\"active\":curPage==pageNum}' ng-click='curPage=pageNum'>{{pageNum}}</button>\n" +
    "    </div>\n" +
    "    <input type='text' class='form-control' >\n" +
    "    <div class='input-group-btn'>\n" +
    "       <button class='btn btn-default' aria-label='NextGroup' ng-if='end<pageTotal' ng-click='toNextGroup()'>…</button>\n" +
    "       <button class='btn btn-default' aria-label='Next' ng-click='toNext()'>»</button>\n" +
    "       <button class='btn btn-default' aria-label='End' ng-click='toEnd()'>»»</button>\n" +
    "    </div>\n" +
    "  </div>\n"
  );
}]);
