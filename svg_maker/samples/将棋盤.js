const BXW = 110   * 2;
const BZW = 120   * 2;
const BYW =  60   * 2;
const BPW =   2.5 * 2;
const AYW =  35   * 2;
const ARW =  24;
const AMW =  30;
const AKS = [
  { Y:   0 / 180, R: 94 / 94 },
  { Y:  30 / 180, R: 94 / 94 },
  { Y:  40 / 180, R: 92 / 94 },
  { Y:  50 / 180, R: 88 / 94 },
  { Y:  60 / 180, R: 80 / 94 },
  { Y:  70 / 180, R: 60 / 94 },
  { Y:  80 / 180, R: 30 / 94 },
  { Y:  90 / 180, R: 30 / 94 },
  { Y:  90 / 180, R: 30 / 94 },
  { Y:  87 / 180, R: 45 / 94 },
  { Y:  93 / 180, R: 45 / 94 },
  { Y:  91 / 180, R: 60 / 94 },
  { Y:  90 / 180, R: 70 / 94 },
  { Y:  91 / 180, R: 80 / 94 },
  { Y: 100 / 180, R: 90 / 94 },
  { Y: 110 / 180, R: 92 / 94 },
  { Y: 120 / 180, R: 90 / 94 },
  { Y: 130 / 180, R: 86 / 94 },
  { Y: 140 / 180, R: 80 / 94 },
  { Y: 150 / 180, R: 72 / 94 },
  { Y: 160 / 180, R: 60 / 94 },
  { Y: 170 / 180, R: 45 / 94 },
  { Y: 180 / 180, R: 10 / 94 },
];
const HKS = [
  { Y: 0, R: 2 / 10 },
  { Y: 5, R: 1 / 10 },
];
const KUYH = 34 / 34;
const KMYH = 31 / 34;
const KMXH = 18 / 34;
const KDXH = 28 / 34;
const KUZH =  3 / 34;
const KDZH =  6 / 34;
const KWS = {
  HH: 70 / 100,
  KX: 78 / 100,
  KM: 83 / 100,
  GS: 86 / 100,
  KS: 86 / 100,
  KG: 90 / 100,
  HX: 90 / 100,
  OS: 95 / 100,
};

const coordinates = {};
const surfaces = {};

coordinates.BLFD = { X: BXW /  2, Z: BZW /  2, Y: 0 };
coordinates.BRFD = { X: BXW / -2, Z: BZW /  2, Y: 0 };
coordinates.BLBD = { X: BXW /  2, Z: BZW / -2, Y: 0 };
coordinates.BRBD = { X: BXW / -2, Z: BZW / -2, Y: 0 };
coordinates.BLFU = { X: BXW /  2, Z: BZW /  2, Y: BYW };
coordinates.BRFU = { X: BXW / -2, Z: BZW /  2, Y: BYW };
coordinates.BLBU = { X: BXW /  2, Z: BZW / -2, Y: BYW };
coordinates.BRBU = { X: BXW / -2, Z: BZW / -2, Y: BYW };
surfaces.BF = ['BLFD', 'BRFD', 'BRFU', 'BLFU'];
surfaces.BB = ['BLBD', 'BRBD', 'BRBU', 'BLBU'];
surfaces.BL = ['BLFD', 'BLBD', 'BLBU', 'BLFU'];
surfaces.BR = ['BRFD', 'BRBD', 'BRBU', 'BRFU'];

const MXW = (BXW - BPW * 2) / 9;
const MZW = (BZW - BPW * 2) / 9;
Array(10).fill(null).forEach((_, i) => {
  const TX = BXW / 2 - BPW - MXW * i;
  coordinates[`ST${i}F`] = { X: TX, Z: BZW /  2 - BPW, Y: BYW };
  coordinates[`ST${i}B`] = { X: TX, Z: BZW / -2 + BPW, Y: BYW };
  surfaces[`ST${i}`] = [`ST${i}F`, `ST${i}B`];
  const YZ = BZW / 2 - BPW - MZW * i;
  coordinates[`SY${i}F`] = { X: BXW /  2 - BPW, Z: YZ, Y: BYW };
  coordinates[`SY${i}B`] = { X: BXW / -2 + BPW, Z: YZ, Y: BYW };
  surfaces[`SY${i}`] = [`SY${i}F`, `SY${i}B`];
});

Array(8).fill(null).forEach((_, i) => {
  const T = Math.PI / 8 + Math.PI / 4 * i;
  const sinT = Math.sin(T);
  const cosT = Math.cos(T);
  const _i = i > 0 ? i - 1 : 7;
  AKS.forEach((AK, j) => {
    const BX = ARW * AK.R * sinT;
    const BZ = ARW * AK.R * cosT;
    const Y  = AYW * AK.Y * -1;
    ['TL', 'TR', 'BR', 'BL'].forEach((H, k) => {
      const X = BX + ((H === 'TL' || H === 'BL') ? BXW / 2 - AMW : BXW / -2 + AMW);
      const Z = BZ + ((H === 'TL' || H === 'TR') ? BZW / 2 - AMW : BZW / -2 + AMW);
      coordinates[`A${i}.${j}.${k}`] = { X, Z, Y };
      if (j > 0) {
        surfaces[`A${i}.${j}.${k}`] = [`A${i}.${j}.${k}`, `A${i}.${j - 1}.${k}`, `A${_i}.${j - 1}.${k}`, `A${_i}.${j}.${k}`];
      }
    });
  });
});

['TL', 'TR', 'BR', 'BL'].forEach((H, i) => {
  const X0 = BXW / 2 * HKS[0].R * ((H === 'TL' || H === 'BL') ? 1 : -1);
  const Z0 = BZW / 2 * HKS[0].R * ((H === 'TL' || H === 'TR') ? 1 : -1);
  const X1 = BXW / 2 * HKS[1].R * ((H === 'TL' || H === 'BL') ? 1 : -1);
  const Z1 = BZW / 2 * HKS[1].R * ((H === 'TL' || H === 'TR') ? 1 : -1);
  const _i = i > 0 ? i - 1 : 3;
  coordinates[`H${i}0`] = { X: X0, Z: Z0, Y: HKS[0].Y };
  coordinates[`H${i}1`] = { X: X1, Z: Z1, Y: HKS[1].Y };
  surfaces[`H${i}0`] = [`H${i}0`, `H${i}1`, `H${_i}1`, `H${_i}0`];
  surfaces[`H${i}1`] = [`H${i}1`, `H${_i}1`, 'O'];
});

const makeK = (K, XI, ZI, D) => {
  const KMZH = (KDZH - KUZH) * (KUYH - KMYH) + KUZH;
  console.log(KDZH, KMZH, KUZH);
  const BW = MZW * (KWS[K] || 1);
  const BX = BXW / -2 + BPW - MXW / -2 + MXW * (XI - 1);
  const BZ = BZW / -2 + BPW - MZW / -2 + MZW * (ZI - 1);
  const T = Math.atan((KDZH - KUZH) / 2 / KUYH);
  const codeBase = `K${XI}.${ZI}.`;
  const coordinatesBase = {
    DD: { X: BW * KDXH / 2, Z: BW * KUYH / 2,                                            Y: 0 },
    DU: { X: BW * KDXH / 2, Z: BW * KUYH / 2                  - BW * KDZH * Math.sin(T), Y: BW * KDZH * Math.cos(T) },
    MD: { X: BW * KMXH / 2, Z: BW * KMYH * -1 + BW * KUYH / 2,                           Y: 0 },
    MU: { X: BW * KMXH / 2, Z: BW * KMYH * -1 + BW * KUYH / 2 - BW * KMZH * Math.sin(T), Y: BW * KMZH * Math.cos(T) },
    UD: { X: 0,             Z: BW * KUYH / -2,                                           Y: 0 },
    UU: { X: 0,             Z: BW * KUYH / -2                 - BW * KUZH * Math.sin(T), Y: BW * KUZH * Math.cos(T) },
  };
  Object.keys(coordinatesBase).forEach((code) => {
    const Z1 = coordinatesBase[code].Z * (D === 0 ? 1 : -1);
    const Y1 = coordinatesBase[code].Y + BYW;
    const X1 = coordinatesBase[code].X;
    if (code === 'UD' || code === 'UU') {
      coordinates[`${codeBase}${code}`]  = { X: X1      + BX, Z: Z1 + BZ, Y: Y1 };
    } else {
      coordinates[`${codeBase}${code}L`] = { X: X1      + BX, Z: Z1 + BZ, Y: Y1 };
      coordinates[`${codeBase}${code}R`] = { X: X1 * -1 + BX, Z: Z1 + BZ, Y: Y1 };
    }
  });
  surfaces[`${codeBase}D`] = [`${codeBase}DDL`, `${codeBase}MDL`, `${codeBase}UD`, `${codeBase}MDR`, `${codeBase}DDR`];
  surfaces[`${codeBase}U`] = [`${codeBase}DUL`, `${codeBase}MUL`, `${codeBase}UU`, `${codeBase}MUR`, `${codeBase}DUR`];
};

makeK('HH', 1, 6, 0);
makeK('HH', 4, 5, 0);
makeK('HH', 5, 6, 0);
makeK('HH', 8, 7, 0);
makeK('HH', 9, 6, 0);
makeK('KX', 1, 9, 0);
makeK('KX', 9, 9, 0);
makeK('KM', 8, 9, 0);
makeK('GS', 2, 1, 0);
makeK('GS', 8, 6, 0);
makeK('KS', 4, 8, 0);
makeK('KG', 1, 1, 0);
makeK('HX', 2, 3, 0);
makeK('OS', 6, 5, 0);

makeK('HH', 1, 4, 1);
makeK('HH', 3, 5, 1);
makeK('HH', 4, 3, 1);
makeK('HH', 5, 3, 1);
makeK('HH', 7, 4, 1);
makeK('HH', 9, 4, 1);
makeK('KX', 9, 1, 1);
makeK('KM', 3, 3, 1);
makeK('KM', 7, 6, 1);
makeK('KS', 3, 1, 1);
makeK('KS', 6, 2, 1);
makeK('KS', 7, 8, 1);
makeK('KG', 4, 6, 1);
makeK('HX', 8, 5, 1);
makeK('OS', 4, 2, 1);


