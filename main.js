import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import * as dat from "dat.gui";
import { DirectionalLight } from "three";
import backGround from "./img/1.jpg";
import backGround1 from "./img/2.jpg";
import backGround2 from "./img/3.jpg";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

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
// scene.background = TextureLoader.load();

// const spotLight = new THREE.SpotLight(0xfffffff);
// scene.add(spotLight);
// spotLight.castShadow = true;
// const SLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(SLightHelper);
renderer.shadowMap.enabled = false;
renderer.setPixelRatio(window.devicePixelRatio);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0.001, 0.001, 0.001);
orbit.update();
renderer.setSize(window.innerWidth, window.innerHeight);

const transformControl = new TransformControls(camera, renderer.domElement);
// transformControl.addEventListener( 'change', animate );

transformControl.addEventListener("dragging-changed", function (event) {
  orbit.enabled = !event.value;
});
scene.add(transformControl);
const geometry = new THREE.TorusGeometry(5, 3, 20, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0x1dbb,
  wireframe: false,
});
const sphereGeo = new THREE.SphereGeometry(6, 102, 102);

const sphereMat = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  // displacementScale: 50,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

loader.load("./img/IMG_3917 Panorama.jpg", function (texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  sphere.material.map = texture;
});

// loader.load("./img/depth.png", function (depth) {
//   depth.minFilter = THREE.NearestFilter;
//   depth.generateMipmaps = false;
//   sphere.material.displacementMap = depth;
// });

// On load complete add the panoramic sphere to the scene
manager.onLoad = function () {
  scene.add(sphere);
  // sphere.position.y = 10;
  // sphere.position.x = -30;
};

const torus = new THREE.Mesh(geometry, material);
// scene.add(torus);
torus.castShadow = true;
torus.position.y = 15;
torus.position.x = 30;

const planceGeo = new THREE.PlaneGeometry(60, 60);
const planceMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plance = new THREE.Mesh(planceGeo, planceMaterial);

// scene.add(plance);
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
  zoom: 1,
};

camera.zoom = -10;
// obj Gui
const gui = new dat.GUI();
gui.add(options, "zoom", 0.01, 3, 0.01).onChange((e) => {
  camera.zoom = e;
  camera.updateProjectionMatrix();
});
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
gui.open();
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
lightGui.add(lightOptions, "intensity", 0, 4, 0.1);
lightGui.close();

const cubeTextureLoader = new THREE.CubeTextureLoader();
const TextureLoader = new THREE.TextureLoader();
const BoxGeometry = new THREE.BoxGeometry(4, 4, 4);
const BoxMaterial = new THREE.MeshBasicMaterial({
  map: TextureLoader.load(backGround1),
});
// const box = new THREE.Mesh(BoxGeometry, [
//   new THREE.MeshBasicMaterial({ color: "#FF0000", side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: "#00FF00", side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: "#0000FF", side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: "#FFFFFF", side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({ color: "#808080", side: THREE.DoubleSide }),
//   new THREE.MeshBasicMaterial({
//     map: TextureLoader.load(backGround1),
//     side: THREE.DoubleSide,
//   }),
// ]);
// scene.add(box);
// box.position.set(15, 20, 15);
// box.material.map();
// scene.background = cubeTextureLoader.load([
//   backGround2,
//   backGround2,
//   backGround2,
//   backGround2,
//   backGround2,
//   backGround2,
// ]);

// const boxId = box.id;
const TorusUid = torus.uuid;
const mousePosition = new THREE.Vector2();
window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ư":
      transformControl.setMode("translate");
      break;
    case "w":
      transformControl.setMode("translate");
      break;
    case "e":
      transformControl.setMode("rotate");
      break;
    case "r":
      transformControl.setMode("scale");
      break;
  }
});

const rayCaster = new THREE.Raycaster();

// box.geometry.attributes.position.array[0] -= -2;
// box.geometry.attributes.position.array[1] -= 2;
// box.geometry.attributes.position.array[2] -= 2;
// box.geometry.attributes.position.array[3] -= -2;
// box.geometry.attributes.position.array[4] -= 2;
// box.geometry.attributes.position.array[5] -= 2;
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// const gltfLoader = new GLTFLoader();
// gltfLoader.load("./mau 20.glb", (glft) => {
//   const obj = glft.scene;
//   obj.position.set(0, 10, 0);
//   obj.scale.set(5, 5, 5);
//   scene.add(obj);
// });

function animate() {
  requestAnimationFrame(animate);

  // torus.position.y = 10 * Math.abs(Math.sin(step));
  // spotLight.color.set(lightOptions.lightColor);
  // spotLight.position.y = lightOptions.lightY;
  // spotLight.position.x = lightOptions.lightX;
  // spotLight.position.z = lightOptions.lightZ;
  // spotLight.angle = lightOptions.angle;
  // spotLight.intensity = lightOptions.intensity;
  // spotLight.penumbra = lightOptions.penumbra;
  // SLightHelper.update();
  rayCaster.setFromCamera(mousePosition, camera);

  const intersects = rayCaster.intersectObjects(scene.children);

  // box.geometry.attributes.position.array[0] - 2;
  // box.geometry.attributes.position.array[1] - 2;
  // box.geometry.attributes.position.array[2];
  // box.geometry.attributes.position.array[3] - 2;
  // box.geometry.attributes.position.array[4] - 2;
  // box.geometry.attributes.position.array[5];
  // box.geometry.attributes.position.needsUpdate = true;
  for (let id in intersects) {
    // if (intersects[id].object.id === boxId) {
    //   const intersectSide = rayCaster.intersectObject(box);
    //   let index = Math.floor(intersectSide[0].faceIndex / 2);
    //   // intersectSide[0].object.material[index].color.set(0xf0ef13);
    //   window.addEventListener("click", (e) => {
    //     transformControl.attach(intersects[id].object);
    //     console.log(intersects[id].object.geometry);
    //   });
    //   // switch (index) {
    //   //   case 4:
    //   //     box.position.z -= 0.2;
    //   //     break;
    //   //   case 5:
    //   //     box.position.z += 0.2;
    //   //     break;
    //   //   case 1:
    //   //     box.position.x += 0.2;
    //   //     break;
    //   //   case 0:
    //   //     box.position.x -= 0.2;
    //   //     break;
    //   //   case 2:
    //   //     box.position.y -= 0.2;
    //   //     break;
    //   //   case 3:
    //   //     box.position.y += 0.2;
    //   //     break;
    //   // }
    // }
    if (intersects[id].object.uuid === TorusUid) {
      window.addEventListener("click", (e) => {
        transformControl.attach(intersects[id].object);
      });
    }
  }
  renderer.render(scene, camera);
}
animate();
