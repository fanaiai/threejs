var iframeurl="http://127.0.0.1:8099/extend/"

var dom=`
	<div class="cloudiframediv">
		<iframe src=`+iframeurl+`></iframe>
	</div>
`;
$("body").append(dom);

var cssselector=new CssSelector();
var highlight=new HightLight();
$("body").append("<div id='caiyun-root' class='caiyun-root caiyun-highlight' style='width:0;height:0'></div>");
    var rootshadow = $("#caiyun-root")[0].createShadowRoot();
    
$(document).mouseover(function(e){
	var ele=e.target;
	var sizes = hightlight.getSizes(ele);
    hightlight.addHoverShadowDom(rootshadow, sizes);
})

