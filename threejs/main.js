import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new OBJLoader();
const scene = new THREE.Scene();

let object;

loader.load( './Chesset.obj', function ( obj ) {

    object = obj.scene
    scene.add( obj.scene );
    
  
  }, undefined, function ( error ) {
  
    console.error( error );

  } );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 20;

function animate() {
    object.rotation.y += 0.01;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
