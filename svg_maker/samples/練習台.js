const startZ = -100;
const ZW = 200;
const XW = 40;
const YW = 10;
const curvZW = 100;
const curvL = 10;
const ZGW = 30;
const anaR = 6;
const gurdStartZD = startZ + ZW - 50;
const gurdStartZU = startZ + ZW - 30;
const gurdYW = 12;
const coordinates = {
  LF: { X: XW / -2, Y: 0,  Z: startZ},
  RF: { X: XW /  2, Y: 0,  Z: startZ},
  LB: { X: XW / -2, Y: 0,  Z: startZ + ZW},
  RB: { X: XW /  2, Y: 0,  Z: startZ + ZW},
  GLD: { X: XW / -2, Y: 0, Z: gurdStartZD },
  GRD: { X: XW /  2, Y: 0, Z: gurdStartZD },
  GLU: { X: XW / -2, Y: gurdYW - YW, Z: gurdStartZU },
  GRU: { X: XW /  2, Y: gurdYW - YW, Z: gurdStartZU },
};
const surfaces = {
  C: ['LF', 'LB', 'RB', 'RF'],
  GL: [ 'GLD', 'GLU' ],
  GR: [ 'GRD', 'GRU' ],
  A: [],
};
Array(curvL).fill(null).forEach((_, i) => {
  const Y = YW * (1 - Math.sin(Math.PI / 2 + Math.PI / curvL * (i + 1))) / 2;
  coordinates[`L${i}`] = { X: XW / -2, Y, Z: startZ + ZW + curvZW / curvL * (i + 1) };
  coordinates[`R${i}`] = { X: XW /  2, Y, Z: startZ + ZW + curvZW / curvL * (i + 1) };
  coordinates[`GL${i}`] = { X: XW / -2, Y: Y + (gurdYW - YW), Z: startZ + ZW + curvZW / curvL * (i + 1) };
  coordinates[`GR${i}`] = { X: XW /  2, Y: Y + (gurdYW - YW), Z: startZ + ZW + curvZW / curvL * (i + 1) };
  if (i === 0) {
    surfaces[`C${i}`] = ['LB', 'RB', `R${i}`, `L${i}`];
  } else {
    surfaces[`C${i}`] = [`L${i - 1}`, `R${i - 1}`, `R${i}`, `L${i}`];
  }
  surfaces.GL.push(`GL${i}`);
  surfaces.GR.push(`GR${i}`);
});

coordinates.LGD = { X: XW / -2, Y: 0, Z: startZ + ZW + curvZW + ZGW };
coordinates.RGD = { X: XW /  2, Y: 0, Z: startZ + ZW + curvZW + ZGW };
coordinates.LGU = { X: XW / -2, Y: YW, Z: startZ + ZW + curvZW + ZGW };
coordinates.RGU = { X: XW /  2, Y: YW, Z: startZ + ZW + curvZW + ZGW };
coordinates.GLGU = { X: XW / -2, Y: gurdYW, Z: startZ + ZW + curvZW + ZGW };
coordinates.GRGU = { X: XW /  2, Y: gurdYW, Z: startZ + ZW + curvZW + ZGW };
surfaces.GD = ['LB', 'RB', 'RGD', 'LGD'];
surfaces.GU = [`L${curvL - 1}`, `R${curvL - 1}`, 'RGU', 'LGU'];
surfaces.GL.push('GLGU');
surfaces.GR.push('GRGU');
surfaces.GL.push('LGD');
surfaces.GR.push('RGD');

Array(16).fill(null).forEach((_, i) => {
  const X = anaR * Math.sin(Math.PI * 2 / 16 * i);
  const Z = anaR * Math.cos(Math.PI * 2 / 16 * i) + startZ + ZW + curvZW + ZGW / 2;
  coordinates[`A${i}`] = { X, Z, Y: YW };
  surfaces.A.push(`A${i}`);
});
