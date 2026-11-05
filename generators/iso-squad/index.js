// Escena iso "Equipo dedicado" (elaniin.com · engagement · Dedicated development teams):
// un núcleo (delivery lead + producto) rodeado por las disciplinas del equipo; cada una le entrega trabajo con un pulso.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, ink, slab, glassSlab, pill, pulse, line, project, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, theme: 'dark', background: '#141414', grid: 'none', members: 4, label: '', icon: 'users' },
  controls: [
    { title: 'Equipo', items: [
      { type: 'range', key: 'members', label: 'Disciplinas alrededor', min: 2, max: 8, step: 1, digits: 0 },
      textField('label', 'Etiqueta del núcleo (vacío = sin etiqueta)', 14), iconSelect('icon', 'Icono del núcleo'),
    ] },
    sceneSection(),
  ],
  describe: c => `núcleo + ${c.members} disciplinas`,
  build(c) {
    const plate = { x: -40, y: -40, z: 0, w: 340, d: 340, h: 8 };
    const C = { x: 130, y: 130 };
    const core = { x: C.x - 45, y: C.y - 45, z: 8, w: 90, d: 90, h: 46 };
    const lead = { x: C.x - 26, y: C.y - 26, z: core.z + core.h, w: 52, d: 52, h: 26 };
    const members = Array.from({ length: c.members }, (_, i) => {
      const a = (i / c.members) * Math.PI * 2 - Math.PI / 4;
      const x = C.x + Math.cos(a) * 125, y = C.y + Math.sin(a) * 125;
      return { box: { x: x - 28, y: y - 28, z: 8, w: 56, d: 56, h: 30 }, cx: x, cy: y, start: 1200 + i * (8000 / c.members) };
    });
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: lead.x, y: lead.y, z: lead.z + lead.h + 40 },
    ];
    return { plate, C, core, lead, members, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const z = 8;
    slab(ctx, 'plate', S.plate, o);
    for (const m of S.members) line(ctx, [{ x: m.cx, y: m.cy, z }, { x: S.C.x, y: S.C.y, z }], o, { dash: [3, 5], color: ink(0.3) });
    for (const m of S.members) {   // cada disciplina entrega al núcleo
      const k = (t - m.start) / 1000;
      if (k > 0 && k < 1) { const a = project({ x: m.cx, y: m.cy, z }, o), b = project({ x: S.C.x, y: S.C.y, z }, o), e = ease(k); pulse(ctx, { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e }, Math.sin(Math.PI * k)); }
    }
    const glow = Math.max(0.35, ...S.members.map(m => envelope(t, m.start + 900, 200, 400, 500)));
    // de atrás hacia adelante: miembros detrás del núcleo, núcleo, miembros delante
    const depth = b => b.x + b.y + b.w + b.d;
    const items = [...S.members.map(m => ({ m, d: depth(m.box) })), { core: true, d: depth(S.core) }].sort((a, b) => a.d - b.d);
    for (const it of items) {
      if (it.core) {
        glassSlab(ctx, env, 'software', S.core);
        glassSlab(ctx, env, 'brand', { ...S.lead, z: S.lead.z + 4 * wave(t, 6000, 1500) }, { glow });
        if (c.label) pill(ctx, { box: S.core, label: c.label, icon: c.icon, tile: { x: S.core.x + S.core.w - 20, y: S.core.y + S.core.d / 2 }, room: S.core.d, scale: 0.8 }, o, -4 * wave(t, 4000));
      } else {
        glassSlab(ctx, env, 'software', it.m.box, { glow: envelope(t, it.m.start - 200, 200, 600, 400) * 0.8 });
      }
    }
  },
});
