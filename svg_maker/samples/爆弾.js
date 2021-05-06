const BR = 20;
const BW = 300;
const BA = 3;
const BO = 3;
const BL = 24;
const TP = 30;
const TW = 30;

const [coordinates, surfaces] = [{}, {}];

Array(7).fill(null).forEach((_1, i) => {
  const baseR = i === 0 ? 0 : BR * 2;
  const baseT = Math.PI * 2 / 6 * i;
  const baseX = Math.sin(baseT) * baseR;
  const baseY = Math.cos(baseT) * baseR;
  surfaces[`BI${i}FF`] = [];
  surfaces[`BI${i}FB`] = [];
  surfaces[`BI${i}BF`] = [];
  surfaces[`BI${i}BB`] = [];

  Array(BL).fill(null).forEach((_2, j) => {
    const T = Math.PI * 2 / BL * j + baseT;
    const XO = Math.sin(T) * BR + baseX;
    const YO = Math.cos(T) * BR + baseY;
    const XI = Math.sin(T) * (BR - BA) + baseX;
    const YI = Math.cos(T) * (BR - BA) + baseY;
    coordinates[`B${i}.${j}.FO`] = { X: XO, Y: YO, Z: BW /  2 };
    coordinates[`B${i}.${j}.BO`] = { X: XO, Y: YO, Z: BW / -2 };
    coordinates[`B${i}.${j}.IFF`] = { X: XI, Y: YI, Z: BW /  2 };
    coordinates[`B${i}.${j}.IFB`] = { X: XI, Y: YI, Z: BW / -2 };
    coordinates[`B${i}.${j}.IBF`] = { X: XI, Y: YI, Z: BW /  2 - BO };
    coordinates[`B${i}.${j}.IBB`] = { X: XI, Y: YI, Z: BW / -2 + BO };
    surfaces[`BI${i}FF`].push(`B${i}.${j}.IFF`);
    surfaces[`BI${i}FB`].push(`B${i}.${j}.IFB`);
    surfaces[`BI${i}BF`].push(`B${i}.${j}.IBF`);
    surfaces[`BI${i}BB`].push(`B${i}.${j}.IBB`);
    const _bj = j + 1 < BL ? j + 1 : 0;
    surfaces[`${i}.${j}O`] = [`B${i}.${j}.FO`, `B${i}.${j}.BO`, `B${i}.${_bj}.BO`, `B${i}.${_bj}.FO`];
    if (i > 0 && (j / BL <= 1 / 12 || j / BL >= 11 / 12)) {
      coordinates[`T${i}.${j}.FF`] = { X: XO, Y: YO, Z: BW /  2 - TP };
      coordinates[`T${i}.${j}.FB`] = { X: XO, Y: YO, Z: BW /  2 - TP - TW };
      coordinates[`T${i}.${j}.BF`] = { X: XO, Y: YO, Z: BW / -2 + TP };
      coordinates[`T${i}.${j}.BB`] = { X: XO, Y: YO, Z: BW / -2 + TP + TW };
      if (j + 1 < BL) {
        const _tj = j === 0 ? BL - 1 : j / BL <= 1 / 12 ? j - 1 : j + 1;
        surfaces[`T${i}.${j}F`] = [`T${i}.${j}.FF`, `T${i}.${j}.FB`, `T${i}.${_tj}.FB`, `T${i}.${_tj}.FF`];
        surfaces[`T${i}.${j}B`] = [`T${i}.${j}.BF`, `T${i}.${j}.BB`, `T${i}.${_tj}.BB`, `T${i}.${_tj}.BF`];
      }
      if ((j / BL >= 11 / 12) && (j - 1) / BL < 11 / 12) {
        const _ei = i === 1 ? 6 : i - 1;
        const _ej = Math.floor(BL / 12);
        surfaces[`E${i}F`] = [`T${i}.${j}.FF`, `T${i}.${j}.FB`, `T${_ei}.${_ej}.FB`, `T${_ei}.${_ej}.FF`];
        surfaces[`E${i}B`] = [`T${i}.${j}.BF`, `T${i}.${j}.BB`, `T${_ei}.${_ej}.BB`, `T${_ei}.${_ej}.BF`];
      }
    }
  });
});

const CW = 180;
const CO = 120;
const CA = 8;
[
  { C: 'CLD', X: CO /  2, Y:  0, Z: CW / 2 },
  { C: 'CRD', X: CO / -2, Y:  0, Z: CW / 2 },
  { C: 'CLU', X: CO /  2, Y: CA, Z: CW / 2 },
  { C: 'CRU', X: CO / -2, Y: CA, Z: CW / 2 },
].forEach((c) => {
  const sin30 = Math.sin(Math.PI / 6);
  const cos30 = Math.cos(Math.PI / 6);
  const { C, X, Y, Z } = c;
  const Y1 = Y + BR * (1 + Math.pow(3, 1 / 2));
  const Y2 = Y1 * cos30 - X * sin30;
  const X2 = X * cos30 + Y1 * sin30;
  coordinates[`${C}F`] = { X: X2, Y: Y2, Z };
  coordinates[`${C}B`] = { X: X2, Y: Y2, Z: Z * -1 };
});
surfaces.CD = ['CLDF', 'CRDF', 'CRDB', 'CLDB'];
surfaces.CU = ['CLUF', 'CRUF', 'CRUB', 'CLUB'];
