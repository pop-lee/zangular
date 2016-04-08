/**
 * Created by z on 10/26/15.
 */
angular
    .module('z.angular.ui.tree', [
        'ui.tree',
        'ui.bootstrap'
    ])

    .directive('zTree', [
        '$timeout', "$animate", function ($timeout) {
            return {
                restrict: 'A',
                templateUrl: 'app/zangular/template/treeTemplate.html',//function(e,attr) {return attr.template;},
                replace: true,
                scope: {
                    treeData: '=',
                    currentSelect: '=?',
                    useToggle: '@',
                    onSelect: '&',
                    onDoubleClick: '&',
                    onAfterRender: '&',
                    initialSelection: '@',
                    template: '@'
                },
                controller: function ($scope, $element) {
                    $scope.onClick = function (scope) {
                        $scope.select = scope.$id;
                        scope.onSelect({node: scope.$modelValue});
                        scope.tree.toggle(scope.$modelValue);
                        //if(scope.ctrlRef) {
                        //  scope.ctrlRef.toggle(scope.$modelValue);
                        //}
                    }
                    $scope.onDblclick= function (scope) {
                        scope.onDoubleClick({node: scope.$modelValue});
                    }
                },
                link: function (scope, element, attrs) {
                    $timeout(function () {
                        scope.onAfterRender();
                    });

                    scope.item = {};
                    scope.useToggle = true;
                    scope.leafNodeCanSelect = true;
                    scope.activeNodeScope = {};
                    scope.oldActiveNodeScope = {};
                    scope.checked_change = function (branch, event) {
                        branch.checked = !branch.checked;
                        event.stopPropagation();
                    };

                    scope.$watch('activeNodeScope', function (newNodeScope, oldNodeScope) {
                        scope.oldActiveNodeScope = oldNodeScope;
                        oldNodeScope.active = false;
                        newNodeScope.active = true;
                    });

                    scope.$watch('useToggle', function (newValue) {
                        if (newValue == undefined) {
                            scope.useToggle = true;
                        }
                    });

                    if(scope.currentSelect) {
                        scope.$watch('currentSelect', function (newValue, oldValue) {
                            tree.toggle(newValue);
                        });
                    }
                    scope.$watch('treeData', function (newValue) {
                        scope.item.children = scope.treeData;
                        $timeout(function () {
                            tree.collapse_all();
                            tree.toggle(scope.currentSelect);
                        }, 0)

                        ////						debugger;
                        //						if(scope.mouseEnterClass) {
                        //							element.find("a").addClass(scope.mouseEnterClass);
                        //							element.find("a").off("mouseenter mouseleave");
                        //							element.find("a").on("mouseenter mouseleave",function (event) {
                        //								if(event.type=="mouseenter") {
                        //									$animate.addClass($(this), "mouseenter");
                        //								} else {
                        //									$animate.removeClass($(this), "mouseenter");
                        //								}
                        //							});
                        //						}
                        //
                        //						eachTreeScope(scope.$$childHead.$nodesScope,function(nodeScope) {
                        //							nodeScope.active = false;
                        //						});

                    }, true);

                    //				var toggleSameLevel = function(nodeScope) {
                    //					eachTreeScope(nodeScope.$parent.$parent,function(eachNodeScope) {
                    //						if(eachNodeScope != cs && eachNodeScope.collapsed != true) {//如果是关着的，就不能开
                    //							eachNodeScope.toggle();
                    //						}
                    //						return "continue";
                    //					});
                    //				};
                    var getRootNodeScope = function () {
                        return scope.$$childHead.$$childHead;
                    }
                    /**
                     * 遍历同级节点Scope,只遍历同级,不深层遍历
                     * @param nodeScope 要遍历同级节点的节点
                     * @param fn
                     * @returns {*}
                     */
                    var eachSameLevelScope = function (nodeScope, fn) {
                        if (nodeScope == undefined || nodeScope == null) {
                            return;
                        }
                        var parentScope = nodeScope.$parent.$nodesScope;
                        var length = parentScope.childNodes().length;
                        for (var i = 0; i < length; i++) {
                            var ret = fn(parentScope.childNodes()[i]);
                            if (ret == "return") {
                                return ret;
                            } else if (ret == "continue") {
                                continue;
                            } else if (ret == "break") {
                                break;
                            }
                        }
                        // var parentNodeScope = nodeScope.$parentNodesScope;
                        // var arr = parentNodeScope.$modelValue;
                        // var map = parentNodeScope.$nodesMap;
                        // if(arr!=undefined) {
                        //   for(var i=0;i<arr.length;i++) {
                        //     var ns = map[arr[i].$$hashKey];
                        //     var ret = fn(ns);
                        //     if(ret == "return") {
                        //       return ret;
                        //     } else if (ret == "continue") {
                        //       continue;
                        //     } else if (ret == "break") {
                        //       break;
                        //     }
                        //   }
                        // }
                    };
                    /**
                     * 遍历树下一级节点(仅下一级,不再深度遍历)
                     * @param nodeScope
                     * @param fn
                     * @returns {*}
                     */
                    var eachNextLevelScope = function (nodeScope, fn) {
                        if (nodeScope == undefined || nodeScope == null) {
                            return;
                        }
                        var length = nodeScope.childNodes().length;
                        for (var i = 0; i < length; i++) {
                            var ret = fn(nodeScope.childNodes()[i]);
                            if (ret == "return") {
                                return ret;
                            } else if (ret == "continue") {
                                continue;
                            } else if (ret == "break") {
                                break;
                            }
                        }
                        // var arr = nodeScope.$childNodesScope.$modelValue;
                        // var map = nodeScope.$childNodesScope.$nodesMap;
                        // if(arr!=undefined) {
                        //   for(var i=0;i<arr.length;i++) {
                        //     var ns = map[arr[i].$$hashKey];
                        //     var ret = fn(ns);
                        //     if(ret == "return") {
                        //       return ret;
                        //     } else if (ret == "continue") {
                        //       continue;
                        //     } else if (ret == "break") {
                        //       break;
                        //     }
                        //   }
                        // }
                    };
                    /**
                     * 递归遍历树所有子集节点
                     * @param nodeScope 要遍历的树的根节点
                     * @param fn
                     */
                    var eachAllChildScope = function (nodeScope, fn) {
                        //递归
                        return eachNextLevelScope(nodeScope, function (ns) {
                            return eachTreeScope(ns, fn);
                        })
                    };
                    /**
                     * 遍历包含自己的整个树
                     * @param nodeScope
                     * @param fn
                     * @returns {*}
                     */
                    var eachTreeScope = function (nodeScope, fn) {
                        var ret = fn(nodeScope);
                        if (ret == "return") {
                            return ret;
                        } else {
                            return eachAllChildScope(nodeScope, fn);
                        }
                    }
                    var findScope = function (nodeScope, parentNodeScope) {
                        if (!parentNodeScope) {
                            parentNodeScope = getRootNodeScope().$nodesScope;
                        }
                        var ns = null;
                        eachTreeScope(parentNodeScope, function (eachNodeScope) {
                            if (eachNodeScope == nodeScope) {
                                ns = eachNodeScope;
                                return "return";
                            }
                        });
                        return ns;
                    };

                    //var eachParentScope = function(nodeScope,fn) {
                    //  if(nodeScope.$parentNodeScope) {
                    //    var ret = fn(nodeScope.$parentNodeScope);
                    //    if(ret == "return") {
                    //      return ret;
                    //    }
                    //    var eachRet = eachTreeScope(nodeScope.$parentNodeScope,fn);
                    //    if(eachRet == "return") {
                    //      return eachRet;
                    //    }
                    //  }
                    //};
                    var getScopeByData = function (data) {
                        if (data == null || data == undefined) {
                            return null;
                        }
                        var returnScope = null;

                        var ns = getRootNodeScope().$nodesScope;
                        eachTreeScope(ns, function (nodeScope) {
                            if (nodeScope.$modelValue == data) {
                                returnScope = nodeScope;
                                return "return";
                            }
                        });
                        return returnScope;
                    };
                    /**
                     * 判断是否为叶子节点
                     * @param nodeScope
                     * @returns {boolean}
                     */
                    var isLeafNode = function (nodeScope) {
                        return nodeScope.childNodes().length == 0;
                        // if(nodeScope.$childNodesScope.$modelValue!=undefined&&nodeScope.$childNodesScope.$modelValue.length>0){
                        //   return false;
                        // } else {
                        //   return true;
                        // }
                    };
                    /**
                     * 查找自己活着子节点是否有当前选择的节点
                     * @param nodeScope
                     * @returns {boolean}
                     */
                    var childHasActive = function (nodeScope) {
                        if (findScope(getScopeByData(scope.currentSelect), nodeScope) != undefined) {
                            return true;
                        }
                        return false;
                    };

                    /**
                     * 关闭节点
                     * @param nodeScope
                     */
                    var collapseNode = function (nodeScope) {
                        if (childHasActive(nodeScope)) {
                            scope.activeNodeScope = nodeScope;
                        }

                        //叶子节点不进行关闭,非叶子节点,进行关闭
                        if (!isLeafNode(nodeScope) || nodeScope != getScopeByData(scope.currentSelect)) {
                            nodeScope.collapse();//关闭所有同级节点,使用ui-tree自有API
                        }

                    };
                    /**
                     * 展开节点
                     * @param nodeScope
                     */
                    var expandNode = function (nodeScope) {

                        if (!nodeScope.collapsed) {
                            return;
                        }

                        if (isLeafNode(nodeScope)) {
                            scope.activeNodeScope = nodeScope;
                            scope.currentSelect = nodeScope.$modelValue;
                        } else {//如果不是叶子节点
                            if (!scope.leafNodeCanSelect) {//判断是否只有叶子节点才可以被选中
                                scope.currentSelect = nodeScope.$modelValue;
                            }

                            //遍历子集,查找所有关闭的或者是叶子节点的节点,判断是否有激活节点,如果有,则将该节点激活;
                            eachAllChildScope(nodeScope, function (ns) {
                                if (ns.collapsed || isLeafNode(ns)) {
                                    if (childHasActive(ns)) {
                                        scope.activeNodeScope = ns;
                                        return "return";
                                    }
                                }
                            });
                        }

                        if (scope.useToggle) {//判断是否使用互斥
                            eachNextLevelScope(nodeScope.$parent.$nodesScope, function (ns) {
                                if (ns === nodeScope) {
                                    return;
                                }
                                collapseNode(ns);
                            });
                        }

                        //递归展开父级
                        if (nodeScope.$parentNodeScope) {
                            expandNode(nodeScope.$parentNodeScope);
                        }

                        nodeScope.expand();//展开当前节点,使用ui-tree自有API
                    };

                    var tree = scope.tree = {};

                    //if (scope.ctrlRef != null) {
                    //  if (angular.isObject(scope.ctrlRef)) {
                    //    var tree = scope.ctrlRef;

                    tree.toggle = function (data) {
                        var cs = getScopeByData(data);
                        if (!cs) {
                            return;
                        }
                        if (cs.collapsed) {//如果进行展开的操作
                            expandNode(cs);
                        } else {//如果进行关闭
                            collapseNode(cs);
                        }
                    };

                    tree.expand_all = function (data) {
                        if (data) { //在nodeMapper中查找
                            var _scope = getScopeByData(data);
                            _scope.expandAll();
                            //								return $scope.$$childHead.$nodesScope.$modelValue;
                        } else {
                            getRootNodeScope().expandAll();
                            //								scope.$$childHead.$nodesScope.$broadcast('expandAll');
                            //								return scope.$$childHead.$nodesScope.$modelValue;
                        }
                    };
                    tree.collapse_all = function (data) {
                        if (data) { //在nodeMapper中查找
                            var _scope = getScopeByData(data);
                            _scope.collapseAll();
                            //								return $scope.$$childHead.$nodesScope.$modelValue;
                        } else {
                            getRootNodeScope().collapseAll();
                            //								return scope.$$childHead.$nodesScope.$modelValue;
                        }
                    };
                    tree.add_branch = function (parentData, newData) {
                        if (parentData != null) {
                            if (parentData.children != null && parentData.children != undefined) {
                                parentData.children.push(newData);
                            } else {
                                parentData.children = [];
                                parentData.children.push(newData);
                            }
                        } else {
                            scope.treeData.push(newData);
                        }
                        //							return new_branch;
                    };
                    tree.add_root_branch = function (new_branch) {
                        tree.add_branch(null, new_branch);
                        //							return new_branch;
                    };
                    tree.del_branch = function (data) {
                        var parentData = tree.get_parent_branch(data);
                        if (parentData) {
                            parentData.children.splice($.inArray(data, parentData.children), 1);
                        } else {
                            scope.treeData.splice($.inArray(data, scope.treeData), 1);
                        }
                        //							return b;
                    }
                    tree.get_parent_branch = function (data) {
                        var scope = getScopeByData(data);
                        if (scope) {
                            if (scope.$parentNodesScope.$nodeScope == null) {
                                return null;
                            }
                            return scope.$parentNodesScope.$nodeScope.$modelValue;
                        }
                        return null;
                    }
                    //}
                    //}
                }
            };
        }
    ]);
