// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
 
let camera, scene, raycaster, renderer
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);

var slider_geo = document.querySelector('.slider-geo');
var geometry = [ 'geom_01.3dm', 'geom_02.3dm', 'geom_03.3dm' ];
var i = 0; //GEOMETRÍA ACTUAL

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
/////////////////////////////// INIT - ESTADO INICIAL /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function init() {

    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
        //ESTO NO_DESAPARECE LA GEOMETRÍA//initStage.initStyle(StageStyle.TRANSPARENT);
        //ESTO NO_FONDO BLANCO//scene.background = new THREE.Color('background-color')

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

    loader.load( 'geom_all.3dm', function ( object ) {

        document.getElementById('loader').remove()
        scene.add( object )
        console.log( object )

    } )

}

///////////////////////////////////////////////////////////////////////////////////
//////////////////////// ONCLICK - ALGO PASA AL CLICKAR ///////////////////////////
///////////////////////////////////////////////////////////////////////////////////
function onClick( event ) {

    console.log( `click! (${event.clientX}, ${event.clientY})`)

	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    
    raycaster.setFromCamera( mouse, camera )

	// calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children, true )

    let container = document.getElementById( 'container' )
    if (container) container.remove()

    // reset object colours
        // color de las geometrías que NO clickas
    scene.traverse((child, i) => {
        if (child.isMesh) {
            child.material.color.set( 'white' )
        }
    });

    if (intersects.length > 0) {

        // get closest object
            // color de la geometría que SÍ clickas
        const object = intersects[0].object
        console.log(object) // debug

        object.material.color.set( 'deeppink' )

        // get user strings
        let data, count
        if (object.userData.attributes !== undefined) {
            data = object.userData.attributes.userStrings
        } else {
            // breps store user strings differently...
            data = object.parent.userData.attributes.userStrings
        }

        // do nothing if no user strings
        if ( data === undefined ) return

        console.log( data )
        
        // create container div with table inside
        container = document.createElement( 'div' )
        container.id = 'container'
        
        const table = document.createElement( 'table' )
        container.appendChild( table )

        for ( let i = 0; i < data.length; i ++ ) {

            const row = document.createElement( 'tr' )
            row.innerHTML = `<td>${data[ i ][ 0 ]}</td><td>${data[ i ][ 1 ]}</td>`
            table.appendChild( row )
        }

        document.body.appendChild( container )
    }

}


function animate() {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}

