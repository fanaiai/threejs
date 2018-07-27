(function(root) {
    var defaultoption={};
    function ProcessImg(el,option) {
        this.$el = $(el);
        this.size={width:this.$el.width(),height:this.$el.height()};
        this.option=$.extend(true,defaultoption,option);
        this.init();
    }
    ProcessImg.prototype = {
        init: function() {
            this.canvas=document.createElement('canvas');
            this.canvas.width=this.size.width;
            this.canvas.height=this.size.height;
            this.$el.html(this.canvas);
            this.ctx=this.canvas.getContext('2d');
            this.addbtns();
            this.addevents();
        },
        addevents:function(){
            var that=this;
            var mousedown=false;
            var rect = this.canvas.getBoundingClientRect();
            var startpos={
                top:0,
                left:0
            }
            $(document).mousedown(function(e){
                var $target=$(e.target);
                console.log($target,$(that.canvas))
                if($target[0]==$(that.canvas)[0]){
                    mousedown=true;
                    startpos.left=e.clientX-rect.left;
                    startpos.top=e.clientY-rect.top;
                }
            })

            $(document).mousemove(function(e){
                if(mousedown){
                    var left=e.clientX-rect.left;
                    var top=e.clientY-rect.top;
                    var width=left-startpos.left;
                    var height=top-startpos.top;
                    that.ctx.clearRect(0,0,that.size.width,that.size.height);
                    that.redrawimg();
                    that.ctx.fillStyle='rgba(0,0,0,.4)';
                    that.ctx.rect(startpos.left,startpos.top,width,height);
                    // that.ctx.clip();
                    that.ctx.fill();
                    console.log(width,height)
                }
            })
            $(document).mouseup(function(e){
                mousedown=false})
        },
        doclip:function(){

        },
        addbtns:function(){
            var btnhtml="<div class='imgbtns'><a class='clip'>裁剪</a><a class='addselection'>添加选区</a><a class='addword'>字</a></div>"
            this.$el.append(btnhtml);
        },
        loadimg:function(url){
            var that=this;
            var img=new Image();
            img.src=url;
            img.onload=function(){
                var imgwidth=img.width;
                var imgheight=img.height;
                var canvaspro=that.size.width/that.size.height;
                var dx=0;
                var dy=0;
                var dWidth=that.size.width;
                var dHeight=that.size.height;
                if(imgwidth/imgheight>canvaspro){
                    dy=(that.size.height-that.size.width*imgheight/imgwidth)/2;
                    dHeight=that.size.width*imgheight/imgwidth;
                }
                else{
                    dx=(that.size.width-that.size.height*imgwidth/imgheight)/2;
                    dWidth=that.size.height*imgwidth/imgheight;
                }
                that.imginfo={
                    img:img,
                    dx:dx,
                    dy:dy,
                    dWidth:dWidth,
                    dHeight:dHeight
                };
                that.redrawimg();
            }
        },
        redrawimg:function(){
            that=this;
            that.ctx.drawImage(that.imginfo.img,that.imginfo.dx,that.imginfo.dy,that.imginfo.dWidth,that.imginfo.dHeight);
        }


    }
    root.ProcessImg = ProcessImg;
})(window)