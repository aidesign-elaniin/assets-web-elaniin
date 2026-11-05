// Escena iso "Primario / Respaldo" (elaniin.com · routes · sector público · Stay available when it matters):
// el tráfico entra al primario; cuando falla, el respaldo toma la carga y luego el primario se recupera.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, chip, pulse, line, project, clamp01, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, primary: 'Primario', primaryIcon: 'server', backup: 'Respaldo', backupIcon: 'refresh', nodeIcon: 'users' },
  controls: [
    { title: 'Servidores', items: [
      textField('primary', 'Etiqueta primario'), iconSelect('primaryIcon', 'Icono primario'),
      textField('backup', 'Etiqueta respaldo'), iconSelect('backupIcon', 'Icono respaldo'),
      iconSelect('nodeIcon', 'Icono del tráfico entrante'),
    ] },
    sceneSection(),
  ],
  describe: c => `${c.primary} / ${c.backup}`,
  build() {
    const plate = { x: -40, y: -20, z: 0, w: 260, d: 280, h: 10 };
    const primary = { x: 0, y: 0, z: 10, w: 64, d: 200, h: 34 };
    const backup = { x: 96, y: 0, z: 10, w: 64, d: 200, h: 34 };
    const node = { x: -10, y: 236 };
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: 0, y: 0, z: 10 + 34 + 50 },
    ];
    return { plate, primary, backup, node, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const fail = clamp01((t - 5000) / 400) * (1 - clamp01((t - 9600) / 600));   // el primario cae y se recupera
    slab(ctx, 'plate', S.plate, o);
    const z = 10, n = { x: S.node.x, y: S.node.y, z };
    const toP = [n, { x: S.primary.x + S.primary.w / 2, y: S.node.y, z }, { x: S.primary.x + S.primary.w / 2, y: S.primary.d, z }];
    const toB = [n, { x: S.backup.x + S.backup.w / 2, y: S.node.y, z }, { x: S.backup.x + S.backup.w / 2, y: S.backup.d, z }];
    line(ctx, toP, o, { dash: [4, 4], color: `rgba(1,23,46,${0.45 - 0.25 * fail})` });
    line(ctx, toB, o, { dash: [4, 4], color: `rgba(1,23,46,${0.2 + 0.25 * fail})` });
    // pulsos: cada 1.2 s sale uno del nodo hacia el servidor activo
    for (let s = 0; s < 12000; s += 1200) {
      const k = (t - s) / 1000;
      if (k <= 0 || k >= 1) continue;
      const route = (s >= 5000 && s < 9600 ? toB : toP).map(p => project(p, o));
      const seg = k < 0.5 ? [route[0], route[1], k * 2] : [route[1], route[2], (k - 0.5) * 2];
      pulse(ctx, { x: seg[0].x + (seg[1].x - seg[0].x) * seg[2], y: seg[0].y + (seg[1].y - seg[0].y) * seg[2] }, Math.sin(Math.PI * k));
    }
    chip(ctx, S.node.x, S.node.y, z, o, c.nodeIcon, { r: 15, active: 1 });
    glassSlab(ctx, env, 'brand', S.primary, { a: 1 - 0.55 * fail, glow: (1 - fail) * 0.5 });
    ctx.save(); ctx.globalAlpha = 1 - 0.5 * fail;
    pill(ctx, { box: S.primary, label: c.primary, icon: c.primaryIcon, tile: { x: S.primary.w / 2, y: S.primary.d / 2 } }, o, -4 * wave(t, 4000));
    ctx.restore();
    glassSlab(ctx, env, 'software', S.backup, { glow: fail });
    pill(ctx, { box: S.backup, label: c.backup, icon: c.backupIcon, tile: { x: S.backup.x + S.backup.w / 2, y: S.backup.d / 2 }, active: fail > 0.5 }, o, -4 * wave(t, 4000, 400));
  },
});
