import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const loader = new FBXLoader();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '0';
document.body.prepend(renderer.domElement);

const navbar = document.createElement('div');
navbar.innerHTML = `
  <nav class="navbar">
    <ul>
      <li><a href="#">Home</a></li> 
    </ul>
  </nav>
`;
document.body.appendChild(navbar);

const style = document.createElement('style');
style.textContent = `
body {
    margin: 0;
    overflow: hidden;
}
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(57, 57, 57, 0.95);
    z-index: 10000;
}
.navbar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
}
.navbar li {
    float: left;
}
.navbar a {
    color: white;
    text-decoration: none;
    padding: 15px;
    display: block;
    text-align: center;
}
.navbar a:hover {
    background-color: black;
}
`;
document.head.appendChild(style);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableZoom = false; 
controls.enableRotate = true; 
controls.enablePan = false; 
controls.screenSpacePanning = false; 

controls.minPolarAngle = Math.PI / 2 - 0.8; 
controls.maxPolarAngle = Math.PI / 2 - 0.8;

camera.position.set(22, 15, 22);
camera.rotation.set(-0.8, 0, 0);

const topLight = new THREE.DirectionalLight(0xFFD7B8, 4);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

let object;
loader.load('chess.fbx', function (fbx) {
    object = fbx;
    scene.add(object);
}, undefined, function (error) {
    console.error(error);
});

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.zIndex = '1';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update(); 
    if (object) object.rotation.y += 0.001;
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});
