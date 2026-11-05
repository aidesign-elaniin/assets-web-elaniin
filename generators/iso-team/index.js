// Escena iso "Equipo" (elaniin.com · routes · Scale your engineering team):
// una losa chica (tu equipo) se acopla a la losa grande de Elaniin; un pulso cruza la placa al acoplarse.
import { defineIso, SCENE_DEFAULTS, sceneSection, textField, iconSelect, slab, glassSlab, pill, logoTop, pulse, line, project, envelope, wave } from '../_shared/iso-kit.js';

export const { DEFAULTS, controls, normalize, loopSeconds, embedConfig, describe, mount } = defineIso({
  DEFAULTS: { ...SCENE_DEFAULTS, team: 'Tu equipo', teamIcon: 'users', core: 'logo', coreLabel: 'Elaniin', coreIcon: 'code' },
  controls: [
    { title: 'Losas', items: [
      textField('team', 'Etiqueta del equipo'), iconSelect('teamIcon', 'Icono del equipo'),
      { type: 'seg', key: 'core', label: 'Losa grande', options: { logo: 'Logotipo', label: 'Etiqueta' } },
      textField('coreLabel', 'Etiqueta de la losa grande'), iconSelect('coreIcon', 'Icono de la losa grande'),
    ] },
    sceneSection(),
  ],
  describe: c => `${c.team} + ${c.core === 'logo' ? 'Elaniin' : c.coreLabel}`,
  build() {
    const plate = { x: -30, y: -30, z: 0, w: 340, d: 260, h: 10 };
    const team = { x: 0, y: 20, z: 10, w: 80, d: 170, h: 24 };
    const core = { x: 110, y: 0, z: 10, w: 170, d: 200, h: 44 };
    const bounds = [
      ...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => ({ x: plate.x + x * plate.w, y: plate.y + y * plate.d, z: -36 })),
      { x: core.x + core.w, y: 0, z: core.z + core.h + 30 }, { x: 0, y: 0, z: 60 },
    ];
    return { plate, team, core, bounds };
  },
  draw(ctx, env) {
    const { cfg: c, S, t, o } = env;
    const dock = envelope(t, 2000, 1500, 5000, 1500);   // se acopla y vuelve
    const glow = envelope(t, 3400, 500, 3000, 900);
    slab(ctx, 'plate', S.plate, o);
    const path = [{ x: 40, y: S.team.y + S.team.d + 14, z: 10 }, { x: S.core.x + 20, y: S.team.y + S.team.d + 14, z: 10 }];
    line(ctx, path, o, { dash: [4, 4] });
    if (t > 2000 && t < 3600) { const k = (t - 2000) / 1600, a = project(path[0], o), b = project(path[1], o); pulse(ctx, { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }); }
    const team = { ...S.team, x: S.team.x + 22 * dock };
    glassSlab(ctx, env, 'software', team, { glow: dock * 0.6 });
    pill(ctx, { box: team, label: c.team, icon: c.teamIcon, tile: { x: team.x + team.w / 2, y: team.y + team.d / 2 }, room: team.d }, o, -4 * wave(t, 4000));
    glassSlab(ctx, env, 'brand', S.core, { glow });
    if (c.core === 'logo') logoTop(ctx, S.core, o, 110);
    else pill(ctx, { box: S.core, label: c.coreLabel, icon: c.coreIcon, tile: { x: S.core.x + S.core.w / 2, y: S.core.y + S.core.d / 2 } }, o, -4 * wave(t, 4000, 400));
  },
});
