function createShader(gl,type,source){

            //创建一个shader
   			var shader=gl.createShader(type);

            //为这个shader添加数据源
   			gl.shaderSource(shader,source);

            //编译shader
   			gl.compileShader(shader);

            //获取着色器的参数
   			var success=gl.getShaderParameter(shader,gl.COMPILE_STATUS);
   			if(success){
               //返回着色器
   				return shader;
   			}
   			console.log(gl.getShaderInfoLog(shader));
   			gl.deleteShader(shader);
   		}

         //获取顶点着色器内容
   		var vertexShaderSource=document.getElementById("vertex-shader").text;

         //获取片段着色器内容
   		var fragmentShaderSource=document.getElementById("fragment-shader").text;

         //创建顶点着色器
   		var vertexShader=createShader(gl,gl.VERTEX_SHADER,vertexShaderSource);

         //创建片段着色器
   		var fragmentShader=createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);

   		function createProgram(gl,vertexShader,fragmentShader){

            //创建着色程序
   			var program=gl.createProgram();

            //添加定义好的顶点着色器和片段着色器
   			gl.attachShader(program,vertexShader);
   			gl.attachShader(program,fragmentShader);

            //将顶点着色器和片段着色器链接到一起
   			gl.linkProgram(program);
   			var success=gl.getProgramParameter(program,gl.LINK_STATUS);
   			if(success){
   				return program;
   			}
   			console.log(gl.getProgramInfoLog(program));
   			gl.deleteProgram(program);
   		}

         //创建着色器程序
   		var program=createProgram(gl,vertexShader,fragmentShader);


      if(gl){
      
      
         //为着色器添加一个属性,属性和uniform的区别在于，这个属性的值是一大段值，而uniform就是一个变量，可以说就是个二维三维或四维数组，这是一个常量，每次读取的都一样，而属性是每次读取几个值，依次往后读取
      var positionAttributeLocation=gl.getAttribLocation(program,"a_position");

         //为着色器添加另一个属性
         var resolutionUniformLocation=gl.getUniformLocation(program, "u_resolution");
         var colorUniformLocation=gl.getUniformLocation(program, "u_color");

         //创建一个缓冲区
         var positionBuffer=gl.createBuffer();

         //绑定缓冲区https://www.cnblogs.com/dbylk/p/4492306.html
         gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);


         //以下代码为渲染代码，次次执行
         //定义数据
         var positions=[
            0,0,
            100,100,
            100,0,
            0,100,
            0,0,
            100,100,
         ];

         //向缓冲区存放数据
         gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW);


         //设置canvas可视区尺寸
         gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
         gl.clearColor(255,255,255,1);
         gl.clear(gl.COLOR_BUFFER_BIT);

         //应用着色程序
         gl.useProgram(program);
         //启用定义的属性
         gl.enableVertexAttribArray(positionAttributeLocation);
         // 将绑定点绑定到缓冲数据（positionBuffer）
         gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);


         var size=2;
         var type=gl.FLOAT;
         var normalize=false;
         var stride=0;
         var offset=0;

         //将以上定义的各个属性绑定到positionAttributeLocation,这是变量绑定，所以可以绑定多个属性啦
         gl.vertexAttribPointer(positionAttributeLocation,size,type,normalize,stride,offset);

         //将设置着色器的全局变量uniform,uniform2f是2维,uniform4f是4维
         gl.uniform2f(resolutionUniformLocation,gl.canvas.width,gl.canvas.height);
         gl.uniform4f(colorUniformLocation,Math.random(),Math.random(),Math.random(),1);
         //片元着色器的类型，此为三角形
         var primitiveType=gl.TRIANGLES;
         var offset=0;
         //顶点着色器运行次数，由于图元类型是三角形，所以顶点着色器每执行3次，片元着色器会执行一次
         var count=6;
         gl.drawArrays(primitiveType  ,offset,count);
         
   }