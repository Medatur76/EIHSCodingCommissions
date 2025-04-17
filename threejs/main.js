import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const loader = new FBXLoader();
const scene = new THREE.Scene();

let object;

loader.load( 'chess.fbx', function ( fbx ) {

    object = fbx;
    scene.add( object );
    
  
  }, function (xhr) {
    if (xhr.loaded / xhr.total * 100 == 100) document.body.appendChild(document.createElement("p")).textContent = "done";
  }, function ( error ) {
    console.error( error );
    document.body.appendChild(document.createElement("p")).textContent = error;

  } );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const topLight = new THREE.DirectionalLight(0xFFD7B8, 4);
topLight.position.set(500,500,500)
topLight.castShadow = true;
scene.add(topLight);
camera.position.z = 22;
camera.position.y = 15;
camera.rotation.x = -0.8;
const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

function animate() {

    if (object) object.rotation.y += 0.001;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
