(function(root) {
    var options = {
        A: 20,
        vec: 30,
        width:300,
        height:100,
        dnasegments:10,
        dnanum:8,
        dnaradius:4.5
    }
    function DNA(ele, option) {
        this.options = $.extend(true, options, option);
        this.scene = new THREE.Scene();
        // this.camera = new THREE.OrthographicCamera(75, this.options.width / this.options.height, 0.1, 1000);
        this.camera=new THREE.OrthographicCamera( this.options.width / - 2, this.options.width / 2, this.options.height / 2, this.options.height / - 2, 1, 1000 );
        this.camera.position.z = 50;
        this.dnas = new THREE.Group();
        this.text;
        this.renderer = new THREE.WebGLRenderer({ antialias: true ,alpha:true});
        this.renderer.setSize(this.options.width, this.options.height);
        // this.renderer.setClearColor(new THREE.Color('rgb(255, 255, 255)'));
        $(ele).append(this.renderer.domElement);
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(0, 0, 4);
        this.scene.add(this.light);
        this.animattime=0;
        this.init();
    }
    DNA.prototype = {
        init: function() {
            this.addDnas();
            this.addText();
        },
        addDnas: function() {
            var colors0 = [0x00a50b, 0x45aee7];
            var colors1 = [0xaa46ca, 0xee1a27];
            for (var i = 0; i <= 80; i = i + Math.ceil(80/this.options.dnanum)) {
                var x = i - 40;
                var y0 = this.options.A * Math.sin((i * Math.PI) / 40);
                var y1 = this.options.A * Math.sin((i * Math.PI) / 40) * Math.cos(Math.PI) + this.options.A * Math.cos((i * Math.PI) / 40) * Math.sin(Math.PI);
                var geometry = new THREE.SphereBufferGeometry(this.options.dnaradius, this.options.dnasegments, this.options.dnasegments);
                var material0 = new THREE.MeshBasicMaterial({ color: colors0[(i/ Math.ceil(80/this.options.dnanum)) % 2], wireframe: true });
                var material1 = new THREE.MeshBasicMaterial({ color: colors1[(i/ Math.ceil(80/this.options.dnanum)) % 2], wireframe: true });
                var dna0 = new THREE.Mesh(geometry, material0);
                var dna1 = new THREE.Mesh(geometry, material1);
                dna0.position.x = x;
                dna1.position.x = x;
                dna0.position.y = y0;
                // dna0.position.z=y0;
                dna1.position.y = y1;
                // dna1.position.z=y1;
                dna0.name = i + 'c';
                dna1.name = i + 'd';
                this.dnas.add(dna0.clone());
                this.dnas.add(dna1.clone());
            }
            this.scene.add(this.dnas);
            requestAnimationFrame(this.startMoveDna.bind(this));
        },
        addText:function(){
            that=this;
                var texture=new THREE.TextureLoader().load('loading.png',function(map){
                var geometry = new THREE.CylinderBufferGeometry( 25, 25, 30, 32 );
                var material0 = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false,map: map,transparent: true, side: THREE.DoubleSide});
                that.text = new THREE.Mesh(geometry, material0);
                that.scene.add(that.text);
                requestAnimationFrame(that.startMoveText.bind(that));
                })
        },
        startMoveDna: function() {
            var that=this;
            that.animattime++;
            requestAnimationFrame(this.startMoveDna.bind(this));
            that.dnas.children.forEach(function(dna) {
                if (dna.name.indexOf('d') > -1) {
                    var i = parseInt(dna.name);
                    dna.position.y = that.options.A * Math.sin((i * Math.PI) / 40 + Math.PI) * Math.cos(Math.PI * that.animattime / (that.options.vec)) + that.options.A * Math.cos((i * Math.PI) / 40 + Math.PI) * Math.sin(Math.PI * that.animattime / (that.options.vec));
                } else {
                    var i = parseInt(dna.name);
                    dna.position.y = that.options.A * Math.sin((i * Math.PI) / 40) * Math.cos(Math.PI * that.animattime / (that.options.vec)) + that.options.A * Math.cos((i * Math.PI) / 40) * Math.sin(Math.PI * that.animattime / (that.options.vec));
                }
                dna.rotation.x += 0.1;
            })
            this.renderer.render(this.scene, this.camera);
        },
        startMoveText:function(){
            var that=this;
            requestAnimationFrame(this.startMoveText.bind(this));
            that.text.rotation.y-=0.05;
            this.renderer.render(this.scene, this.camera);
        }
    }
    root.DNA=DNA;
})(window)