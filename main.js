import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

import * as dat from "dat.gui";

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

renderer.shadowMap.enabled = false;
renderer.setPixelRatio(window.devicePixelRatio);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0.00001, 0.00001, 0.00001);
orbit.minDistance = 0.00001;
orbit.maxDistance = 0.00001;

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
camera.zoom = 0.5;
camera.updateProjectionMatrix();
function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}
const search = searchToObject();

loader.load(
  search.img ||
    window.location.origin +
      window.location.pathname.replace("index.html", "") +
      "room.jpg",
  function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    sphere.material.map = texture;
  }
);

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
// scene.add(grid);

plance.rotation.x = 0.5 * Math.PI;
// const axesHelper = new THREE.AxesHelper(15);
// scene.add(axesHelper);
const options = {
  torusColor: 0x1dbb,
  wireFrame: false,

  zoom: 0.5,
};

// obj Gui
const gui = new dat.GUI();
gui.add(options, "zoom", 0.01, 3, 0.01).onChange((e) => {
  camera.zoom = e;
  camera.updateProjectionMatrix();
});

gui.add(options, "wireFrame").onChange((e) => {
  sphere.material.wireframe = e;
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

const TorusUid = torus.uuid;
const mousePosition = new THREE.Vector2();
let scale = 0.5;
function zoom(event) {
  event.preventDefault();
  if (3 >= scale && scale >= 0.01) {
    scale += event.deltaY * -0.0004;
  }
  if (scale > 3) {
    scale = 3;
  }
  if (scale < 0.01) {
    scale = 0.01;
  }

  camera.zoom = Math.min(Math.max(0.05, scale), 4).toFixed(2);
  camera.updateProjectionMatrix();
}

renderer.domElement.onwheel = zoom;
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

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

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
