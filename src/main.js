import './style.css';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(5);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Animation Clock
let mixer;
const clock = new THREE.Clock();

//Load FBX
const loader = new FBXLoader();
loader.load('/Climbing_Down.fbx', (fbx) => {
    fbx.scale.set(0.01, 0.01, 0.01);
    fbx.rotation.x = THREE.MathUtils.degToRad(0);
    scene.add(fbx);

    //Animation
    mixer = new THREE.AnimationMixer(fbx);
    if (fbx.animations.length > 0) {
      const action = mixer.clipAction(fbx.animations[0]);
      action.play();
    }
  },
  undefined,
  (err) => console.error("Erreur Affichage FBX :", err)
);

//Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//Loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

animate();
