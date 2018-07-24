(function(root) {
    function FThree(el,data) {
        this.$el = $(el);
        this.data=data;
        this.size = { width: $(el).width(), height: $(el).height() };
        this.scene = null;
        this.renderer = null;
        this.light = null;
        this.camera = null;
        this.objs = new THREE.Group();
        this.stat = this._initstat();
        this.init();
    }
    FThree.prototype = {
        init: function() {
            this._initrenderer();
            this._initscene();
            var axes=new THREE.AxisHelper(20);
            this.scene.add(axes);
            this._initcamera();
            this._initlight();

            this._addX();
            this._render();
            this._addevent();
            // this.animate();
        },
        _addX:function(){
            var geometry=new THREE.BoxBufferGeometry(this.size.width/100,0.1,1);
            var material=new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false ,side:THREE.DoubleSide} );
            var plane=new THREE.Mesh(geometry,material);
            this.objs.add(plane);

            var xtip=this.size.width/(100 * (this.data.length+1));
            var width=xtip*0.5;
            var height=50;
            this.data.forEach(function(ele,i){
                var x=(i+1)*xtip;
                var y=ele.value;
            })
            this.scene.add(plane);
        },
        _initstat: function() {
            var stats = new Stats();
            //设置统计模式
            stats.setMode(0); // 0: fps, 1: ms
            //统计信息显示在左上角
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            //将统计对象添加到对应的<div>元素中
            document.getElementById("Stats-output").appendChild(stats.domElement);
            return stats;
        },
        _initrenderer: function() {
            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setClearColor(0x040a08)
            this.renderer.setSize(this.size.width, this.size.height);
            this.renderer.shadowMap.enabled = true
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.shadowMapSoft = true;
            this.$el.append(this.renderer.domElement)
        },
        _initscene: function() {
            this.scene = new THREE.Scene();
        },
        _initcamera: function() {
            this.camera = new THREE.PerspectiveCamera(75, this.size.width / this.size.height, 0.1, 1000);
            this.camera.position.z = 15;
            this.camera.lookAt(0, 0, 0);
        },
        _initlight: function() {
            this.light = new THREE.DirectionalLight({ color: 0xffffff });
            // this.light.target = this.obj;
            this.light.castShadow = true;
            // this.light.shadowCameraVisible = true;
            this.light.shadowDarkness = 0.1;
            this.light.position.y = 5;
            // this.light.position.x = 2;
            this.light.position.z = 5;
            this.light.shadow.mapSize.width = 128
            this.light.shadow.mapSize.height = 128
            this.scene.add(this.light);
        },
        
        _addevent: function() {
            var that = this;
            var down = false;
            var position = {};
            $(document).mousedown(function(e) {
                down = true;
                position.x = e.clientX;
                position.y = e.clientY;
            })
            $(document).mousemove(function(e) {
                if (down) {
                    var x = e.clientX;
                    var y = e.clientY;
                    that.scene.rotation.y += (x - position.x) / 100;
                    that.scene.rotation.x += (y - position.y) / 100;
                    position.x = x;
                    position.y = y;
                    that._render();
                }
            })
            $(document).mouseup(function(e) {
                down = false;
            })
            document.onmousewheel = function(e) {
                if (e.deltaY > 0) {
                    that.camera.position.z += 0.3;
                } else {
                    that.camera.position.z -= 0.3;
                }
                that._render();
            }
        },
        _render: function() {
            // this.scene.rotation.x=Math.PI/4
            this.renderer.render(this.scene, this.camera)
        },
        animate: function() {
            requestAnimationFrame(this.animate.bind(this));
            this.stat.update();
            this.scene.rotation.y += 0.01;
            this._render();
        }

    }
    root.FThree = FThree;
})(window)