(function(root) {
    var defaultoption = {};

    function ProcessImg(el, option) {
        this.$el = $(el);
        this.size = { width: this.$el.width(), height: this.$el.height() };
        this.option = $.extend(true, defaultoption, option);
        this.imgopeinfo = {
            "clip": { x: 0, y: 0, width: 0, height: 0 },
            "rect": [{ x: 0, y: 0, width: 0, height: 0 }],
            "text": [{ x: 0, y: 0, font: '16px 微软雅黑', fillStyle: 'blue', 'text': '哈哈哈哈' }]
        };
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

        },
        addbtns: function() {
            var btnhtml = "<div class='imgbtns'><a class='clip sprite' id='clip'></a><a class='addselection sprite' id='addselection'></a><a class='addword sprite' id='addword'></a><a class='clearall sprite' id='clearall'></a></div>"
            this.$el.append(btnhtml);
            this.getopeclass();
        },
        getopeclass: function() {
            var that = this;
            $(".imgbtns>a").click(function(e) {
                var id = $(e.currentTarget).attr('id');
                that.opeclass = id;

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
                            font: '16px 微软雅黑',
                            fillStyle: 'red'
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
            var sx = that.recttemp.x-that.imginfo.dx<0?0:(that.recttemp.x-that.imginfo.dx);
            var sy = that.recttemp.y-that.imginfo.dy<0?0:(that.recttemp.y-that.imginfo.dy);
            console.log(that.recttemp.y,that.imginfo.dy)
            var imgwidth = that.recttemp.width-that.imginfo.dx;
            var imgheight = that.recttemp.height-that.imginfo.dy;
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
                img: that.imginfo.img,
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