const [wheelL, latticeXL, latticeZL] = [16, 3, 4];
const [wheelW, wheelY, latticeW, latticeH] = [50, -50, 80, 200];
const cageWXH = latticeW * latticeXL / 2;
const cageWZH = latticeW * latticeZL / 2;
const wheelZH = 80;
const [coordinatesW, surfacesW] = Array(wheelL).fill(null).reduce((res, _, i) => {
  const Y = wheelW * Math.sin(i / wheelL * Math.PI * 2) + wheelY;
  const Z = wheelW * Math.cos(i / wheelL * Math.PI * 2);
  [1, -1].forEach((codeX, jx) => {
    X = (cageWXH + 10) * codeX;
    [1, -1].forEach((codeZ, jz) => {
      res[0].push({ C: `W${jx}X${jz}C${i}`, X, Y, Z: Z + wheelZH * codeZ });
      res[1].push({ C: `W${jx}X${jz}C${i}`, S: [`W${jx}X${jz}C${i}`, `WOC${jx}X${jz}`, ]});
    });
  });
  return res;
}, [[
  { C: 'WOC0X0', X: cageWXH + 10,        Y: wheelY, Z: wheelZH },
  { C: 'WOC0X1', X: cageWXH + 10,        Y: wheelY, Z: wheelZH * -1 },
  { C: 'WOC1X0', X: (cageWXH + 10) * -1, Y: wheelY, Z: wheelZH },
  { C: 'WOC1X1', X: (cageWXH + 10) * -1, Y: wheelY, Z: wheelZH * -1 },
], []]);
const [coordinatesLX, surfacesLX] = Array(latticeXL + 1).fill(null).reduce((res, _, x) => {
  const X = cageWXH - latticeW * x;
  [1, -1].forEach((code, j) => {
    const Z = cageWZH * code;
    res[0].push({ C: `L${x}X${j}U`, X, Z, Y: wheelY + 30 + latticeH });
    res[0].push({ C: `L${x}X${j}D`, X, Z, Y: wheelY + 30 });
    res[1].push({ C: `L${x}X${j}`, S: [`L${x}X${j}U`, `L${x}X${j}D`] });
  });
  return res;
}, [[], []]);
const [coordinatesLZ, surfacesLZ] = Array(latticeZL - 1).fill(null).reduce((res, _, z) => {
  const Z = cageWZH - latticeW * (z + 1);
  [1, -1].forEach((code, j) => {
    const X = cageWXH * code;
    res[0].push({ C: `L${z}Z${j}U`, X, Z, Y: wheelY + 30 + latticeH });
    res[0].push({ C: `L${z}Z${j}D`, X, Z, Y: wheelY + 30 });
    res[1].push({ C: `L${z}Z${j}`, S: [`L${z}Z${j}U`, `L${z}Z${j}D`] });
  });
  return res;
}, [[], []]);
const coordinatesD = [cageWXH, cageWXH * -1].reduce((res, X, ix) => {
  [cageWZH + 100, cageWZH * -1].forEach((Z, iz) => {
    [wheelY + 30, wheelY + 20].forEach((Y, iy) => {
      res.push({ C: `D${ix}X${iz}Z${iy}`, X, Z, Y });
    });
  });
  return res;
}, []);
const surfacesD = [
  { C: 'DU', S: ['D0X0Z0', 'D0X1Z0', 'D1X1Z0', 'D1X0Z0']},
  { C: 'DD', S: ['D0X0Z1', 'D0X1Z1', 'D1X1Z1', 'D1X0Z1']},
];
const coordinates = [...coordinatesW, ...coordinatesLX, ...coordinatesLZ, ...coordinatesD].reduce((res, c) => { 
  const { C, ...coordinate } = c;
  return { ...res, [C]: coordinate };
}, {});
const surfaces = [...surfacesW, ...surfacesLX, ...surfacesLZ, ...surfacesD].reduce((res, s) => ({ ...res, [s.C]: s.S }), {});
