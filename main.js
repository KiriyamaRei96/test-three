import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import * as dat from "dat.gui";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth * 0.5) / window.innerHeight,
  0.1,
  1000
);
const camera2 = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth * 0.5) / window.innerHeight,
  0.1,
  1000
);
camera2.position.set(50, 0, 50);
camera2.lookAt(0, 0, 0);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
const renderer2 = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg2"),
});
renderer.shadowMap.enabled = false;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(window.innerWidth * 0.5, window.innerHeight);
const orbit = new OrbitControls(camera, renderer.domElement);
const orbit2 = new OrbitControls(camera2, renderer2.domElement);
orbit2.update();
// camera.position.set(0.00001, 0.00001, 0.00001);
orbit.target.set(0.00001, 0.0, 0.00004);
// camera.lookAt(0, 10, 0);
orbit.minDistance = 0.00001;
orbit.maxDistance = 0.00001;
orbit.rotateSpeed = 0.6;
// orbit.target(0, 0, 0);
orbit.update();

const sphereGeo = new THREE.SphereGeometry(6, 50, 50);
sphereGeo.scale(-1, 1, 1);
const sphereMat = new THREE.MeshStandardMaterial({
  side: THREE.FrontSide,
  wireframe: false,
  // transparent: true,
  // opacity: 0.9,

  // displacementScale: 50,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

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
    // texture.minFilter = THREE.NearestFilter;
    // texture.generateMipmaps = false;
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
  sphere.renderOrder = 0;
  loadingDiv.classList.add("d-none");
  // sphere.position.y = 10;
  // sphere.position.x = -30;
};
// chỉnh zoom
camera.zoom = 1.2;

camera.updateProjectionMatrix();
let scale = 1.2;
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

renderer.domElement.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / (window.innerWidth * 0.5)) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener("resize", () => {
  const width = window.innerWidth / 2;
  const height = window.innerHeight;
  const aspect = width / height;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  camera2.aspect = aspect;
  camera2.updateProjectionMatrix();
  renderer2.setSize(width, height);
});
sphere.renderOrder = 9;

// mouse position data
const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();
// cursor
const cursorGeo = new THREE.SphereGeometry(0.1, 32, 32);

const cursorMat = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  color: "#fffff",
  depthTest: false,
  // displacementScale: 50,
});
const cursor = new THREE.Mesh(cursorGeo, cursorMat);

scene.add(cursor);
let planeNum = 0;
let state = null;
// plane
const planeGroup = new THREE.Group();
scene.add(planeGroup);
const gui = new dat.GUI();
gui.add({ checkbox: true }, "checkbox").onChange(function (value) {
  planeGroup.visible = value;
});
// material.depthTest = false;

let hit = new THREE.Vector3();
// line
let line;
let vertices = [];
let colors = [];

// mouse handler
window.addEventListener("dblclick", (e) => {
  if (state === "hight") {
    const pointGeo = new THREE.SphereGeometry(0.1, 32, 32);

    const pointMat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: "#34ebde",
      depthTest: false,
      // displacementScale: 50,
    });
    const point = new THREE.Mesh(pointGeo, pointMat);
    point.position.set(...hit);
    scene.add(point);
    vertices.push(hit);

    const positions = new Float32Array(vertices.length * 3);
    for (let i = 0; i < vertices.length; i++) {
      positions[i * 3] = vertices[i].x;
      positions[i * 3 + 1] = vertices[i].y;
      positions[i * 3 + 2] = vertices[i].z;
      colors.push(255, 0, 0);
    }

    line.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    line.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    line.geometry.computeBoundingSphere();
  }
  if (planeNum < 2) {
    // console.log(planeNum);

    const geometry = new THREE.PlaneGeometry(150, 150);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const plane = new THREE.Mesh(geometry, material);
    const gridHelper = new THREE.GridHelper(150, 30, 0xffff00, 0xffff00);
    plane.position.set(...hit);
    plane.rotation.x = 0.5 * Math.PI;
    gridHelper.position.set(...hit);
    gridHelper.material.depthTest = false;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.8;
    plane.name = `plane${planeNum}`;

    gridHelper.renderOrder = 11;

    plane.renderOrder = 11;
    planeGroup.add(plane);
    planeGroup.add(gridHelper);
    planeNum++;
    if (planeNum === 2) {
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.LineBasicMaterial({ vertexColors: true });

      material.linewidth = 8; // Try different values
      material.depthTest = false;
      line = new THREE.Line(geometry, material);
      line.isLineLoop = true;
      scene.add(line);
      state = "hight";
    }
  }
});
// key hanlder
document.addEventListener("keyup", (e) => {
  const plane1 = planeGroup.children.find(
    (item) => item.name === "plane1"
  ).position;
  const plane0 = planeGroup.children.find(
    (item) => item.name === "plane0"
  ).position;
  if (e.code === "Escape" && state === "hight") {
    // scene.remove(line);
    // const vex = [];

    // floor.position.setY(planeY);
    // const positionAttribute = line.geometry.getAttribute("position");

    // floor.geometry.setAttribute(
    //   "position",
    //   new THREE.Float32BufferAttribute(
    //     positionAttribute.array.map((item) =>
    //       item === plane1 ? plane0Y : item
    //     ),
    //     3
    //   )
    // );

    // floor.position.set(line.position.x, plane0Y, line.position.y);

    const shape = new THREE.Shape();
    vertices.forEach((point, index) => {
      if (index === 0) {
        shape.moveTo(point.x, point.z);
      } else {
        shape.lineTo(point.x, point.z);
      }
    });

    // Optional: Close the shape
    shape.closePath();

    // Extrude the shape if needed
    const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: plane0.distanceTo(plane1) + 0.4,
      bevelEnabled: false,
    });
    const texture = new THREE.TextureLoader().load(
      search.img ||
        window.location.origin +
          window.location.pathname.replace("index.html", "") +
          "room.jpg"
    );

    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    mesh.material.depthTest = false;
    mesh.rotation.x = 0.5 * Math.PI;

    var center = new THREE.Vector3();

    line.geometry.computeBoundingBox();
    line.geometry.boundingBox.getCenter(center);

    mesh.geometry.center();
    mesh.position.copy({ x: center.x, y: -0.6, z: center.z });
    scene.add(mesh);
    line.visible = false;

    state = "";
  }
  if (e.code === "Enter" && state === "hight") {
    // floor
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ vertexColors: true });

    material.linewidth = 8; // Try different values
    material.depthTest = false;
    const floor = new THREE.Line(geometry, material);
    floor.isLineLoop = true;

    const positions = new Float32Array(vertices.length * 3);
    for (let i = 0; i < vertices.length; i++) {
      positions[i * 3] = vertices[i].x;
      positions[i * 3 + 1] = plane0.y - 0.4;
      positions[i * 3 + 2] = vertices[i].z;
      colors.push(255, 0, 0);
    }

    floor.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    floor.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    scene.add(floor);
    // for (let i = 0; i < positionAttribute.count; i++) {
    //   const vertex = new THREE.Vector3();
    //   vertex.fromBufferAttribute(positionAttribute, i);
    //   vex.push(vertex);
    // }
    // const geometry = new ConvexGeometry(vex);

    // // Create a mesh with the geometry
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   depthTest: false,
    //   wireframe: true,
    // });
    // const mesh = new THREE.Mesh(geometry, material);

    // // Add the mesh to your scene
    // scene.add(mesh);
  }
});
function animate() {
  requestAnimationFrame(animate);
  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = !state
    ? rayCaster.intersectObject(sphere, true)
    : rayCaster
        .intersectObject(planeGroup, true)
        .filter((mesh) => mesh.object.name === "plane1");

  if (intersects[0]?.point) {
    // cursor.lookAt(intersects[0].face.normal.add(intersects[0].point));

    cursor.renderOrder = 10;
    cursor.position.copy(intersects[0].point);
    hit = intersects[0].point;
  }
  // if (intersects[3]?.point && planeNum === 2) {
  //   // cursor.lookAt(intersects[0].face.normal.add(intersects[0].point));

  //   cursor.renderOrder = 10;
  //   cursor.position.copy(intersects[3].point);
  //   hit = intersects[3].point;
  // }

  renderer.render(scene, camera);
  renderer2.render(scene, camera2);
}
animate();
