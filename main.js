import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 30);
orbit.update();
renderer.setSize(window.innerWidth, window.innerHeight);
const geometry = new THREE.TorusGeometry(10, 3, 20, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff,
  wireframe: true,
});

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);
const planceGeo = new THREE.PlaneGeometry(60, 60);
const planceMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plance = new THREE.Mesh(planceGeo, planceMaterial);

scene.add(plance);
const grid = new THREE.GridHelper(60);
scene.add(grid);

plance.rotation.x = 0.5 * Math.PI;
const axesHelper = new THREE.AxesHelper(15);
scene.add(axesHelper);
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
animate();
