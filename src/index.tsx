import * as THREE from "three";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Sidebar } from "../react-components/Sidebar";
import { ProjectPage } from "../react-components/ProjectPage";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const rootElement = document.getElementById("app") as HTMLElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <><Sidebar />
    <ProjectPage />
    </>
    
)

//ThreeJS viewer

const scene = new THREE.Scene();

const viewerContainer = document.getElementById("viewer-container") as HTMLElement;

const camera = new THREE.PerspectiveCamera(75)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
viewerContainer.append(renderer.domElement)


function resizeViewer() {
    const containerDimensions = viewerContainer.getBoundingClientRect()
    renderer.setSize(containerDimensions.width, containerDimensions.height)
    const aspecRatio = containerDimensions.width / containerDimensions.height
    camera.aspect = aspecRatio
    camera.updateProjectionMatrix()
}
window.addEventListener("resize", resizeViewer)
resizeViewer()


const boxGeometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial()
const cube = new THREE.Mesh(boxGeometry, material)

//const directionalLight = new THREE.DirectionalLight()
//const ambientLight = new THREE.AmbientLight()
const spotLight = new THREE.SpotLight( 0xc09191 );
spotLight.position.set( 100, 1000, 100 );
spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;
//spotLight.distance = 1000;
spotLight.intensity = 100;

spotLight.castShadow = true;
//ambientLight.intensity = 0.4

scene.add(cube, spotLight)

const cameraControls = new OrbitControls(camera, viewerContainer)


function renderScene() {
    renderer.render(scene, camera)
    requestAnimationFrame(renderScene)
}

renderScene()

const mtlLoader = new MTLLoader()
const objLoader = new OBJLoader()


mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
        scene.add(mesh)
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