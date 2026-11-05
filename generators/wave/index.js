// Generador "Onda de Partículas 3D": malla de puntos ondulada por ruido, en perspectiva, con fade por profundidad.
// Ref. Pinterest: TouchDesigner (1115063189023266899), Hevoltz behance.net/gallery/209300795 (1115063189023267079).
import { defineGenerator, THREE, NOISE, GLSL } from '../_shared/runtime.js';

const SIZE = 24;   // lado del plano en unidades de mundo

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineGenerator({
  DEFAULTS: {
    colors: ['#023ca0', '#1054ff', '#b9cefb'], background: '#01172e', density: 120, size: 2.2,
    amplitude: 0.6, frequency: 1, tilt: 22, fog: 0.85, speed: 1,
  },
  controls: [
    { title: 'Color', hint: 'De los valles a las crestas.', items: [
      { type: 'colors', key: 'colors', min: 2, max: 6 },
      { type: 'color', key: 'background', label: 'Fondo' },
    ] },
    { title: 'Partículas', items: [
      { type: 'range', key: 'density', label: 'Densidad', min: 40, max: 240, step: 2, digits: 0 },
      { type: 'range', key: 'size', label: 'Tamaño', min: 0.5, max: 6, step: 0.1, digits: 1 },
    ] },
    { title: 'Onda', items: [
      { type: 'range', key: 'amplitude', label: 'Amplitud', min: 0, max: 2, step: 0.01 },
      { type: 'range', key: 'frequency', label: 'Frecuencia', min: 0.2, max: 3, step: 0.05 },
      { type: 'range', key: 'tilt', label: 'Inclinación de cámara', min: 5, max: 80, step: 1, digits: 0, unit: '°' },
      { type: 'range', key: 'fog', label: 'Niebla', min: 0, max: 1, step: 0.01 },
      { type: 'range', key: 'speed', label: 'Velocidad', min: 0.1, max: 4, step: 0.1, digits: 1, unit: '×' },
    ] },
  ],
  loop: c => 14 / c.speed,
  describe: c => `${c.density}×${c.density} puntos · ${c.tilt}°`,
  uniforms: c => ({ uBg: c.background, uAmp: c.amplitude, uFreq: c.frequency, uSize: c.size, uFog: c.fog }),
  init(renderer, U) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const mat = new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false,
      vertexShader: /* glsl */`
        uniform float uPh, uDpr, uAmp, uFreq, uSize;
        varying float vH, vDepth;
        ${NOISE}
        void main(){
          vec3 p = position;
          float h = lnoise(p.xz * uFreq * .28, uPh, .8) - .5;
          h += (lnoise(p.xz * uFreq * .75 + 5., uPh, .5) - .5) * .4;
          p.y = h * uAmp * 2.4;
          vH = clamp(h * 1.6 + .5, 0., 1.);
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uDpr * (10. / vDepth);
        }`,
      fragmentShader: GLSL + /* glsl */`
        uniform vec3 uBg; uniform float uFog;
        varying float vH, vDepth;
        void main(){
          vec2 c = gl_PointCoord - .5;
          if (dot(c, c) > .25) discard;
          float f = smoothstep(6., 22., vDepth) * uFog;
          gl_FragColor = vec4(mix(pal(vH), uBg, f), 1.);
          #include <colorspace_fragment>
        }`,
    });
    const points = new THREE.Points(new THREE.BufferGeometry(), mat);
    scene.add(points);
    let n = 0;
    return {
      scene, camera,
      apply(c) {
        scene.background = new THREE.Color(c.background);
        if (c.density !== n) {
          n = c.density;
          const pos = new Float32Array(n * n * 3);
          for (let i = 0, k = 0; i < n; i++) for (let j = 0; j < n; j++, k += 3) {
            pos[k] = (j / (n - 1) - .5) * SIZE; pos[k + 2] = (i / (n - 1) - .5) * SIZE;
          }
          points.geometry.dispose();
          points.geometry = new THREE.BufferGeometry();
          points.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        }
        const t = THREE.MathUtils.degToRad(c.tilt), d = 9;
        camera.position.set(0, Math.sin(t) * d, Math.cos(t) * d);
        camera.lookAt(0, 0, -2);
      },
      resize(w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    };
  },
});
