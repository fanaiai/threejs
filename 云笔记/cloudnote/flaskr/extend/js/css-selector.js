+(function($, root) {
    var default_option = {
        ignoreallattributes: true,
        ignore: {
            class: function(name, value) {

            },
            id: function(name, value) {

            },
            attribute: function(name, value) {

            }
        }
    };
    var CssSelector = function(options) {
        this.options = $.extend(default_option, options || {});
        this.init();
        return this;
    }
    CssSelector.prototype = {
        constructor: CssSelector,
        init: function() {},
        /**
         * 获取css全路径
         *
         * @param  {HTMLElement} el - [description]
         */
        getFullSelector: function(el) {
            var csspath = [];
            for (; el && el.nodeType == 1 && el.nodeName != 'BODY'; el = el.parentNode) {
                try {
                    var nodePath = el.nodeName + getAttribute(el, this.options);
                    var curPath = nodePath + (csspath.length > 0 ? ('>' + csspath.join('>')) : '');
                    csspath.unshift(nodePath + getPseudo(el));
                } catch (e) {
                    console.log(e)
                }
            }
            var path = {
                patharray: csspath,
                pathstring: csspath.join('>')
            }
            return path;
        },
        /**
         * 获取唯一路径
         *
         * @param  {HTMLElement} el - [description]
         */
        getUniqueSelector: function(el) {
            var csspath = [];
            for (; el && el.nodeType == 1 && el.nodeName != 'BODY'; el = el.parentNode) {
                var nodePath = el.nodeName + getAttribute(el, this.options);
                var curPath = nodePath + (csspath.length > 0 ? ('>' + csspath.join('>')) : '');
                // console.log(curPath)
                if ($(curPath).length <= 1) {
                    csspath.unshift(nodePath);
                    break;
                } else {
                    // console.log(nodePath)
                    // console.log($(nodePath).siblings($(nodePath)).length)
                    // if ($(nodePath).siblings($(nodePath)).length <= 0) {
                    //     csspath.unshift(nodePath);
                    // } else {
                    //     csspath.unshift(nodePath + getPseudo(el));
                    // }
                    csspath.unshift(nodePath + getPseudo(el));
                }
            }
            var path = {
                patharray: csspath,
                pathstring: csspath.join('>')
            }
            return path;
        },
        getMultiSelector: function(el) {

        },
        getSubSelector: function(parentpath, subpath, extratype, contentsimilar, selectsimilar) {
            subpath = this.getFullSelector($(subpath.pathstring)[0])
            var childtags = [];
            var $el = $(subpath.pathstring);
            var notin = false;
            // if(extratype==1 || contentsimilar){
            //     if($(parentpath.pathstring).index($el)>-1){
            //         return subpath;
            //     }
            //     else{
            //         return false;
            //     }
            // }
            for (; $(parentpath.pathstring).index($el) <= -1; $el = $el.parent()) {
                if ($el[0] && $el[0].tagName == 'BODY') {
                    notin = true;
                    break;
                }
                subpath.patharray.length > 0 && childtags.unshift(delId(subpath.patharray.pop()));
            }
            if (!notin) {
                if (extratype == 1 || (extratype == 2 && contentsimilar && selectsimilar)) {
                    var path = this.getUniqueSelector($el[0]);
                    return path;
                } else {
                    var path = {
                        patharray: childtags
                    }
                    path.pathstring = path.patharray.join('>')
                    return path;
                }
            } else {
                return false;
            }
        },
        getFullSubSelector: function(parentpath, subpath) {
            var subpath = this.getSubSelector(parentpath, subpath);
            if (subpath) {
                var path = {};
                path.patharray = (parentpath.patharray || []).concat(subpath.patharray);
                path.pathstring = parentpath.pathstring + (subpath.patharray.length > 0 ? ('>' + subpath.patharray.join('>')) : '');
                return path;
            } else {
                return false;
            }
        },
        /**
         * 获取同类元素的通用css路径
         *
         * @return {string}      path       - [路径对象]
         */
        getSimilarSelector: function(path) {
            var similarpath = {};
            var childtags = [];
            path = this.getFullSelector($(path.pathstring)[0]);
            if (path.patharray.length <= 0) {
                return;
            }
            for (var i = path.patharray.length; i >= 0; i--) {
                var $el = $(path.patharray.slice(0, i).join('>'));
                if ($el.siblings($el[0].tagName).length > 0) {
                    if (i <= 1) {
                        similarpath = (this.getUniqueSelector($el.parent()[0]));

                    } else {
                        similarpath = this.getUniqueSelector($(path.patharray.slice(0, i - 1).join('>'))[0]);
                    }
                    childtags.unshift($(path.patharray.slice(0, i).join('>'))[0].tagName + getAttribute($(path.patharray.slice(0, i).join('>'))[0], this.options, true))
                    break;
                } else {
                    childtags.unshift($(path.patharray.slice(0, i).join('>'))[0].tagName + getAttribute($(path.patharray.slice(0, i).join('>'))[0], this.options, true))
                }
            }
            similarpath.patharray = similarpath.patharray.concat(childtags);
            similarpath.pathstring = similarpath.patharray.join('>');
            return similarpath;
        },
        /**
         * 获取同类元素的通用css路径数组
         *
         * @return {string}      path       - [路径对象]
         */
        getSimilarSelectorList: function(path, issimilar) {
            var that = this;
            var paths = [];
            var similarpath = issimilar ? path : (this.getSimilarSelector(path).pathstring);
            $.each($(similarpath), function(i, ele) {
                if (i < 50) { //限制到50条，否则卡死了
                    paths.push(that.getUniqueSelector(ele));
                } else {
                    paths.push({});
                }
            })
            return paths;
        },
        /**
         * 获取多个元素的通用css路径，相似元素
         *
         * @return {string}      paths {Array}       - [路径对象]
         */
        getTwoPathOfSimilar: function(paths) {
            // var paths = ['UL#list>LI:nth-of-type(1)>A:nth-of-type(1)', 'UL#list>LI:nth-of-type(2)>A:nth-of-type(1)'];
            var el1 = $(paths[0])[0];
            var el2 = $(paths[1])[0];
            var childpath = '';
            if (el1.nodeName != el2.nodeName) {
                return paths[0];
            }
            for (; el1 && el1.nodeType == 1 && el1.nodeName != 'BODY'; el1 = el1.parentNode) {
                if (el1.tagName == 'BODY') {
                    break;
                } else {
                    if ($(el1).parent().children(el1.nodeName).index($(el2)) > -1) {
                        var class1 = this.getClassList(el1)
                        var class2 = this.getClassList(el2)
                        var classes = class1.filter(function(e) {
                            return class2.indexOf(e) > -1
                        })
                        childpath = el1.nodeName + (classes.length > 0 ? ('.' + classes.join('.')) : '') + ' ' + childpath;
                        childpath = this.getUniqueSelector($(el1).parent()[0]).pathstring + ' ' + childpath;
                        break;
                    } else {
                        if (el2.nodeName == el1.nodeName) {
                            var class1 = this.getClassList(el1)
                            var class2 = this.getClassList(el2)
                            var classes = class1.filter(function(e) {
                                return class2.indexOf(e) > -1
                            })
                            childpath = el1.nodeName + (classes.length > 0 ? ('.' + classes.join('.')) : '') + ' ' + childpath;
                        }
                        el2 = el2.parentNode
                    }
                }
            }
            return childpath.trim();
        },
        getBiggerSimilar: function(similarpath1, curpath) {
            var $el1 = $(similarpath1);
            var $el2 = $(curpath);
            var nosimilar = false;
            var similarpath = {};
            for (; $el1[0] && $el1[0].nodeType == 1 && $el1[0].nodeName != 'BODY'; $el1 = $el1.parent()) {
                if ($el1[0].tagName == 'BODY') {
                    nosimilar = true;
                    break;
                } else {
                    if (this._ifinset($el2.parents(), $el1)) {
                        similarpath = this.getUniqueSelector($el1[0]);
                        break;
                    }
                }
            }
            return similarpath;
        },
        _ifinset: function(arry1, arry2) {
            var has = false;
            for (var i = 0; i < arry1.length; i++) {
                for (var j = 0; j < arry2.length; j++) {
                    if (arry1[i] == arry2[j]) {
                        has = true;
                        break;
                    }
                }
            }
            return has;
        },
        getClassList: function(el) {
            var classlist=$(el).attr('class') ? ($(el).attr('class').trim().split(' ')) : [];
            return classlist.filter(function(e){
                return !(/\d{4}/.test(e));
            })
        },
        getAttrList: function(elepath) {
            var attributes = [],
                list = [],
                listdata = [];
            $.each($(elepath), function(i, ele) {
                var attributes = ele.attributes;
                $.each(attributes, function(j, e) {
                    if (e.name && list.indexOf(e.name) < 0) {
                        list.push(e.name)
                        listdata.push({ name: e.name, value: e.value })
                    }
                })
            })
            return listdata;
        }
    }

    var specialchar = /\S*[\.\#\:]+\S*/g

    function getAttribute(el, options, noid) {
        var attributes = el.attributes;
        var attributestring = '';
        $.each(attributes, function(i, e) {
            if (e.name == 'class' && e.value.trim() != '') {
                var classlist=e.value.replace(specialchar, '').trim().split(" ");
                classlist=classlist.filter(function(ele){
                    return !(/\d{4}/.test(ele));
                })
                classlist=classlist.join(" ");
                attributestring = attributestring + '.' + classlist.replace(/\s+|\s+/g, '.');
                if(attributestring=='.'){
                    attributestring='';
                }
            } else if (e.name == 'id' && e.value.trim() != '' && !noid) {
                attributestring = attributestring + '#' + e.value.replace(specialchar, '').trim().replace(/\s+|\s+/g, '#');
                if(attributestring=='#'){
                    attributestring='';
                }
            } else if (!options.ignoreallattributes) {
                attributestring = attributestring + '[' + e.name + '=' + e.value + ']';
            }
        })
        return attributestring;
    }

    function getPseudo(el) {
        var $siblings=$(el).parent().children(el.tagName);
        var index = $siblings.index($(el)) + 1;
        if($siblings.length<=index){
            return ":last-of-type";
        }
        else{
        return ':nth-of-type(' + index + ')';}
        // return ''
    }

    function delId(str) {
        return str.replace(/#[^.:]*/g, '');
    }
    window.CssSelector = CssSelector;
})(jQuery, window)