(function(root) {
    var defaultoption = {};

    function ProcessImg(el, option) {
        this.$el = $(el);
        this.size = { width: this.$el.width(), height: this.$el.height() };
        this.option = $.extend(true, defaultoption, option);
        this.imgopeinfo = {
            "clip": { x: 0, y: 0, width: 0, height: 0 },
            "rect": [],
            "text": []
        };
        this.fontstyle={
            font:'16px 微软雅黑',
            fillStyle:'#ff0000'
        }
        this.init();
    }
    ProcessImg.prototype = {
        init: function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            this.$el.html(this.canvas);
            this.rect = '<div id="rect"></div>';
            this.confirm = '<div class="confirm"><span id="confirm" class="sprite"></span><span id="cancel" class="sprite"></span></div>';
            this.text = '<input type="text" id="text"></input>';
            this.$el.append(this.rect);
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
                    startpos.left = e.clientX - that.canvas.getBoundingClientRect().left;
                    startpos.top = e.clientY - that.canvas.getBoundingClientRect().top;
                    if (that.opeclass == 'addword') {
                        $("#text").css({ top: startpos.top + 'px', left: startpos.left + 'px' }).show(100, function() {
                            $("#text").focus();
                            $(".confirm").css({ 'top': startpos.top + 'px', 'left': startpos.left + 100 + 'px' }).show();
                            addingtext = true;
                        });
                    }
                }
            })

            $(document).mousemove(function(e) {
                if (mousedown && (that.opeclass == 'addselection' || that.opeclass == 'clip')) {
                    var left = e.clientX - that.canvas.getBoundingClientRect().left;
                    var top = e.clientY - that.canvas.getBoundingClientRect().top;
                    var width = left - startpos.left;
                    var height = top - startpos.top;
                    that.ctx.clearRect(0, 0, that.size.width, that.size.height);
                    that.redrawimg();
                    that.ctx.save();
                    that.ctx.beginPath();
                    that.ctx.rect(startpos.left, startpos.top, width, height);
                    that.ctx.clip();
                    that.redrawimgonly();
                    if (that.opeclass == 'addselection') {
                        that.ctx.strokeStyle = 'blue';
                        that.ctx.lineWidth = 4;
                    } else {
                        that.ctx.strokeStyle = 'red';
                        that.ctx.lineWidth = 2;
                    }
                    that.ctx.strokeRect(startpos.left, startpos.top, width, height);
                    that.ctx.closePath();
                    that.ctx.restore();
                }
            })
            $(document).mouseup(function(e) {
                if (mousedown) {
                    var left = e.clientX - that.canvas.getBoundingClientRect().left;
                    var top = e.clientY - that.canvas.getBoundingClientRect().top;
                    var width = left - startpos.left;
                    var height = top - startpos.top;
                    if (that.opeclass == 'addselection' || that.opeclass == 'clip') {
                        $(".confirm").css({ 'top': startpos.top + height + 'px', 'left': startpos.left + width + 'px' }).show();
                        that.recttemp = {
                            x: startpos.left,
                            y: startpos.top,
                            width: width,
                            height: height
                        }
                    }
                }
                mousedown = false;
            })

            $("#fontsizeselect").change(function(e){
                that.fontstyle.font=$("#fontsizeselect option:selected").val()+' 微软雅黑';
                $("#text").css({"font-size":$("#fontsizeselect option:selected").val()});
            })

        },
        addbtns: function() {
            var btnhtml = `<div class='imgbtns'><div class="customopelist"><a class='clip sprite' id='clip'></a><a class='addselection sprite' id='addselection'></a><a class='addword sprite' id='addword'></a><a class='clearall sprite' id='clearall'></a></div>
                <div class='textstyle clearfix'>
                    <div class='selectdiv fl'>
                        <select id="fontsizeselect">
                            <option value='12px'>12</option>
                            <option value='14px'>14</option>
                            <option value='16px'>16</option>
                            <option value='18px'>18</option>
                            <option value='20px'>20</option>
                            <option value='24px'>24</option>
                            <option value='28px'>28</option>
                            <option value='30px'>30</option>
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
                var $target=$(e.target);
                var id = $target.attr('id');
                if(id){
                if($target.hasClass('on')){
                    $target.removeClass('on')
                    that.opeclass = "";
                }
                else{
                    $('.on').removeClass('on');
                    $target.addClass('on');
                    that.opeclass = id;
                }}
                else if($target.parent('.colorlist').length>0){
                    var color=$target.attr('data-color');
                    that.fontstyle.fillStyle=color;
                    $("#text").css({color:color});
                    $(".curcolor").css({background:color});
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
                        that.ctx.font = '16px 微软雅黑';
                        that.ctx.fillStyle = 'red';
                        that.ctx.textBaseline = 'top';
                        that.ctx.fillText($("#text").val(), parseInt($("#text").css('left')), parseInt($("#text").css('top')));
                        that.ctx.restore();
                        that.imgopeinfo.text.push({
                            x: parseInt($("#text").css('left')),
                            y: parseInt($("#text").css('top')),
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
            var sx = that.recttemp.x-that.imginfo.dx<0?0:(that.recttemp.x-that.imginfo.dx);
            var sy = that.recttemp.y-that.imginfo.dy<0?0:(that.recttemp.y-that.imginfo.dy);
            var imgwidth = that.recttemp.width;
            var imgheight = that.recttemp.height;
            if(that.imginfo.imgwidth/that.imginfo.imgheight>canvaspro){
                imgwidth=that.imginfo.imgwidth*imgwidth/that.size.width;
                imgheight=that.imginfo.imgwidth*imgheight/that.size.width;
                sx=that.imginfo.imgwidth*sx/that.size.width;
                sy=that.imginfo.imgwidth*sy/that.size.width;
            }
            else{
                imgheight=that.imginfo.imgheight*imgheight/that.size.height
                imgwidth=that.imginfo.imgheight*imgwidth/that.size.height
                sx=that.imginfo.imgheight*sx/that.size.height
                sy=that.imginfo.imgheight*sy/that.size.height
            }
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
                imgwidth:that.imginfo.imagewidth,
                imgheight:that.imginfo.imgheight,
                sx: sx,
                sy: sy,
                swidth: imgwidth,
                sheight: imgheight,
                dx: dx,
                dy: dy,
                dWidth: dWidth,
                dHeight: dHeight
            };
        },
        loadimg: function(url) {
            var that = this;
            var img = new Image();
            img.src = url;
            img.onload = function() {
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
                    imgwidth:imgwidth,
                    imgheight:imgheight,
                    sx: 0,
                    sy: 0,
                    swidth: imgwidth,
                    sheight: imgheight,
                    dx: dx,
                    dy: dy,
                    dWidth: dWidth,
                    dHeight: dHeight
                };
                this.imgopeinfo = {
                    "clip": { x: 0, y: 0, width: imgwidth, height: imgheight },
                    "rect": [],
                    "text": []
                };
                that.redrawimgonly();
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
                    that.ctx.strokeStyle = 'blue';
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
        },
        redrawimgonly: function() {
            var that = this;
            that.ctx.drawImage(that.imginfo.img, that.imginfo.sx, that.imginfo.sy, that.imginfo.swidth, that.imginfo.sheight, that.imginfo.dx, that.imginfo.dy, that.imginfo.dWidth, that.imginfo.dHeight);
        }


    }
    root.ProcessImg = ProcessImg;
})(window)