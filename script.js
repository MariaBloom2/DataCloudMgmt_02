// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
 
let scene, camera, renderer
//const mouse = new THREE.Vector2()
//window.addEventListener( 'click', onClick, false);

const model = 'Parametric Vase.3dm'

var slider_geo = document.querySelector('.slider-geo');
var geometry = [ 'Parametric Vase.3dm' ];
var i = 0; //GEOMETRY

function prev(){
    if(i <= 0) i = geometry.length;
    i--;
    return setGeo();
}

function next(){
    if(i >= geometry.length-1) i = -1;
    i++;
    return setGeo();
}

function setGeo(){
    return slider_geo.setAttribute('src', 'geometry/' + geometry[i]);
}


init()
animate()

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// INIT - INITIAL STATE /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
      //THIS DOES_NOT_DISAPPEAR THE GEOMETRY//initStage.initStyle(StageStyle.TRANSPARENT);
      //THIS IS NOT_WHITE BACKGROUND//scene.background = new THREE.Color('background-color'

    scene.background = new THREE.Color('blue')
    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, .1, 1000 )
    camera.position.y = - 100
    camera.position.x = - 50
    camera.position.z = 120

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    const controls = new OrbitControls( camera, renderer.domElement )
    
        // create the lights
    const directionalLight = new THREE.DirectionalLight( 'pink' )
    directionalLight.position.set( 0, 0, 2 )
    directionalLight.castShadow = true
    directionalLight.intensity = 3
    scene.add( directionalLight )

        // soft white ambient light
    const ambientlight = new THREE.AmbientLight( 0x404040 )
    ambientlight.intensity = 5
    scene.add( ambientlight )

    raycaster = new THREE.Raycaster()

        // upload the geometry
    const loader = new Rhino3dmLoader()
    loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

    loader.load( 'ParametricVase.3dm', function ( object ) {

        document.getElementById('loader').remove()
        scene.add( object )
        console.log( object )

    } )

}