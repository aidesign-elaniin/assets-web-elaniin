"""
Genera la geometría del cubo de vidrio en Blender.

Uso:
  /Applications/Blender.app/Contents/MacOS/Blender -b -P blender/make_tile.py

Salida (assets/):
  tiles.json  -> lo carga elaniin-glass.js (posiciones, normales, índices por perfil)
  tile-<perfil>.glb -> para usar el cubo en Figma/Spline/Cinema, etc.

Cada perfil = radio de esquina distinto. Tile mide 1x1 de frente, DEPTH de grosor;
el motor escala Z para el grosor elegido en el editor.
"""
import bpy, bmesh, json, math, os
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(ROOT, "assets")
PROFILES = {"suave": 0.12, "redondo": 0.24, "pildora": 0.40}  # radio de esquina (tile = 1)
DEPTH = 0.3
EDGE = 0.05        # bisel del canto frontal/trasero
CORNER_SEGS = 12
EDGE_SEGS = 5


def build(radius):
    bm = bmesh.new()
    s = 0.5
    pts = []
    for cx, cy, a0 in [(s - radius, s - radius, 0), (-(s - radius), s - radius, 90),
                       (-(s - radius), -(s - radius), 180), (s - radius, -(s - radius), 270)]:
        for k in range(CORNER_SEGS + 1):
            a = math.radians(a0 + 90 * k / CORNER_SEGS)
            pts.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))
    face = bm.faces.new([bm.verts.new((x, y, -DEPTH / 2)) for x, y in pts])
    ret = bmesh.ops.extrude_face_region(bm, geom=[face])
    new_verts = [g for g in ret["geom"] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=new_verts, vec=(0, 0, DEPTH))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    # bisel solo en los contornos horizontales (frente y espalda)
    loops = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-6]
    bmesh.ops.bevel(bm, geom=loops, offset=EDGE, segments=EDGE_SEGS, profile=0.5,
                    affect="EDGES", clamp_overlap=True)
    bmesh.ops.triangulate(bm, faces=bm.faces[:], quad_method="BEAUTY", ngon_method="BEAUTY")
    bm.normal_update()
    return bm


def corner_normals(bm):
    """Caras planas (frente/espalda) = normal plana; el resto suavizado.
    Evita que el bisel 'tuerza' el sombreado del frente plano."""
    is_cap = {f.index: abs(f.normal.z) > 0.999 for f in bm.faces}
    smooth = {}
    for v in bm.verts:
        acc = Vector()
        for f in v.link_faces:
            if not is_cap[f.index]:
                acc += f.normal * f.calc_area()
        smooth[v.index] = acc.normalized() if acc.length > 0 else Vector((0, 0, 1))
    out = []
    for f in bm.faces:
        for l in f.loops:
            out.append(f.normal.copy() if is_cap[f.index] else smooth[l.vert.index])
    return out


def to_json(bm, normals):
    key_to_idx, P, N, I = {}, [], [], []
    k = 0
    for f in bm.faces:
        for l in f.loops:
            p, n = l.vert.co, normals[k]
            k += 1
            key = (round(p.x, 4), round(p.y, 4), round(p.z, 4), round(n.x, 3), round(n.y, 3), round(n.z, 3))
            if key not in key_to_idx:
                key_to_idx[key] = len(P) // 3
                P += key[:3]
                N += key[3:]
            I.append(key_to_idx[key])
    return {"p": P, "n": N, "i": I}


def export_glb(bm, normals, name):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    me.normals_split_custom_set(normals)
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, f"{name}.glb"), use_selection=True,
                              export_format="GLB", export_normals=True)


def main():
    os.makedirs(OUT, exist_ok=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    data = {"depth": DEPTH, "profiles": {}}
    for name, r in PROFILES.items():
        bm = build(r)
        normals = corner_normals(bm)
        data["profiles"][name] = to_json(bm, normals)
        export_glb(bm, normals, f"tile-{name}")
        bm.free()
        v = len(data["profiles"][name]["p"]) // 3
        print(f"[tile] {name}: {v} vértices, {len(data['profiles'][name]['i']) // 3} triángulos")
    with open(os.path.join(OUT, "tiles.json"), "w") as fh:
        json.dump(data, fh, separators=(",", ":"))
    print("[tile] OK ->", OUT)


main()
bpy.ops.wm.quit_blender()  # sin esto Blender 5.1 se queda colgado en modo -b
