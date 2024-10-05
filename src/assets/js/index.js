import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

// size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector('.webgl');

// Scene
const scene = new THREE.Scene();

// Geometry
// const geometry = new THREE.PlaneGeometry(sizes.width, sizes.height, 32, 32);
const geometry = new THREE.PlaneGeometry(sizes.width, sizes.height, 32, 32);

// Material
const material = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
  uniforms: {
    u_resolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
    u_time: { value: 0.0 }, // 時間を追加
    u_noise: { value: 1.0 },
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 画面リサイズ時に解像度の uniform を更新
  material.uniforms.u_resolution.value.set(sizes.width, sizes.height);
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1); // Adjust camera position as needed
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // シェーダーに経過時間を渡す
  material.uniforms.u_time.value = elapsedTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
