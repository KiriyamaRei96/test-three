import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { DirectionalLight } from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// const ambientLight = new THREE.AmbientLight(0xffea);
// scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
const directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
scene.add(directionalLight);
const directionalHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  10
);
const directionalShadow = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalHelper);
scene.add(directionalShadow);
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.castShadow = true;

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 70);
orbit.update();
renderer.setSize(window.innerWidth, window.innerHeight);
const geometry = new THREE.TorusGeometry(5, 3, 20, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0x1dbb,
  wireframe: false,
});

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
torus.castShadow = true;
torus.position.y = 15;
const planceGeo = new THREE.PlaneGeometry(60, 60);
const planceMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plance = new THREE.Mesh(planceGeo, planceMaterial);

scene.add(plance);
const grid = new THREE.GridHelper(60);
plance.receiveShadow = true;
scene.add(grid);

plance.rotation.x = 0.5 * Math.PI;
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
const options = {
  torusColor: 0x1dbb,
  wireFrame: false,
  torusY: 15,
  torusX: 0,
  torusZ: 0,
  lightColor: 0xffffff,
};

// obj Gui
const gui = new dat.GUI();

gui.addColor(options, "torusColor").onChange((e) => {
  torus.material.color.set(e);
});
gui.add(options, "wireFrame").onChange((e) => {
  torus.material.wireframe = e;
});
gui.add(options, "torusY", 0, 60, 1).onChange((e) => {
  torus.position.y = e;
});
gui.add(options, "torusX", -60, 60, 1).onChange((e) => {
  torus.position.x = e;
});
gui.add(options, "torusZ", -60, 60, 1).onChange((e) => {
  torus.position.z = e;
});
// light gui
const lightOptions = {
  lightColor: 0xffffff,
  lightX: -30,
  lightY: 50,
  lightZ: 0,
};
const lightGui = new dat.GUI();

lightGui.addColor(lightOptions, "lightColor").onChange((e) => {
  directionalLight.color.set(e);
});
lightGui.add(lightOptions, "lightY", 0, 60, 1).onChange((e) => {
  directionalLight.position.y = e;
});
lightGui.add(lightOptions, "lightX", -60, 60, 1).onChange((e) => {
  directionalLight.position.x = e;
  directionalHelper.scale = e;
});
lightGui.add(lightOptions, "lightZ", -60, 60, 1).onChange((e) => {
  directionalLight.position.z = e;
});

let step = 0;
let speed = 0.01;
function animate() {
  requestAnimationFrame(animate);
  step += speed;
  // torus.position.y = 10 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}
animate();
