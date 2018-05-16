var scene;
var stats = initStats();

function initStats() {
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
}

function initScene() {
    scene = new THREE.Scene();
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(75, $("#loading").width() / $("#loading").height(), 0.1, 1000);
    camera.position.z = 15;
}
var cube;
function addCube(){
 var geometry = new THREE.BoxGeometry( 4, 4, 4 ,4,4,4);
 var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 ,wireframe:true} );
 cube = new THREE.Mesh( geometry, material );
 scene.add( cube );
}

var renderer;

function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize($("#loading").width(), $("#loading").height());
    renderer.setClearColor(new THREE.Color('rgb(71, 75, 159)'));
    $("#loading").append(renderer.domElement);
}

var light;

function initLight() {
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 4);
    scene.add(light);
}



function initAll() {
    initScene();
    initCamera();
    initRenderer();
    addCube();
    // addItems();
    // addearchcircle();
    
    initLight();
    renderer.render(scene, camera)
}
initAll();
var up = true;

function animate() {
    requestAnimationFrame(animate);
    stats.update();
    // if(sphere.scale.y>1.5){
    //     up=false;
    // }
    // if(sphere.scale.y<1){
    //     up=true;
    // }
    // if(up){
    //     sphere.scale.y+=0.005;
    //     sphere.scale.x+=0.005;
    // }
    // else{
    //     sphere.scale.y-=0.005;
    //     sphere.scale.x-=0.005;
    // }
    // 
    // sphere.rotation.y += 0.01;
    //         // sphere.scale.x=1;
    //         // sphere.scale.y=1;
    //         // sphere.scale.z=1;
    // for(var i=0;i<items.length;i++){
    //     if(items[i].position.x>0){
    //         items[i].position.x-=0.1;
    //     }
    //     else{
    //         items[i].position.x+=0.1;
    //     }
    //     if(items[i].position.y>0){
    //         items[i].position.y-=0.1;
    //     }
    //     else{
    //         items[i].position.y+=0.1;
    //     }
    //     if(items[i].position.z>1){
    //         items[i].position.z-=0.1;
    //     }
    //     else{
    //         items[i].position.z+=0.1;
    //     }
    //     // scene.remove(earchcircle)
    //     if(Math.abs(items[i].position.x)<=5/3 || Math.abs(items[i].position.y)<=5/3){
            
    //         scene.remove(items[i])
    //         items.splice(i,1);
    //         addItem(imgpaths[Math.round(Math.random()*4)]);
    //         // scene.add(earchcircle)
            
    //     }
    // }
    cube.rotation.y+=0.05;
    cube.rotation.z+=0.05;
    cube.rotation.x+=0.05;
    renderer.render(scene, camera);
}
animate();