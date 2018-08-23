var iframeurl="http://127.0.0.1:8099/extend/"

var dom=`
	<div class="cloudiframediv">
		<iframe src=`+iframeurl+`></iframe>
	</div>
`;
$("body").append(dom);

var cssselector=new CssSelector();
var highlight=new HightLight();

