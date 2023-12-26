import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
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
const loadingDiv = document.getElementsByClassName("loader")[0];
manager.onStart = function (url, number, total) {
  loadingDiv.classList.remove("d-none");
};
manager.onProgress = function (url, loaded, total) {};
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
  loadingDiv.classList.add("d-none");
  // sphere.position.y = 10;
  // sphere.position.x = -30;
};

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
// window.addEventListener("mousemove", (e) => {
//   mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
//   mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
// });

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

  renderer.render(scene, camera);
}
animate();
