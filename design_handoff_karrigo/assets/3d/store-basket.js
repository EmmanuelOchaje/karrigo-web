const stage = document.querySelector('three-d-stage');
const { THREE: T } = await stage.ready;

const mat = (name, color, rough, metal) => {
  const m = new T.MeshStandardMaterial({ color, roughness: rough, metalness: metal ?? 0.06 });
  m.name = name; return m;
};
const LIME = mat('lime', '#7DC62B', 0.32);
const LIME_DK = mat('limeShade', '#4B8216', 0.4);
const CHAR = mat('charcoal', '#2B2F27', 0.5);
const CREAM = mat('cream', '#F1E6CC', 0.55);
const BREAD = mat('crust', '#D9A35E', 0.6);
const CYAN = mat('cyan', '#3FBFD6', 0.35);
const PLUM = mat('plum', '#6B5A74', 0.45);
const LEAF = mat('leaf', '#2F7A2A', 0.5);
const TOMATO = mat('tomato', '#E5542F', 0.35);

const model = new T.Group(); model.name = 'karrigoStoreBasket';
const add = (geo, m, name, pos, rot, parent) => {
  const mesh = new T.Mesh(geo, m); mesh.name = name;
  if (pos) mesh.position.set(...pos);
  if (rot) mesh.rotation.set(...rot);
  (parent || model).add(mesh); return mesh;
};
const rbox = (w, h, d, r) => {
  const bz = Math.min(0.008, w / 4, h / 4, d / 4);
  r = Math.min(r ?? Math.min(w, h, d) * 0.25, w / 2 - bz - 0.001, h / 2 - bz - 0.001);
  if (r <= 0.002) return new T.BoxGeometry(w, h, d);
  const W = w - 2 * bz, H = h - 2 * bz, x = W / 2, y = H / 2, sh = new T.Shape();
  sh.moveTo(-x + r, -y); sh.lineTo(x - r, -y); sh.quadraticCurveTo(x, -y, x, -y + r);
  sh.lineTo(x, y - r); sh.quadraticCurveTo(x, y, x - r, y); sh.lineTo(-x + r, y);
  sh.quadraticCurveTo(-x, y, -x, y - r); sh.lineTo(-x, -y + r); sh.quadraticCurveTo(-x, -y, -x + r, -y);
  const depth = d - 2 * bz;
  const g = new T.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelSize: bz, bevelThickness: bz, bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -depth / 2); g.computeVertexNormals(); return g;
};
const cyl = (r, h, seg = 32, r2) => new T.CylinderGeometry(r, r2 ?? r, h, seg);

/* ---- basket: slatted, tapered walls ---- */
const basket = new T.Group(); basket.name = 'basket'; model.add(basket);
const BW = 0.44, BD = 0.30, BH = 0.22, LEAN = 0.12, T0 = 0.018;
add(rbox(BW - 0.04, T0, BD - 0.04, 0.03), LIME_DK, 'floor', [0, T0 / 2, 0], null, basket);
const bandsY = [0.03, 0.105, 0.18];
const side = (name, len, pos, rotY, lean) => {
  const g = new T.Group(); g.name = name; g.position.set(...pos); g.rotation.y = rotY; basket.add(g);
  const inner = new T.Group(); inner.rotation.x = lean; g.add(inner);
  bandsY.forEach((y, i) => add(rbox(len + y * 0.25, i === 2 ? 0.04 : 0.032, 0.016, 0.008), i === 2 ? LIME_DK : LIME, name + 'Band' + i, [0, y + 0.016, 0], null, inner));
  [-0.42, -0.14, 0.14, 0.42].forEach((f, i) => add(rbox(0.026, BH, 0.016, 0.008), LIME, name + 'Rib' + i, [f * len, BH / 2, 0], null, inner));
};
side('front', BW, [0, 0, -BD / 2], 0, -LEAN);
side('back', BW, [0, 0, BD / 2], Math.PI, -LEAN);
side('left', BD, [-BW / 2, 0, 0], Math.PI / 2, -LEAN);
side('right', BD, [BW / 2, 0, 0], -Math.PI / 2, -LEAN);
/* top rim ring */
const rimY = BH + 0.004, oW = BW + 0.06, oD = BD + 0.06;
add(rbox(oW, 0.026, 0.03, 0.012), LIME_DK, 'rimFront', [0, rimY, -oD / 2], null, basket);
add(rbox(oW, 0.026, 0.03, 0.012), LIME_DK, 'rimBack', [0, rimY, oD / 2], null, basket);
add(rbox(0.03, 0.026, oD, 0.012), LIME_DK, 'rimLeft', [-oW / 2, rimY, 0], null, basket);
add(rbox(0.03, 0.026, oD, 0.012), LIME_DK, 'rimRight', [oW / 2, rimY, 0], null, basket);

/* ---- two handles, raised, leaning apart ---- */
[-1, 1].forEach((s, i) => {
  const h = new T.Group(); h.name = 'handle' + i;
  h.position.set(0, rimY, s * (oD / 2 - 0.01)); h.rotation.x = s * 0.32; model.add(h);
  add(new T.TorusGeometry(0.15, 0.012, 16, 48, Math.PI), LIME_DK, 'handleArc' + i, [0, 0, 0], null, h);
  add(cyl(0.02, 0.12, 24), CHAR, 'handleGrip' + i, [0, 0.15, 0], [0, 0, Math.PI / 2], h);
});

/* ---- groceries ---- */
const g = new T.Group(); g.name = 'groceries'; model.add(g);
const F = T0;
/* milk carton with gable top */
add(rbox(0.085, 0.2, 0.085, 0.01), CREAM, 'cartonBody', [-0.13, F + 0.1, -0.05], [0, 0.3, 0], g);
add(new T.ConeGeometry(0.062, 0.05, 4), CYAN, 'cartonTop', [-0.13, F + 0.225, -0.05], [0, 0.3 + Math.PI / 4, 0], g);
/* bottle */
add(cyl(0.034, 0.22), CYAN, 'bottleBody', [0.02, F + 0.11, -0.07], [0.06, 0, -0.05], g);
add(cyl(0.016, 0.06, 24, 0.03), CYAN, 'bottleNeck', [0.012, F + 0.25, -0.078], [0.06, 0, -0.05], g);
add(cyl(0.018, 0.025), CHAR, 'bottleCap', [0.01, F + 0.29, -0.08], [0.06, 0, -0.05], g);
/* loaf, leaning across */
add(new T.CapsuleGeometry(0.05, 0.16, 8, 24), BREAD, 'loaf', [0.12, F + 0.15, 0.02], [0.25, 0.4, 1.0], g);
/* tins */
add(cyl(0.038, 0.1), PLUM, 'tinA', [0.15, F + 0.05, -0.06], null, g);
add(cyl(0.038, 0.1), CREAM, 'tinB', [0.15, F + 0.15, -0.06], null, g);
/* egg box */
add(rbox(0.16, 0.06, 0.1, 0.02), CREAM, 'eggBox', [-0.05, F + 0.03, 0.08], [0, -0.15, 0], g);
/* greens: leafy bunch */
const greens = new T.Group(); greens.name = 'greens'; greens.position.set(-0.12, F + 0.08, 0.08); g.add(greens);
add(cyl(0.012, 0.18, 12), LEAF, 'stalks', [0, 0.06, 0], [0.25, 0, 0.2], greens);
[[0, 0.17, 0], [0.04, 0.15, 0.03], [-0.04, 0.16, 0.02], [0.01, 0.2, 0.035]].forEach((p, i) =>
  add(new T.SphereGeometry(0.045, 24, 16), LEAF, 'leaf' + i, p, null, greens));
/* tomatoes on top of egg box */
[[0.0, 0.085], [0.045, 0.1]].forEach(([x, z], i) =>
  add(new T.SphereGeometry(0.03, 24, 16), TOMATO, 'tomato' + i, [x, F + 0.088, z], null, g));

const bb = new T.Box3().setFromObject(model), c = bb.getCenter(new T.Vector3());
model.position.set(-c.x, -bb.min.y, -c.z);
stage.setObject(model);
