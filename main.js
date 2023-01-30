import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { DirectionalLight } from "three";
import backGround from "./img/1.jpg";
import backGround1 from "./img/2.jpg";

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
// const directionalLight = new THREE.DirectionalLight(0xfffffff, 1);
// scene.add(directionalLight);
// const directionalHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   10
// );
// const directionalShadow = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalHelper);
// scene.add(directionalShadow);
// directionalLight.shadow.camera.top = 50;
// directionalLight.shadow.camera.bottom = -50;
// directionalLight.shadow.camera.left = -50;
// directionalLight.shadow.camera.right = 50;
// directionalLight.castShadow = true;
// const TextureLoader = new THREE.TextureLoader();
// scene.background = TextureLoader.load();

const spotLight = new THREE.SpotLight(0xfffffff);
scene.add(spotLight);
spotLight.castShadow = true;
const SLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(SLightHelper);
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
  rotateX: 0,
  rotateY: 0,
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
gui.add(options, "rotateX", -90, 90, 0.5).onChange((e) => {
  torus.rotation.x = e;
});
gui.add(options, "rotateY", -90, 90, 0.5).onChange((e) => {
  torus.rotation.y = e;
});
// light gui
const lightOptions = {
  lightColor: 0xffffff,
  lightX: 0,
  lightY: 100,
  lightZ: 0,
  angle: 0.2,
  penumbra: 0,
  intensity: 1,
};
const lightGui = new dat.GUI();

lightGui.addColor(lightOptions, "lightColor");
lightGui.add(lightOptions, "lightY", 0, 100, 1);

lightGui.add(lightOptions, "lightX", -100, 100, 1);

lightGui.add(lightOptions, "lightZ", -100, 100, 1);

lightGui.add(lightOptions, "angle", 0, 1, 0.1);
lightGui.add(lightOptions, "penumbra", 0, 1, 0.1);
lightGui.add(lightOptions, "intensity", 0, 1, 0.1);
const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  backGround1,
  backGround,
  backGround1,
  backGround,
  backGround1,
  backGround1,
]);
function animate() {
  requestAnimationFrame(animate);

  // torus.position.y = 10 * Math.abs(Math.sin(step));
  spotLight.color.set(lightOptions.lightColor);
  spotLight.position.y = lightOptions.lightY;
  spotLight.position.x = lightOptions.lightX;
  spotLight.position.z = lightOptions.lightZ;
  spotLight.angle = lightOptions.angle;
  spotLight.intensity = lightOptions.intensity;
  spotLight.penumbra = lightOptions.penumbra;
  SLightHelper.update();
  renderer.render(scene, camera);
}
animate();
