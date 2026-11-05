// Escena iso "Producto" (elaniin.com · routes · Build the software your business runs on):
// capas del mismo tamaño que se separan y se vuelven a ensamblar; al cerrar aparece el check verde.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, envelope, wave, clamp01 } from '../_shared/iso-kit.js';

const LOOKS = ['cloud', 'plate', 'software', 'cloud', 'plate'];

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, label: 'Tu producto', icon: 'window', layers: 3, check: 'on' },
  controls: [
    { title: 'Producto', items: [
      textField('label'), iconSelect('icon'),
      { type: 'range', key: 'layers', label: 'Capas bajo la superficie', min: 1, max: 5, step: 1, digits: 0 },
      { type: 'seg', key: 'check', label: 'Check verde al ensamblar', options: { on: 'Sí', off: 'No' } },
    ] },
    sceneSection(),
  ],
  describe: c => `${c.label} · ${c.layers + 1} capas`,
  build(c) {
    const W = 220, Dd = 200, H = 16, TOP = 26;
    const plate = { x: -20, y: -20, z: 0, w: W + 40, d: Dd + 40, h: 10 };
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: W, y: 0, z: 10 + c.layers * (H + 26) + TOP + 50 },
    ];
    return { plate, W, Dd, H, TOP, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const sep = envelope(t, 1000, 1200, 2600, 1200);   // se separan y vuelven a cerrar
    const close = clamp01((t - 5400) / 500) * (1 - clamp01((t - 10600) / 600));
    slab(ctx, 'plate', S.plate, o);
    let z = 10;
    for (let i = 0; i < c.layers; i++) {
      const b = { x: 0, y: 0, z, w: S.W, d: S.Dd, h: S.H };
      glassSlab(ctx, env, LOOKS[i], b);
      z += S.H + 24 * sep;
    }
    const top = { x: 0, y: 0, z, w: S.W, d: S.Dd, h: S.TOP };
    glassSlab(ctx, env, 'brand', top, { glow: close * 0.8 });
    pill(ctx, { box: top, label: c.label, icon: c.icon, tile: { x: S.W - 40, y: S.Dd / 2 }, check: c.check === 'on' ? close : undefined }, o, -4 * wave(t, 4000));
  },
});
