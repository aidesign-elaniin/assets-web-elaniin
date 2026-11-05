// Escena iso "Servicio" (elaniin.com · routes · sector público · Reach the people you serve):
// un servicio al centro y las personas alrededor; el servicio llega a cada una con un pulso.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, chip, pulse, line, project, clamp01, ease, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, label: 'Servicio', icon: 'landmark', people: 10, personIcon: 'user' },
  controls: [
    { title: 'Servicio', items: [
      textField('label'), iconSelect('icon'),
      { type: 'range', key: 'people', label: 'Personas', min: 4, max: 16, step: 1, digits: 0 },
      iconSelect('personIcon', 'Icono de las personas'),
    ] },
    sceneSection(),
  ],
  describe: c => `${c.label} · ${c.people} personas`,
  build(c) {
    const plate = { x: -70, y: -70, z: 0, w: 380, d: 360, h: 10 };
    const svc = { x: 55, y: 25, z: 10, w: 130, d: 170, h: 30 };
    const cx = svc.x + svc.w / 2, cy = svc.y + svc.d / 2;
    const people = Array.from({ length: c.people }, (_, i) => {
      const a = (i / c.people) * Math.PI * 2 + 0.3;
      return { x: cx + Math.cos(a) * 150, y: cy + Math.sin(a) * 140, start: 1000 + i * (8600 / c.people) };
    });
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: svc.x, y: svc.y, z: 10 + 30 + 50 },
    ];
    return { plate, svc, cx, cy, people, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    slab(ctx, 'plate', S.plate, o);
    const z = 10;
    // rutas punteadas y fichas de las personas (las de atrás primero)
    const order = [...S.people].sort((a, b) => a.x + a.y - (b.x + b.y));
    for (const p of S.people) line(ctx, [{ x: S.cx, y: S.cy, z }, { x: p.x, y: p.y, z }], o, { dash: [3, 5], color: 'rgba(1,23,46,.25)' });
    const behind = order.filter(p => p.x + p.y < S.cx + S.cy), front = order.filter(p => p.x + p.y >= S.cx + S.cy);
    const person = p => chip(ctx, p.x, p.y, z, o, c.personIcon, { active: envelope(t, p.start + 900, 200, 600, 500) });
    behind.forEach(person);
    // pulsos en viaje
    for (const p of S.people) {
      const k = (t - p.start) / 900;
      if (k > 0 && k < 1) { const a = project({ x: S.cx, y: S.cy, z }, o), b = project({ x: p.x, y: p.y, z }, o), e = ease(k); pulse(ctx, { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e }, Math.sin(Math.PI * k)); }
    }
    glassSlab(ctx, env, 'software', S.svc, { glow: 0.35 + 0.35 * wave(t, 3000) });
    pill(ctx, { box: S.svc, label: c.label, icon: c.icon, tile: { x: S.svc.x + S.svc.w / 2, y: S.svc.y + S.svc.d / 2 }, room: S.svc.d }, o, -4 * wave(t, 4000));
    front.forEach(person);
  },
});
