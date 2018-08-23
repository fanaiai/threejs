(function(root) {
    var default_option = {};

    function HightLight(rootshadow, option) {
        this.opt = $.extend(default_option, option);
        this.sizes = {};
        this.rootshadow = rootshadow;
        this.addResizeEvent();
    }
    HightLight.prototype = {
        getSizes: function(ele) {
            var sizes = {
                "height": $(ele).outerHeight(),
                "width": $(ele).outerWidth(),
                "top": ele.getBoundingClientRect().top + window.scrollY,
                "left": ele.getBoundingClientRect().left + window.scrollX
            }
            return sizes;
        },
        addSelectedShadowDom: function(rootshadow, sizes, type, processed, current, parent, cleaning, page) {
            var rootshadow = rootshadow || this.rootshadow || null;
            var innerShadowRoot = document.createElement("div");
            innerShadowRoot.className = "selected-element  caiyun-highlight";
            rootshadow.append(innerShadowRoot);
            var innershadow = innerShadowRoot.createShadowRoot();
            var innerShadowElement = document.createElement("div");
            innerShadowElement.className = "caiyun-highlight";
            $(innerShadowElement).css({
                "width": sizes.width + "px",
                "height": sizes.height + "px",
                "top": sizes.top + "px",
                "left": sizes.left + "px",
                "position": "absolute",
                "box-sizing": "border-box",
                "border": type == 'A' ? "1px solid blue" : "1px dashed #ff5722",
                "background": cleaning ? "rgba(255, 255, 255, 0.9)" :(current?"rgba(45, 175, 75, 0.4)":(parent ? "rgba(116, 216, 255, 0)" : (page ? "rgba(211, 143, 227, 0.57)" : (processed ? "rgba(251, 186, 201, 0.57)" :"" )))),
                // "box-shadow": current ? "0 0 0 2px #f71198" : "none",
                "z-index": 99999,
                "pointer-events": "none" //神属性
            });
            innershadow.append(innerShadowElement);
        },
        addHoverShadowDom: function(rootshadow, sizes) {
            var rootshadow = rootshadow || this.rootshadow || null;
            if ($(rootshadow).find(".hover-element").length <= 0) {
                var innerShadowRoot = document.createElement("div");
                innerShadowRoot.className = "hover-element  caiyun-highlight";
                rootshadow.append(innerShadowRoot);
                var innershadow = innerShadowRoot.createShadowRoot();
                var innerShadowElement = document.createElement("div");
                innerShadowElement.className = "caiyun-highlight";
                $(innerShadowElement).css({
                    "width": sizes.width + "px",
                    "height": sizes.height + "px",
                    "top": sizes.top + "px",
                    "left": sizes.left + "px",
                    "position": "absolute",
                    "box-sizing": "border-box",
                    "background": "rgba(142, 234, 243, 0.48)",
                    "z-index": 99999,
                    "pointer-events": "none" //神属性
                });
                innershadow.append(innerShadowElement);
            } else {
                var innerShadowRoot = $(rootshadow).find(".hover-element")[0];
                var innershadow = innerShadowRoot.shadowRoot;
                var $innerShadowElement = $(innershadow).find(".caiyun-highlight");
                $innerShadowElement.css({
                    "width": sizes.width + "px",
                    "height": sizes.height + "px",
                    "top": sizes.top + "px",
                    "left": sizes.left + "px"
                })
            }
        },
        clearHoverShadowDom: function() {

        },
        clearallSelectedShadowDom: function(rootshadow) {
            var rootshadow = rootshadow || this.rootshadow || null;
            rootshadow.innerHTML = '';
        },
        repainSelectedShadowDom: function(pathobj) {
            var pathobj = pathobj || this.pathobj;
            if (!pathobj) {
                return;
            }
            this.pathobj = pathobj;
            rootshadow = rootshadow || this.rootshadow || null;
            this.clearallSelectedShadowDom(rootshadow);
            var that = this;
            var totalpaths = {};
            // $.each(paths, function(i, e) {
            //     if (!totalpaths[e.pathstring]) {
            //         totalpaths[e.pathstring] = {};
            //     }
            //     $.extend(true, totalpaths[e.pathstring], e, { path: true})
            // })

            if (pathobj.curpath) {
                $.each(pathobj.curpath, function(i, e) {
                    if (!totalpaths[e.pathstring]) {
                        totalpaths[e.pathstring] = {};
                    }
                    $.extend(true, totalpaths[e.pathstring], e, { current: true })
                })

            }
            if (pathobj.pagepaths) {
                    $.each(pathobj.pagepaths, function(i, e) {
                    if (!totalpaths[e.pathstring]) {
                        totalpaths[e.pathstring] = {};
                    }
                    $.extend(true, totalpaths[e.pathstring], e, { page: true })
                    })

            }
            // if (pathobj.parentpaths) {
            //     $.each(pathobj.parentpaths, function(i, e) {
            //         if (!totalpaths[e.pathstring]) {
            //             totalpaths[e.pathstring] = {};
            //         }
            //         $.extend(true, totalpaths[e.pathstring], e, { parent: true })
            //     })

            // }            
            if (pathobj.similarpath && pathobj.similarpath.pathstring) {
                var st=pathobj.similarpath.pathstring.trim().replace('/\>$/','');
                    if (!totalpaths[st]) {
                        totalpaths[st] = {};
                    }
                    $.extend(true, totalpaths[st], pathobj.similarpath, { parent: true })
                    // console.log(pathobj.similarpath)

            }
            if (pathobj.processedpaths) {
                $.each(pathobj.processedpaths, function(i, e) {
                    if (!totalpaths[e.pathstring]) {
                        totalpaths[e.pathstring] = {};
                    }
                    $.extend(true, totalpaths[e.pathstring], e, { processed: true })
                })
            }
            if (pathobj.cleaningpath) {
                $.each(pathobj.cleaningpath, function(j, ele) {
                    $.each(ele, function(i, e) {
                        if (!totalpaths[e.pathstring]) {
                            totalpaths[e.pathstring] = {};
                        }
                        $.extend(true, totalpaths[e.pathstring], e, { cleaning: true })
                    })
                })
            }
            for (var k in totalpaths) {
                (function(e) {
                    var host = $(e.pathstring);
                    host=host.slice(0,50);
                    host.each(function(i, el) {
                        $(el).each(function(j,ele){
                        var sizes = that.getSizes(ele);
                        // console.log(ele)
                        that.addSelectedShadowDom(rootshadow, sizes, ele.tagName, e.processed, e.current, e.parent, e.cleaning,e.page);})
                    })
                })(totalpaths[k])
            }
        },
        addResizeEvent: function() {
            var that = this;
            $(window).resize(function(e) {
                that.repainSelectedShadowDom();
            })
            $(document).bind("mousewheel", function(e) {
                // that.repainSelectedShadowDom();
            })
        }
    }
    root.HightLight = HightLight;
})(window)