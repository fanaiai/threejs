(function(root) {
    var defaultoption = {};

    function ProcessImg(el, option) {
        this.$el = $(el);
        $(el).css('position','relative')
        this.size = { width: this.$el.width()*2, height: this.$el.height()*2 };
        this.option = $.extend(true, defaultoption, option);
        this.imgopeinfo = {
            "rect": [],
            "text": [],
            "arrow": []
        };
        this.fontstyle = {
            font: '32px 微软雅黑',
            fillStyle: '#ff0000'
        }
        this.init();
    }
    ProcessImg.prototype = {
        init: function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            $(this.canvas).css({width:this.size.width/2,height:this.size.height/2,"background":"#fff"})
            this.$el.html(this.canvas);
            this.confirm = '<div class="processimg confirm"><span id="confirm" class="sprite"></span><span id="cancel" class="sprite"></span></div>';
            this.text = '<input type="text" id="text" class="processimg"></input>';
            this.$el.append(this.confirm);
            this.$el.append(this.text);
            this.ctx = this.canvas.getContext('2d');
            this.opeclass = '';
            this.addbtns();
            this.addevents();
        },
        addevents: function() {
            var that = this;
            var mousedown = false;
            var startpos = {
                top: 0,
                left: 0
            };
            $(document).mousedown(function(e) {
                var $target = $(e.target);
                if ($target[0] == $(that.canvas)[0]) {
                    mousedown = true;
                    startpos.left = (e.clientX - that.canvas.getBoundingClientRect().left)*2;
                    startpos.top = (e.clientY - that.canvas.getBoundingClientRect().top)*2;
                    if (that.opeclass == 'addword') {
                        $("#text").css({ top: startpos.top/2 + 'px', left: startpos.left/2 + 'px' }).show(100, function() {
                            $("#text").focus();
                            $(".confirm").css({ 'top': startpos.top/2 + 'px', 'left': startpos.left/2 + 100 + 'px' }).show();
                            addingtext = true;
                        });
                    }
                }
            })

            $(document).mousemove(function(e) {
                if (mousedown && (that.opeclass == 'addselection' || that.opeclass == 'clip')) {
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left)*2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top)*2;
                    var width = left - startpos.left;
                    var height = top - startpos.top;
                    that.ctx.clearRect(0, 0, that.size.width, that.size.height);
                    that.redrawimg();
                    that.ctx.save();
                    that.ctx.fillStyle = 'rgba(0,0,0,.3)';
                    that.ctx.fillRect(0, 0, that.size.width, that.size.height);
                    that.ctx.beginPath();
                    that.ctx.rect(startpos.left, startpos.top, width, height);
                    that.ctx.clip();
                    that.redrawimgonly();
                    if (that.opeclass == 'addselection') {
                        that.ctx.strokeStyle = that.fontstyle.fillStyle;
                        that.ctx.lineWidth = 4;
                    } else {
                        that.ctx.strokeStyle = 'red';
                        that.ctx.lineWidth = 2;
                    }
                    that.ctx.strokeRect(startpos.left, startpos.top, width, height);
                    that.ctx.closePath();
                    that.ctx.restore();
                }
                if (mousedown && that.opeclass == 'addarrow') {
                    that.redrawimg();
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left)*2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top)*2;
                    that.drawArrow(startpos.left, startpos.top, left, top, 45, 15, 3, that.fontstyle.fillStyle);
                }
            })
            $(document).mouseup(function(e) {
                if (mousedown) {
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left)*2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top)*2;
                    var width = left - startpos.left;
                    var height = top - startpos.top;
                    if (that.opeclass == 'addselection' || that.opeclass == 'clip') {
                        $(".confirm").css({ 'top': top/2 + 'px', 'left': left/2 + 'px' }).show();
                        that.recttemp = {
                            strokeStyle:that.fontstyle.fillStyle,
                            x: startpos.left,
                            y: startpos.top,
                            width: width,
                            height: height
                        }
                    }
                    if (that.opeclass == 'addarrow') {
                        var left = (e.clientX - that.canvas.getBoundingClientRect().left)*2;
                        var top = (e.clientY - that.canvas.getBoundingClientRect().top)*2;
                        that.imgopeinfo.arrow.push({
                            fromX: startpos.left,
                            fromY: startpos.top,
                            toX: left,
                            toY: top,
                            theta: 45,
                            headlen: 15,
                            width: 3,
                            color: that.fontstyle.fillStyle
                        })
                        that.redrawimg();
                    }
                }
                mousedown = false;
            })

            $(".fontsizeselect").change(function(e) {
                that.fontstyle.font = $(".fontsizeselect option:selected").val() + ' 微软雅黑';
                $("#text").css({ "font-size": $(".fontsizeselect option:selected").text() });
            })

        },
        drawArrow: function(fromX, fromY, toX, toY, theta, headlen, width, color) {
            var ctx = this.ctx;
            var theta = theta || 30,
                headlen = headlen || 10,
                width = width || 1,
                color = color || '#000',
                angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
                angle1 = (angle + theta) * Math.PI / 180,
                angle2 = (angle - theta) * Math.PI / 180,
                topX = headlen * Math.cos(angle1),
                topY = headlen * Math.sin(angle1),
                botX = headlen * Math.cos(angle2),
                botY = headlen * Math.sin(angle2);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = width;
            ctx.beginPath();
            var arrowX, arrowY;
            ctx.moveTo(fromX, fromY);
            // ctx.lineTo(toX>fromX?toX-3:toX+3, (toY*(toX>fromX?toX-3:toX+3)/toX));
            ctx.lineTo(toX, toY);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            arrowX = toX + topX;
            arrowY = toY + topY;
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            ctx.lineTo(arrowX, arrowY);
            ctx.fill();
            ctx.restore();
        },
        addbtns: function() {
            var btnhtml = `<div class='imgbtns processimg'><div class="customopelist">
                <a class='clip sprite' id='clip' title="裁剪"></a>
                <a class='addselection sprite' id='addselection' title="矩形"></a>
                <a class='addword sprite' id='addword' title="文字"></a>
                <a class='addarrow sprite' id='addarrow' title="箭头"></a>
                <a class='save sprite' id='save' title="保存"></a>
                <a class='clearall sprite' id='clearall' title="取消"></a>
                </div>
                <div class='textstyle clearfix'>
                    <div class='selectdiv fl'>
                        <select class="fontsizeselect">
                            <option value='24px'>12</option>
                            <option value='28px'>14</option>
                            <option value='32px'>16</option>
                            <option value='36px'>18</option>
                            <option value='40px'>20</option>
                            <option value='48px'>24</option>
                            <option value='56px'>28</option>
                            <option value='60px'>30</option>
                        </select>
                    </div>
                    <div class="fl currentcolor">
                        <span class="curcolor"></span>
                    </div>
                    <div class="fl colorlist clearfix">
                        <span data-color="#ff0000" style='background:#ff0000'></span>
                        <span data-color="#0000ff" style='background:#0000ff'></span>
                        <span data-color="#00ff00" style='background:#00ff00'></span>
                        <span data-color="#ffff00" style='background:#ffff00'></span>
                        <span data-color="#ffffff" style='background:#ffffff'></span>
                        <span data-color="#000000" style='background:#000000'></span>
                        <span data-color="#ccc" style='background:#ccc'></span>
                        <span data-color="#811616" style='background:#811616'></span>
                        <span data-color="#162f81" style='background:#162f81'></span>
                        <span data-color="#45ac13" style='background:#45ac13'></span>
                        <span data-color="#e823cf" style='background:#e823cf'></span>
                        <span data-color="#c9c3c8" style='background:#c9c3c8'></span>
                    </div>
                </div>
            </div>`
            this.$el.append(btnhtml);
            this.getopeclass();
        },
        getopeclass: function() {
            var that = this;
            $(".imgbtns").click(function(e) {
                e.stopPropagation();
                var $target = $(e.target);
                var id = $target.attr('id');
                if (id) {
                    $(".textstyle").hide();
                    if (id=='clearall') {
                        that.imgopeinfo.rect = [];
                        that.imgopeinfo.text = [];
                        that.imgopeinfo.arrow = [];
                        that.redraworiginimg(that.imginfo.img);
                    }
                    if(id=='save'){
                        var imgsrc=that.canvas.toDataURL("image/png",1);
                        if(that.option.save && typeof that.option.save =='function'){
                            that.option.save(imgsrc);
                        }
                    }
                    if(id=='addselection'){
                        $(".textstyle").show();
                        $(".textstyle .selectdiv").hide();
                    }
                    if(id=='addword'){
                        $(".textstyle").show();
                        $(".textstyle .selectdiv").show();
                    }
                    if(id=='addarrow'){
                        $(".textstyle").show();
                        $(".textstyle .selectdiv").hide();
                    }
                    if ($target.hasClass('on')) {
                        $target.removeClass('on')
                        that.opeclass = "";
                    } else {
                        that.$el.children('.on').removeClass('on');
                        $target.addClass('on');
                        that.opeclass = id;
                    }
                } else if ($target.parent('.colorlist').length > 0) {
                    var color = $target.attr('data-color');
                    that.fontstyle.fillStyle = color;
                    $("#text").css({ color: color });
                    $(".curcolor").css({ background: color });
                }
            })
            $(".confirm>span").click(function(e) {
                var id = $(e.currentTarget).attr('id');
                if (id == 'confirm') {
                    if (that.opeclass == 'addselection') {
                        that.imgopeinfo.rect.push(that.recttemp);
                    }
                    if (that.opeclass == 'clip') {
                        that.doclip();
                    }
                    if (that.opeclass == 'addword') {
                        that.ctx.save();
                        that.ctx.font = '32px 微软雅黑';
                        that.ctx.fillStyle = 'red';
                        that.ctx.textBaseline = 'top';
                        that.ctx.fillText($("#text").val(), parseInt($("#text").css('left')), parseInt($("#text").css('top')));
                        that.ctx.restore();
                        that.imgopeinfo.text.push({
                            x: parseInt($("#text").css('left'))*2,
                            y: parseInt($("#text").css('top'))*2,
                            text: $("#text").val(),
                            font: that.fontstyle.font,
                            fillStyle: that.fontstyle.fillStyle
                        })
                        that.opeclass = '';
                        $("#text").val('').hide();
                    }
                }
                that.redrawimg();
                $(".confirm").hide();
            })
        },
        doclip: function() {
            var that = this;
            that.imgopeinfo.clip = that.recttemp;
            var canvaspro = that.size.width / that.size.height;
            var sx = that.recttemp.x - that.imginfo.dx < 0 ? 0 : (that.recttemp.x - that.imginfo.dx);
            var sy = that.recttemp.y - that.imginfo.dy < 0 ? 0 : (that.recttemp.y - that.imginfo.dy);

            var imgwidth = that.recttemp.width;
            var imgheight = that.recttemp.height;

            var scale = 1;
            if (that.imginfo.swidth / that.imginfo.sheight > canvaspro) {
                scale = that.imginfo.swidth / that.size.width;
            } else {
                scale = that.imginfo.sheight / that.size.height;
            }
            imgheight = scale * imgheight
            imgwidth = scale * imgwidth
            sx = scale * sx + that.imginfo.sx;
            sy = scale * sy + that.imginfo.sy;
            var dx = 0;
            var dy = 0;
            var dWidth = that.size.width;
            var dHeight = that.size.height;
            if (imgwidth / imgheight > canvaspro) {
                dy = (that.size.height - that.size.width * imgheight / imgwidth) / 2;
                dHeight = that.size.width * imgheight / imgwidth;
            } else {
                dx = (that.size.width - that.size.height * imgwidth / imgheight) / 2;
                dWidth = that.size.height * imgwidth / imgheight;
            }
            that.imginfo = {
                img: that.imginfo.img,
                scale: scale * that.imginfo.scale,
                imgwidth: that.imginfo.imagewidth,
                imgheight: that.imginfo.imgheight,
                sx: sx,
                sy: sy,
                swidth: imgwidth,
                sheight: imgheight,
                dx: dx,
                dy: dy,
                dWidth: dWidth,
                dHeight: dHeight
            };

            that.resetselection();
        },
        resetselection: function() {
            this.imgopeinfo.rect = [];
            this.imgopeinfo.text = [];
        },
        loadimg: function(url) {
            var that = this;
            var img = new Image();
            img.src = url;
            img.onload = function() {
                that.redraworiginimg(img);
            }
        },
        redrawimg: function() {
            that = this;
            that.ctx.clearRect(0, 0, that.size.width, that.size.height);
            that.redrawimgonly();
            if (that.imgopeinfo.rect.length > 0) {
                that.ctx.fillStyle = 'rgba(' + 0 + ',0,0,' + 0.5 + ')';
                that.ctx.fillRect(0, 0, that.size.width, that.size.height);
                that.imgopeinfo.rect.forEach(function(ele) {
                    that.ctx.save();
                    that.ctx.beginPath();
                    that.ctx.rect(ele.x, ele.y, ele.width, ele.height);
                    that.ctx.clip();
                    that.redrawimgonly();
                    that.ctx.strokeStyle = ele.strokeStyle;
                    that.ctx.lineWidth = 4;
                    that.ctx.strokeRect(ele.x, ele.y, ele.width, ele.height);
                    that.ctx.closePath();
                    that.ctx.restore();
                })
            }
            that.imgopeinfo.text.forEach(function(ele) {
                that.ctx.save();
                that.ctx.font = ele.font;
                that.ctx.fillStyle = ele.fillStyle;
                that.ctx.textBaseline = 'top';
                that.ctx.fillText(ele.text, ele.x, ele.y);
                that.ctx.restore();
            })
            that.imgopeinfo.arrow.forEach(function(ele) {
                that.drawArrow(ele.fromX, ele.fromY, ele.toX, ele.toY, ele.theta, ele.headlen, ele.width, ele.color)
            })

        },
        redrawimgonly: function() {
            var that = this;
            that.ctx.drawImage(that.imginfo.img, that.imginfo.sx, that.imginfo.sy, that.imginfo.swidth, that.imginfo.sheight, that.imginfo.dx, that.imginfo.dy, that.imginfo.dWidth, that.imginfo.dHeight);
        },
        redraworiginimg: function(img) {
            var that = this;
            var imgwidth = img.width;
            var imgheight = img.height;
            var canvaspro = that.size.width / that.size.height;
            var dx = 0;
            var dy = 0;
            var dWidth = that.size.width;
            var dHeight = that.size.height;
            if (imgwidth / imgheight > canvaspro) {
                dy = (that.size.height - that.size.width * imgheight / imgwidth) / 2;
                dHeight = that.size.width * imgheight / imgwidth;
            } else {
                dx = (that.size.width - that.size.height * imgwidth / imgheight) / 2;
                dWidth = that.size.height * imgwidth / imgheight;
            }
            that.imginfo = {
                img: img,
                scale: 1,
                imgwidth: imgwidth,
                imgheight: imgheight,
                sx: 0,
                sy: 0,
                swidth: imgwidth,
                sheight: imgheight,
                dx: dx,
                dy: dy,
                dWidth: dWidth,
                dHeight: dHeight
            };
            that.redrawimgonly();
        }


    }
    root.ProcessImg = ProcessImg;
})(window)