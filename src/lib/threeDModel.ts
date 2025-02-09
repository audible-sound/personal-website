import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons";

export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;
export let renderer: THREE.WebGLRenderer;
export let mixer: THREE.AnimationMixer;
export const clock = new THREE.Clock();

// Star Particle variables
let starsGeometry: THREE.BufferGeometry;
let starCount: number;
let starPositions: Float32Array;
let starBlinkStates: Float32Array;
let starBlinkSpeeds: Float32Array;
let starsMaterial: THREE.ShaderMaterial;


export function initScene(container: HTMLElement) {
    // Create Scene
    scene = new THREE.Scene();

    // Create Camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of View in degrees
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1, // Near Clipping Plane
        1000 // Far Clipping Plane
    );
    camera.position.set(0, 1, 5);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias smooths edges of objects
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Add Light Source
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add Star Geometry
    starsGeometry = new THREE.BufferGeometry();
    starCount = 1500;

    // Array to store position, state, and speed of individual stars
    starPositions = new Float32Array(starCount * 3);
    starBlinkStates = new Float32Array(starCount);
    starBlinkSpeeds = new Float32Array(starCount);

    // Generate random positions and blink properties for each star
    for (let i = 0; i < starCount; i++) {
        const radius = 50; // Large radius to ensure stars are far behind
        const theta = Math.random() * Math.PI * 2;    // Angle around Y-axis (0 to 2π)
        const phi = Math.acos((Math.random() * 2) - 1); // Angle from Y-axis (0 to π)

        // Convert spherical coordinates to Cartesian
        starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
        starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        starPositions[i * 3 + 2] = -Math.abs(radius * Math.cos(phi));        // z (always negative)

        starBlinkStates[i] = Math.random();
        starBlinkSpeeds[i] = 0.5 + Math.random();
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('blinkState', new THREE.BufferAttribute(starBlinkStates, 1));
    starsGeometry.setAttribute('blinkSpeed', new THREE.BufferAttribute(starBlinkSpeeds, 1));

    starsMaterial = createStarShaderMaterial();

    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
        'src/assets/Waving.glb',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.15, 0.15, 0.15);

            // Center model
            const box = new THREE.Box3().setFromObject(model); // Compute the bounding box
            const center = box.getCenter(new THREE.Vector3()); // Get the center of the bounding box

            model.position.y = center.y * 3;
            model.renderOrder = -1;

            scene.add(model);

            // Play animation
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        },
        (_) => {
            console.log("loading model");
        },
        (error) => {
            console.error('An error occurred:', error);
        }
    );

    window.addEventListener('resize', onWindowResize);

    renderer.render(scene, camera);
}

function createStarShaderMaterial() {
    const userThemePreference = localStorage.getItem("themePreference");
    let isDarkMode = false;
    const systemThemePreference = window.matchMedia(
        "(prefers-color-scheme: dark)",
    );

    if (userThemePreference !== null) {
        if (userThemePreference === 'dark') {
            isDarkMode = true
        }
    } else {
        isDarkMode = systemThemePreference.matches;
    }
    return new THREE.ShaderMaterial({
        uniforms: {
            isDarkMode: { value: isDarkMode }
        },
        vertexShader: `
            attribute float blinkState;
            attribute float blinkSpeed;
            varying float vBrightness;
            varying vec3 vPosition;
            
            void main() {
                vBrightness = blinkState;
                vPosition = position;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 3.0;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform bool isDarkMode;
            varying float vBrightness;
            varying vec3 vPosition;
            
            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
                float angle = atan(vPosition.y, vPosition.x);
                float hue = (angle + 3.14159) / (2.0 * 3.14159);
                hue = fract(hue + vPosition.z * 0.01);
                
                vec3 color;
                float alpha;
                
                if (isDarkMode) {
                    // Dark mode: bright, colorful stars
                    color = hsv2rgb(vec3(hue, 0.8, 1.0));
                    alpha = vBrightness * 0.7;
                } else {
                    // Light mode: darker stars for contrast
                    color = hsv2rgb(vec3(hue, 0.6, 0.4));
                    alpha = vBrightness * 0.6; //
                }
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        depthWrite: false,
        depthTest: true,
    });
}

// Update camera aspect ratio when window is resized
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let time = 0;
export function animate() {
    requestAnimationFrame(animate);

    // Adjust blink state and speed of each star
    const blinkAttribute = starsGeometry.attributes.blinkState;
    const speedAttribute = starsGeometry.attributes.blinkSpeed;

    for (let i = 0; i < starCount; i++) {
        blinkAttribute.array[i] = 0.5 + 0.5 * Math.sin(time * speedAttribute.array[i]);
    }

    time += 0.1;
    blinkAttribute.needsUpdate = true;

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
}

export function updateStarColours(isDark: boolean) {
    starsMaterial.uniforms.isDarkMode.value = isDark;
    starsMaterial.needsUpdate = true;
}