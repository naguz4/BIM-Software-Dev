import * as React from 'react';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"


export function ThreeViewer() {
    let scene: THREE.Scene | null
    let mesh: THREE.Object3D | null
    let renderer: THREE.WebGLRenderer | null
    let cameraControls: OrbitControls | null
    let camera: THREE.PerspectiveCamera | null
    let axes: THREE.AxesHelper | null
    let spotLight: THREE.SpotLight | null
    let ambientLight: THREE.AmbientLight | null
    let mtlLoader: MTLLoader | null
    let objLoader: OBJLoader | null
    const setViewer = () => {
         const scene = new THREE.Scene();

const viewerContainer = document.getElementById("viewer-container") as HTMLElement;
console.log(viewerContainer)

camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)


function resizeViewer() {
    if(!renderer) return;
    const containerDimensions = viewerContainer.getBoundingClientRect()
    renderer.setSize(containerDimensions.width, containerDimensions.height)
    const aspecRatio = containerDimensions.width / containerDimensions.height
    if(!camera) return;
    camera.aspect = aspecRatio
    camera.updateProjectionMatrix()
}
window.addEventListener("resize", resizeViewer)
resizeViewer()




//const directionalLight = new THREE.DirectionalLight()
//const ambientLight = new THREE.AmbientLight()
spotLight = new THREE.SpotLight( 0xc09191 );
spotLight.position.set( 100, 1000, 100 );
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
//spotLight.distance = 1000;
spotLight.intensity = 100;

spotLight.castShadow = true;
//ambientLight.intensity = 0.4

scene.add(spotLight)

cameraControls = new OrbitControls(camera, viewerContainer)


function renderScene() {
    if(!renderer || !scene || !camera) return
    renderer.render(scene, camera)
    requestAnimationFrame(renderScene)
}

renderScene()

mtlLoader = new MTLLoader()
objLoader = new OBJLoader()


mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
    materials.preload()
    if(!objLoader) return;
    objLoader.setMaterials(materials)
    objLoader.load("../assets/Gear/Gear1.obj", (object) => {
        if(!scene) return;
        scene.add(object)
        mesh = object
    })
    

})

const loader = new GLTFLoader();

loader.load(
	// resource URL
	'/assets/cspan-stress-capital-3d-model/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	 }
);

    }
React.useEffect(() => {
    setViewer()
   
return () => {
    mesh?.removeFromParent()
    mesh?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            child.material.dispose()
        }
    })
    mesh = null

}
}, [])


    return (
        <div 
        id="viewer-container"
        className='dashboard-card'
        style={{ minWidth:0 }}/>

    )
}