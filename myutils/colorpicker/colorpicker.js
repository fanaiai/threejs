(function(root) {
    var defaultoption = {
        shape: 'rect'
    };

    function ColorPicker(el, option) {
        this.$el = $(el);
        $(el).css('position', 'relative')
        this.size = { width: this.$el.width() * 2, height: this.$el.height() * 2 };
        this.option = $.extend(true, defaultoption, option);
        this.position={
            huebar:{x0:this.size.width*9.48/10, y0:10,x1:this.size.width*1.04/10,y1:15},
            hue:{x0:this.size.width*9.5/10, y0:0, x1:this.size.width/10, y1:this.size.height/2},
            lightsat:{x0:0, y0:0, x1:this.size.width*9.2/10, y1:this.size.height/2},
            opacity:{x0:0,y0:this.size.height*1.02/2,x1:this.size.width,y1:20},
            opacitybar:{x0:0, y0:this.size.height*1.02/2-4,x1:15,y1:this.size.height*1.02/2+24},
            cur:{x0:0,y0:30+this.size.height*1.02/2,x1:this.size.height/3,y1:this.size.height/3}
        };
        this.posinfo={
            color:[255,0,0,255],
            hue:[255,0,0,255]
        }
        this.init();
        
    }
    ColorPicker.prototype = {
        init: function() {
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.size.width;
            this.canvas.height = this.size.height;
            $(this.canvas).css({ width: this.size.width / 2, height: this.size.height / 2, "background": "#fff" })
            this.ctx = this.canvas.getContext('2d');
            this.$el.html(this.canvas);
            this.initpicker();
        },
        initpicker: function() {
            if (this.option.shape == 'rect') {
                this.addrectpicker();
                this.addevents();
            } else {

            }
        },
        addevents:function(){
            var that=this;
            var mousedown=false;
            $(document).mousedown(function(e){
                var $target=$(e.target);
                if($target[0]==that.canvas){
                    mousedown=true;
                }
            })
            $(document).mousemove(function(e){
                var $target=$(e.target);
                if(mousedown && $target[0]==that.canvas){
                    var mousepos={
                        x:(e.clientX - that.canvas.getBoundingClientRect().left) * 2,
                        y:(e.clientY - that.canvas.getBoundingClientRect().top) * 2
                    };
                    var posinfo=that.checkposition(mousepos);
                    if(posinfo.type=='hue'){
                        that.position.huebar.y0=mousepos.y;
                        that.posinfo.hue=posinfo.color;
                    }
                    that.addrectpicker();
                }
            })
            $(document).mouseup(function(e){
                var $target=$(e.target);
                    mousedown=false;
            })
        },
        checkposition:function(mousepos){
            var that=this;
            Object.keys(this.position).forEach(function(ele){
                if(mousepos.x>=that.position[ele].x0 && mousepos.y>=that.position[ele].y0 && mousepos.x<=that.position[ele].x0+that.position[ele].x1 && mousepos.y<=that.position[ele].y0+that.position[ele].y1){
                    that.posinfo.type=ele;
                    that.posinfo.color=that.ctx.getImageData(mousepos.x,mousepos.y,1,1).data;
                }
            })
            return this.posinfo;
        },
        addrectpicker: function() {
            this.ctx.clearRect(0,0,this.size.width,this.size.height);
            this.addrecthue();
            this.addrectlightsat();
            this.addopacitybar();
            this.addrectcurcolor();
        },
        addrectcurcolor:function(){
            this.ctx.save();
            this.ctx.fillStyle="rgba("+this.posinfo.color[0]+","+this.posinfo.color[1]+","+this.posinfo.color[2]+","+this.posinfo.color[3]/255+")";
            this.ctx.fillRect(this.position.cur.x0,this.position.cur.y0,this.position.cur.x1,this.position.cur.y1);
            this.ctx.restore();
        },
        addopacitybar:function(){
            this.ctx.save();
            var grd2 = this.ctx.createLinearGradient(0, 0,this.position.opacity.x1,0);
            grd2.addColorStop(0, "rgba("+this.posinfo.color[0]+","+this.posinfo.color[1]+","+this.posinfo.color[2]+",0)");
            grd2.addColorStop(1, "rgba("+this.posinfo.color[0]+","+this.posinfo.color[1]+","+this.posinfo.color[2]+",1)");
            this.ctx.fillStyle = grd2;
            this.ctx.fillRect(this.position.opacity.x0,this.position.opacity.y0,this.position.opacity.x1,this.position.opacity.y1);

            this.ctx.beginPath();
            this.ctx.lineCap="round";
            this.ctx.strokeStyle="rgba(0,0,0,.6)";
            this.ctx.fillStyle="red";
            this.ctx.lineWidth=this.position.opacitybar.x1;
            this.ctx.moveTo(this.position.opacitybar.x0,this.position.opacitybar.y0);
            this.ctx.lineTo(this.position.opacitybar.x0+this.position.opacitybar.x1,this.position.opacitybar.y0);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.restore();
        },
        addrecthue:function(){
            this.ctx.save();
            var grd2 = this.ctx.createLinearGradient(0, 0,0 ,this.position.hue.y1);
            grd2.addColorStop(0, "rgb(255,0,0)");
            grd2.addColorStop(1 / 6, "rgb(255,255,0)");
            grd2.addColorStop(1 / 3, "rgb(0,255,0)");
            grd2.addColorStop(1 / 2, "rgb(0,255,255)");
            grd2.addColorStop(2 / 3, "rgb(0,0,255)");
            grd2.addColorStop(5 / 6, "rgb(255,0,255)");
            grd2.addColorStop(1, "rgb(255,0,0)");
            this.ctx.fillStyle = grd2;
            this.ctx.fillRect(this.position.hue.x0,this.position.hue.y0,this.position.hue.x1,this.position.hue.y1);

            this.ctx.beginPath();
            this.ctx.lineCap="round";
            this.ctx.strokeStyle="rgba(0,0,0,.6)";
            this.ctx.fillStyle="red";
            this.ctx.lineWidth=this.position.huebar.y1;
            this.ctx.lineWidth=this.position.huebar.y1;
            this.ctx.moveTo(this.position.huebar.x0,this.position.huebar.y0);
            this.ctx.lineTo(this.position.huebar.x0+this.position.huebar.x1,this.position.huebar.y0);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        },
        addrectlightsat:function(){
            this.ctx.save();
            var grd2 = this.ctx.createLinearGradient(0,0,0,this.position.lightsat.y0+this.position.lightsat.y1);
            grd2.addColorStop(0, "rgb(255,255,255)");
            grd2.addColorStop(1, "rgb("+this.posinfo.hue[0]+","+this.posinfo.hue[1]+","+this.posinfo.hue[2]+")");
            this.ctx.fillStyle = grd2;
            this.ctx.fillRect(this.position.lightsat.x0,this.position.lightsat.y0,this.position.lightsat.x1,this.position.lightsat.y1);
            var grd3 = this.ctx.createLinearGradient(0,0,this.position.lightsat.x0+this.position.lightsat.x1,this.position.lightsat.y0+this.position.lightsat.y1);
            grd3.addColorStop(0, "rgba(0,0,0,0)");
            grd3.addColorStop(1, "rgba(0,0,0,1)");
            this.ctx.fillStyle = grd3;
            this.ctx.fillRect(this.position.lightsat.x0,this.position.lightsat.y0,this.position.lightsat.x1,this.position.lightsat.y1);
            this.ctx.restore();
        },
        _calcHue:function(rgb){
            var R=rgb[0];
            var G=rgb[1];
            var B=rgb[2];
            var max=R<G?(G<B?{key:'B',val:B}:{key:'G',val:G}):(R<B?{key:'B',val:B}:{key:'R',val:R});
            var min=R>G?(G>B?{key:'B',val:B}:{key:'G',val:G}):(R>B?{key:'B',val:B}:{key:'R',val:R});
            var top,H;
            var bottom=max.val-min.val;
            if(max.key=='R'){
                H=(G-B)/bottom;
            }
            else if(max.key=='G'){
                H=2+(B-R)/bottom;
            }
            else if(max.key=='B'){
                H=4+(R-G)/bottom;
            }
                H=H*60;
            if(H<0){
                H+=360
            }
            return H;
        }
    }
    root.ColorPicker = ColorPicker;
})(window)