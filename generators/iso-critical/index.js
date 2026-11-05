// Escena iso "Crítico" (elaniin.com · routes · sector público · Build critical software):
// un bloque sólido que un plano de auditoría recorre de abajo hacia arriba; al terminar se aprueba.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, poly, topFace, ELEVATE, clamp01, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, label: 'Crítico', icon: 'shield', height: 70, look: 'brand' },
  controls: [
    { title: 'Bloque', items: [
      textField('label'), iconSelect('icon'),
      { type: 'range', key: 'height', label: 'Alto', min: 20, max: 140, step: 2, digits: 0 },
      { type: 'select', key: 'look', label: 'Material', options: { brand: 'Marca (azul)', software: 'Software', ai: 'AI', cloud: 'Cloud' } },
    ] },
    sceneSection(),
  ],
  describe: c => `${c.label} · alto ${c.height}`,
  build(c) {
    const plate = { x: -40, y: -40, z: 0, w: 260, d: 280, h: 10 };
    const block = { x: 0, y: 0, z: 10, w: 160, d: 200, h: c.height };
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: 10 + c.height + 50 },
    ];
    return { plate, block, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    slab(ctx, 'plate', S.plate, o);
    const b = S.block, cycle = t % 6000, k = clamp01(cycle / 3600);   // dos auditorías por loop
    const ok = clamp01((cycle - 3600) / 300) * (1 - clamp01((cycle - 5500) / 400));
    glassSlab(ctx, env, c.look, b, { glow: ok });
    if (cycle < 3700) {   // plano de auditoría subiendo
      const z = b.z + b.h * k;
      ctx.save(); ctx.globalAlpha = Math.sin(Math.PI * clamp01(cycle / 3700)) * 0.9;
      ctx.strokeStyle = c.look === 'ai' ? '#7b9bff' : ELEVATE; ctx.lineWidth = 2; ctx.lineJoin = 'round';
      poly(ctx, topFace({ ...b, z, h: 0 }), o); ctx.stroke();
      ctx.restore();
    }
    pill(ctx, { box: b, label: c.label, icon: c.icon, tile: { x: b.w - 34, y: b.d / 2 }, check: ok }, o, -4 * wave(t, 4000));
  },
});
