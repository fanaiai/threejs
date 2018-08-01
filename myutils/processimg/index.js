(function(root) {
    var defaultoption = {clearcolor:'#fff'};

    function ProcessImg(el, option) {
        this.$el = $(el);
        $(el).css('position', 'relative')
        this.size = { width: this.$el.width() * 2, height: this.$el.height() * 2 };
        this.option = $.extend(true, defaultoption, option);
        this.imgopeinfo = {
            "rect": [],
            "text": [],
            "arrow": []
        };
        this.fontstyle = {
            font: '32px 微软雅黑',
            fillStyle: '#ff0000',
            strokeWidth:4
        }
        this.init();
    }
    ProcessImg.prototype = {
        init: function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            $(this.canvas).css({ width: this.size.width / 2, height: this.size.height / 2, "background": "#fff" })
            this.ctx = this.canvas.getContext('2d');
            this.$el.html(this.canvas);
            this.confirm = '<div class="processimg confirm"><span data-id="confirm" class="sprite confirmbtn"></span><span data-id="cancel" class="sprite cancelbtn"></span></div>';
            this.text = '<input type="text" class="processimg text"></input>';
            this.$el.append(this.confirm);
            this.$el.append(this.text);
            this.opeclass = '';
            this.addbtns();
            this.addevents();
            this.initcolorpicker();
        },
        initcolorpicker:function(){
            
        },
        addbtns: function() {
            this.btnhtml = `<div class='imgbtns processimg'><div class="customopelist">
                <a class='clip sprite' data-id='clip' title="裁剪"></a>
                <a class='addselection sprite' data-id='addselection' title="矩形"></a>
                <a class='addword sprite' data-id='addword' title="文字"></a>
                <a class='addarrow sprite' data-id='addarrow' title="箭头"></a>
                <a class='save sprite' data-id='save' title="保存"></a>
                <a class='clearall sprite' data-id='clearall' title="取消"></a>
                </div>
                <div class='textstyle clearfix'>
                    <div class='linewidthdiv fl'>
                        <span data-width="2" class="linewidth2"></span>
                        <span data-width="4" class="linewidth4 on"></span>
                        <span data-width="8" class="linewidth8"></span>
                    </div>
                    <div class='selectdiv fl'>
                        <select class="fontsizeselect">
                            <option value='24px'>12</option>
                            <option value='28px'>14</option>
                            <option value='32px' selected>16</option>
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
                <div class="colorpicker">
                    <canvas></canvas>
                </div>
            </div>`
            this.$el.append(this.btnhtml);
            this.addopeevents();
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
                    startpos.left = (e.clientX - that.canvas.getBoundingClientRect().left) * 2;
                    startpos.top = (e.clientY - that.canvas.getBoundingClientRect().top) * 2;
                    if (that.opeclass == 'addword') {
                        that.$el.find(".text").css({ top: startpos.top / 2 + 'px', left: startpos.left / 2 + 'px' }).show(100, function() {
                            that.$el.find(".text").focus();
                            that.$el.find(".confirm").css({ 'top': startpos.top / 2 + 'px', 'left': startpos.left / 2 + 100 + 'px' }).show();
                            addingtext = true;
                        });
                    }
                }
            })

            $(document).mousemove(function(e) {
                if (mousedown && (that.opeclass == 'addselection' || that.opeclass == 'clip')) {
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left) * 2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top) * 2;
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
                        that.ctx.lineWidth = that.fontstyle.strokeWidth;
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
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left) * 2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top) * 2;
                    that.drawArrow(startpos.left, startpos.top, left, top, 45, that.fontstyle.strokeWidth*5, that.fontstyle.strokeWidth, that.fontstyle.fillStyle);
                }
            })
            $(document).mouseup(function(e) {
                if (mousedown) {
                    var left = (e.clientX - that.canvas.getBoundingClientRect().left) * 2;
                    var top = (e.clientY - that.canvas.getBoundingClientRect().top) * 2;
                    var width = left - startpos.left;
                    var height = top - startpos.top;
                    if (that.opeclass == 'addselection' || that.opeclass == 'clip') {
                        that.$el.find(".confirm").css({ 'top': top / 2 + 'px', 'left': left / 2 + 'px' }).show();
                        that.recttemp = {
                            strokeStyle: that.fontstyle.fillStyle,
                            strokeWidth:that.fontstyle.strokeWidth,
                            x: startpos.left,
                            y: startpos.top,
                            width: width,
                            height: height
                        }
                    }
                    if (that.opeclass == 'addarrow') {
                        var left = (e.clientX - that.canvas.getBoundingClientRect().left) * 2;
                        var top = (e.clientY - that.canvas.getBoundingClientRect().top) * 2;
                        that.imgopeinfo.arrow.push({
                            fromX: startpos.left,
                            fromY: startpos.top,
                            toX: left,
                            toY: top,
                            theta: 45,
                            headlen: that.fontstyle.strokeWidth*5,
                            width: that.fontstyle.strokeWidth,
                            color: that.fontstyle.fillStyle
                        })
                        that.redrawimg();
                    }
                }
                mousedown = false;
            })

            that.$el.find(".fontsizeselect").change(function(e) {
                that.fontstyle.font = that.$el.find(".fontsizeselect option:selected").val() + ' 微软雅黑';
                that.$el.find(".text").css({ "font-size": that.$el.find(".fontsizeselect option:selected").text()+"px" });
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

        addopeevents: function() {
            var that = this;
            this.$el.children('.imgbtns').click(function(e) {
                e.stopPropagation();
                var $target = $(e.target);
                var id = $target.attr('data-id');
                if (id) {
                    that.$el.find(".text").hide();
                    that.$el.children('.confirm').hide();
                    that.$el.find(".textstyle").hide();
                    if ($target.hasClass('on')) {
                        $target.removeClass('on')
                        that.opeclass = "";
                        return;
                    }
                    that.$el.find('.customopelist>.on').removeClass('on');
                    $target.addClass('on');
                    that.opeclass = id;
                    if (id == 'clearall') {
                        that.imgopeinfo.rect = [];
                        that.imgopeinfo.text = [];
                        that.imgopeinfo.arrow = [];
                        that.redraworiginimg(that.imginfo.img);
                        that.$el.find('.customopelist>.on').removeClass('on');
                    }
                    if (id == 'save') {
                        var imgsrc = that.canvas.toDataURL("image/png", 1);
                        if (that.option.save && typeof that.option.save == 'function') {
                            that.option.save(imgsrc);
                        }
                    }
                    if (id == 'addselection') {
                        that.$el.find(".textstyle").show();
                        that.$el.find(".textstyle .selectdiv").hide();
                        that.$el.find(".textstyle .linewidthdiv").show();
                    }
                    if (id == 'addword') {
                        that.$el.find(".text").show();
                        that.$el.find(".textstyle").show();
                        that.$el.find(".textstyle .selectdiv").show();
                        that.$el.find(".textstyle .linewidthdiv").hide();
                    }
                    if (id == 'addarrow') {
                        that.$el.find(".textstyle").show();
                        that.$el.find(".textstyle .selectdiv").hide();
                        that.$el.find(".textstyle .linewidthdiv").show();
                    }

                } 
                else if ($target.parent('.colorlist').length > 0) {
                    var color = $target.attr('data-color');
                    that.fontstyle.fillStyle = color;
                    that.$el.find(".text").css({ color: color });
                    that.$el.find(".curcolor").css({ background: color });
                }
                else if ($target.parent('.linewidthdiv').length > 0) {
                    var width = $target.attr('data-width');
                    that.fontstyle.strokeWidth = width;
                    $target.addClass('on');
                    $target.siblings('.on').removeClass('on');
                }
                that.redrawimg();
            })
            this.$el.children('.confirm').children('span').click(function(e) {
                var id = $(e.currentTarget).attr('data-id');
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
                        that.ctx.fillText(that.$el.find(".text").val(), parseInt(that.$el.find(".text").css('left')), parseInt(that.$el.find(".text").css('top')));
                        that.ctx.restore();
                        that.imgopeinfo.text.push({
                            x: parseInt(that.$el.find(".text").css('left')) * 2,
                            y: parseInt(that.$el.find(".text").css('top')) * 2,
                            text: that.$el.find(".text").val(),
                            font: that.fontstyle.font,
                            fillStyle: that.fontstyle.fillStyle
                        })
                        that.opeclass = '';
                        that.$el.find(".text").val('').hide();
                    }
                }
                that.redrawimg();
                that.$el.find(".text").hide();
                that.$el.children('.confirm').hide();
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
                    that.ctx.lineWidth = ele.strokeWidth;
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
            that.ctx.clearRect(0, 0, that.size.width, that.size.height);
            that.ctx.save();
            that.ctx.fillStyle=that.option.clearcolor;
            that.ctx.fillRect(0, 0, that.size.width, that.size.height);
            that.ctx.restore();
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