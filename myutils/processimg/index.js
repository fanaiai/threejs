(function(root) {
    var defaultoption={};
    function ProcessImg(el,option) {
        this.$el = $(el);
        this.size={width:$el.width(),height:$el.height()};
        this.option=$.extend(true,defaultoption,option);
        this.init();
    }
    FThree.prototype = {
        init: function() {
            
        },
        loadimg:function(url){
            var img=new Image();
            img.src=url;
            img.onload=function(){
                
            }
        }

    }
    root.ProcessImg = ProcessImg;
})(window)