const 法廷WX       = 200;
const 法廷WZ       = 260;
const 法廷PYD      = -10;
const 法壇WY       =   8;
const 法卓WX       =  96;
const 法卓WZ       =  14;
const 法卓PZ       = -87;
const 書記官卓子WX =  56;
const 書記官卓子PZ = -48;
const 弁護人卓子WZ =  49;
const 弁護人卓子PX = -73;
const 弁護人卓子PZ = -33;
const 弁護人卓子WX =  14;
const 廷吏卓子PZ   = -59;
const 柵PZ         =  35;
const 椅子ZW       =  10;
const 椅子SWY      =  15;
const 椅子SWZ      =   1.8;
const 椅子ST       = -10 / 180 * Math.PI;
const 椅子SPZL     =  [0, -0.34, -0.46, -0.58, -0.68, -0.75];
const 椅子HPL      = [
  { Z:  2,   Y: 12 },
  { Z:  0.5, Y: 11.3 },
  { Z: -4,   Y: 10.5 },
  { Z: -1.6, Y:  0 },
  { Z: -7,   Y:  0 },
  { Z: -6.5, Y:  0.7 },
  { Z: -3.6, Y:  1.5 },
  { Z: -6,   Y: 12 },
];
const [coordinates, surfaces] = [{}, {}];

const makeChair = (baseX, baseZ, baseY, vector, isRightSide = false) => {
  const coordinatesS = [
    ...(椅子SPZL.reduce((res, Z, i) => res.concat([
      { C: `椅子.SKL${i + 1}FD`, X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z,              Y: 0 },
      { C: `椅子.SKR${i + 1}FD`, X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z,              Y: 0 },
      { C: `椅子.SKL${i + 1}FU`, X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z,              Y: 椅子SWY },
      { C: `椅子.SKR${i + 1}FU`, X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z,              Y: 椅子SWY },
      { C: `椅子.SKL${i + 1}BD`, X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 0 },
      { C: `椅子.SKR${i + 1}BD`, X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 0 },
      { C: `椅子.SKL${i + 1}BU`, X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 椅子SWY },
      { C: `椅子.SKR${i + 1}BU`, X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 椅子SWY },
      { C: `椅子.SBL${i + 1}D`,  X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 0 },
      { C: `椅子.SBR${i + 1}D`,  X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 0 },
      { C: `椅子.SBL${i + 1}U`,  X: (椅子ZW - 0.8) / -2 + (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 椅子SWY - 0.4 },
      { C: `椅子.SBR${i + 1}U`,  X: (椅子ZW - 0.8) /  2 - (椅子ZW - 0.8) / (椅子SPZL.length * 2 - 1.2) * i, Z: Z - 椅子SWZ, Y: 椅子SWY - 0.4 },
    ]), [])),
    { C: '椅子.SKL0FD', X: 椅子ZW / -2, Z: 0,            Y: 0 },
    { C: '椅子.SKR0FD', X: 椅子ZW /  2, Z: 0,            Y: 0 },
    { C: '椅子.SKL0FU', X: 椅子ZW / -2, Z: 0,            Y: 椅子SWY },
    { C: '椅子.SKR0FU', X: 椅子ZW /  2, Z: 0,            Y: 椅子SWY },
    { C: '椅子.SKL0BD', X: 椅子ZW / -2, Z: 椅子SWZ * -1, Y: 0 },
    { C: '椅子.SKR0BD', X: 椅子ZW /  2, Z: 椅子SWZ * -1, Y: 0 },
    { C: '椅子.SKL0BU', X: 椅子ZW / -2, Z: 椅子SWZ * -1, Y: 椅子SWY },
    { C: '椅子.SKR0BU', X: 椅子ZW /  2, Z: 椅子SWZ * -1, Y: 椅子SWY },
  ];
  const coordinatesBase = [
    ...coordinatesS.map(({ C, X, Y, Z }) => ({
      C,
      X,
      Y: Math.cos(椅子ST) * Y - Math.sin(椅子ST) * Z + 8,
      Z: Math.cos(椅子ST) * Z + Math.sin(椅子ST) * Y - 椅子ZW / 2,
    })),
    ...(椅子HPL.reduce((res, { Z, Y }, i) => res.concat([
      { C: `椅子.HL${i}L`, X:  椅子ZW / -2 - 1.25, Z, Y },
      { C: `椅子.HL${i}R`, X:  椅子ZW / -2 - 0.25, Z, Y },
    ]), [])),
    ...(isRightSide ? 椅子HPL.reduce((res, { Z, Y }, i) => res.concat([
      { C: `椅子.HR${i}L`, X:  椅子ZW /  2 + 0.25, Z, Y },
      { C: `椅子.HR${i}R`, X:  椅子ZW /  2 + 1.25, Z, Y },
    ]), []) : []),
    { C: '椅子.ZLFU',  X: 椅子ZW / -2,       Z: 椅子ZW /  2, Y:  8 },
    { C: '椅子.ZRFU',  X: 椅子ZW /  2,       Z: 椅子ZW /  2, Y:  8 },
    { C: '椅子.ZLBU',  X: 椅子ZW / -2,       Z: 椅子ZW / -2, Y:  8 },
    { C: '椅子.ZRBU',  X: 椅子ZW /  2,       Z: 椅子ZW / -2, Y:  8 },
    { C: '椅子.ZLFD',  X: 椅子ZW / -2,       Z: 椅子ZW /  2, Y:  6 },
    { C: '椅子.ZRFD',  X: 椅子ZW /  2,       Z: 椅子ZW /  2, Y:  6 },
    { C: '椅子.ZLBD',  X: 椅子ZW / -2,       Z: 椅子ZW / -2, Y:  6 },
    { C: '椅子.ZRBD',  X: 椅子ZW /  2,       Z: 椅子ZW / -2, Y:  6 },
    { C: '椅子.KLLFU', X: 椅子ZW / -2 - 1.5, Z:  2,          Y: 13 },
    { C: '椅子.KLRFU', X: 椅子ZW / -2,       Z:  2 ,         Y: 13 },
    { C: '椅子.KLLBU', X: 椅子ZW / -2 - 1.5, Z: -6,          Y: 13 },
    { C: '椅子.KLRBU', X: 椅子ZW / -2,       Z: -6,          Y: 13 },
    { C: '椅子.KLLFD', X: 椅子ZW / -2 - 1.5, Z:  2,          Y: 12 },
    { C: '椅子.KLRFD', X: 椅子ZW / -2,       Z:  2,          Y: 12 },
    { C: '椅子.KLLBD', X: 椅子ZW / -2 - 1.5, Z: -6,          Y: 12 },
    { C: '椅子.KLRBD', X: 椅子ZW / -2,       Z: -6,          Y: 12 },
    ...(isRightSide ? [
      { C: '椅子.KRLFU', X: 椅子ZW /  2 + 1.5, Z:  2, Y: 13 },
      { C: '椅子.KRRFU', X: 椅子ZW /  2,       Z:  2, Y: 13 },
      { C: '椅子.KRLBU', X: 椅子ZW /  2 + 1.5, Z: -6, Y: 13 },
      { C: '椅子.KRRBU', X: 椅子ZW /  2,       Z: -6, Y: 13 },
      { C: '椅子.KRLFD', X: 椅子ZW /  2 + 1.5, Z:  2, Y: 12 },
      { C: '椅子.KRRFD', X: 椅子ZW /  2,       Z:  2, Y: 12 },
      { C: '椅子.KRLBD', X: 椅子ZW /  2 + 1.5, Z: -6, Y: 12 },
      { C: '椅子.KRRBD', X: 椅子ZW /  2,       Z: -6, Y: 12 },
    ] : []),
  ];
  const surfacesBase = [
    { C: '椅子.SKF', S: [
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKL${i}FD`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKR${椅子SPZL.length - i}FD`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKR${i}FU`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKL${椅子SPZL.length - i}FU`),
    ] },
    { C: '椅子.SKB', S: [
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKL${i}BD`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKR${椅子SPZL.length - i}BD`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKR${i}BU`),
      ...Array(椅子SPZL.length + 1).fill(null).map((_, i) => `椅子.SKL${椅子SPZL.length - i}BU`),
    ] },
    { C: '椅子.SB',  S: [
      ...Array(椅子SPZL.length).fill(null).map((_, i) => `椅子.SBL${i + 1}D`),
      ...Array(椅子SPZL.length).fill(null).map((_, i) => `椅子.SBR${椅子SPZL.length - i}D`),
      ...Array(椅子SPZL.length).fill(null).map((_, i) => `椅子.SBR${i + 1}U`),
      ...Array(椅子SPZL.length).fill(null).map((_, i) => `椅子.SBL${椅子SPZL.length - i}U`),
    ] },
    { C: '椅子.HLL', S: Array(椅子HPL.length).fill(null).map((_, i) => `椅子.HL${i}L`) },
    { C: '椅子.HLR', S: Array(椅子HPL.length).fill(null).map((_, i) => `椅子.HL${i}R`) },
    { C: `椅子.KLU`, S: ['椅子.KLLFU', '椅子.KLRFU', '椅子.KLRBU', '椅子.KLLBU'] },
    { C: `椅子.KLD`, S: ['椅子.KLLFD', '椅子.KLRFD', '椅子.KLRBD', '椅子.KLLBD'] },
    { C: `椅子.ZU`,  S: ['椅子.ZLFU', '椅子.ZRFU', '椅子.ZRBU', '椅子.ZLBU'] },
    { C: `椅子.ZD`,  S: ['椅子.ZLFD', '椅子.ZRFD', '椅子.ZRBD', '椅子.ZLBD'] },
    ...(isRightSide ? [
      { C: '椅子.HRL', S: Array(椅子HPL.length).fill(null).map((_, i) => `椅子.HR${i}L`) },
      { C: '椅子.HRR', S: Array(椅子HPL.length).fill(null).map((_, i) => `椅子.HR${i}R`) },
      { C: `椅子.KRU`, S: ['椅子.KRLFU', '椅子.KRRFU', '椅子.KRRBU', '椅子.KRLBU'] },
      { C: `椅子.KRD`, S: ['椅子.KRLFD', '椅子.KRRFD', '椅子.KRRBD', '椅子.KRLBD'] },
    ] : []),
  ];

  const sinT =  Math.sin(vector);
  const cosT =  Math.cos(vector);

  coordinatesBase.forEach((c) => {
    coordinates[`${c.C}_${baseX}.${baseZ}`] = {
      X: baseX + c.X * cosT + c.Z * sinT,
      Z: baseZ + c.Z * cosT - c.X * sinT,
      Y: baseY + c.Y,
    };
  });
  surfacesBase.forEach((s) => {
    surfaces[`${s.C}_${baseX}.${baseZ}`] = s.S.map((sc) => `${sc}_${baseX}.${baseZ}`);
  });
};

[
  { C: '法壇',         X: 法卓WX       / -2,                Z: 法廷WZ / -2,                 Y: 法廷PYD,          W: 法卓WX,            O: 47,   H: 法壇WY },
  { C: '法卓.L',       X: 法卓WX       / -2,                Z: 法卓PZ,                      Y: 法廷PYD + 法壇WY, W:          2,        O: 法卓WZ, H: 20 },
  { C: '法卓.R',       X: 法卓WX       /  2,                Z: 法卓PZ,                      Y:  -2,              W:         -2,        O: 法卓WZ, H: 20 },
  { C: '法卓.F',       X: 法卓WX       / -2 + 2,            Z: 法卓PZ       + 法卓WZ,       Y:  -2,              W: 法卓WX - 4,        O: -2,   H: 20 },
  { C: '法卓.D',       X: 法卓WX       / -2 + 2,            Z: 法卓PZ,                      Y:  17,              W: 法卓WX - 4,        O: 12,   H: -1.5 },
  { C: '書記官卓子.L', X: 書記官卓子WX / -2,                Z: 書記官卓子PZ,                Y: 法廷PYD,          W:   2,               O: 15,   H: 20 },
  { C: '書記官卓子.R', X: 書記官卓子WX /  2,                Z: 書記官卓子PZ,                Y: 法廷PYD,          W:  -2,               O: 15,   H: 20 },
  { C: '書記官卓子.F', X: 書記官卓子WX / -2 + 2,            Z: 弁護人卓子PZ,                Y: 法廷PYD,          W:                52, O: -2,   H: 20 },
  { C: '書記官卓子.D', X: 書記官卓子WX / -2 + 2,            Z: 書記官卓子PZ,                Y:   9,              W:                52, O: 13,   H: -1.5 },
  { C: '弁護人卓子.D', X: 弁護人卓子PX,                     Z: 弁護人卓子PZ,                Y:  10,              W: 弁護人卓子WX,      O: 弁護人卓子WZ,     H: -1.5 },
  { C: '弁護人卓子.L', X: 弁護人卓子PX,                     Z: 弁護人卓子PZ,                Y: 法廷PYD,          W: 弁護人卓子WX,      O:                2, H: 18.5 },
  { C: '弁護人卓子.R', X: 弁護人卓子PX,                     Z: 弁護人卓子PZ + 弁護人卓子WZ, Y: 法廷PYD,          W: 弁護人卓子WX,      O:               -2, H: 18.5 },
  { C: '弁護人卓子.F', X: 弁護人卓子PX      + 弁護人卓子WX, Z: 弁護人卓子PZ + 2,            Y: 法廷PYD,          W:                -2, O: 弁護人卓子WZ - 4, H: 18.5 },
  { C: '検察官卓子.D', X: 弁護人卓子PX * -1,                Z: 弁護人卓子PZ,                Y:  10,              W: 弁護人卓子WX * -1, O: 弁護人卓子WZ,     H: -1.5 },
  { C: '検察官卓子.L', X: 弁護人卓子PX * -1,                Z: 弁護人卓子PZ,                Y: 法廷PYD,          W: 弁護人卓子WX * -1, O:                2, H: 18.5 },
  { C: '検察官卓子.R', X: 弁護人卓子PX * -1,                Z: 弁護人卓子PZ + 弁護人卓子WZ, Y: 法廷PYD,          W: 弁護人卓子WX * -1, O:               -2, H: 18.5 },
  { C: '検察官卓子.F', X: 弁護人卓子PX * -1 - 弁護人卓子WX, Z: 弁護人卓子PZ + 2,            Y: 法廷PYD,          W:                 2, O: 弁護人卓子WZ - 4, H: 18.5 },
  { C: '廷吏卓子.D',   X: 弁護人卓子PX * -1,                Z: 廷吏卓子PZ,                  Y:  10,              W: 弁護人卓子WX * -1, O: 17,   H: -1.5 },
  { C: '廷吏卓子.L',   X: 弁護人卓子PX * -1,                Z: 廷吏卓子PZ,                  Y: 法廷PYD,          W: 弁護人卓子WX * -1, O:  2,   H: 18.5 },
  { C: '廷吏卓子.R',   X: 弁護人卓子PX * -1,                Z:  -42,                        Y: 法廷PYD,          W: 弁護人卓子WX * -1, O: -2,   H: 18.5 },
  { C: '廷吏卓子.F',   X: 弁護人卓子PX * -1 - 弁護人卓子WX, Z: 廷吏卓子PZ + 2,              Y: 法廷PYD,          W:                 2, O: 13,   H: 18.5 },
  { C: '発言台.L',     X:   -8, Z:   -9, Y: 法廷PYD, W:   1, O: 11,   H: 20 },
  { C: '発言台.R',     X:    8, Z:   -9, Y: 法廷PYD, W:  -1, O: 11,   H: 20 },
  { C: '発言台.F',     X:   -7, Z:   -9, Y: 法廷PYD, W:  14, O:  1,   H: 20 },
  { C: '発言台.D',     X:   -7, Z:   -8, Y:   7, W:  14, O: 10,   H: -1 },
  { C: '柵.U',         X:  -85, Z: 柵PZ, Y:  10, W: 170, O:  1.5, H: -1.5 },
  { C: '柵.D',         X:  -85, Z: 柵PZ, Y:  -5, W: 170, O:  1.5, H:  1.5 },
  { C: '閾.L',         X: 法廷WX / -2, Z: 柵PZ, Y: 法廷PYD, W:  15, O:  1.5, H: 20 },
  { C: '閾.R',         X: 法廷WX /  2 ,Z: 柵PZ, Y: 法廷PYD, W: -15, O:  1.5, H: 20 },
].forEach(({ C, X, Z, Y, W, O, H}) => {
  coordinates[`${C}_FLD`] = { X,        Z,        Y };
  coordinates[`${C}_FRD`] = { X: X + W, Z,        Y };
  coordinates[`${C}_BLD`] = { X,        Z: Z + O, Y };
  coordinates[`${C}_BRD`] = { X: X + W, Z: Z + O, Y };
  coordinates[`${C}_FLU`] = { X,        Z,        Y: Y + H };
  coordinates[`${C}_FRU`] = { X: X + W, Z,        Y: Y + H };
  coordinates[`${C}_BLU`] = { X,        Z: Z + O, Y: Y + H };
  coordinates[`${C}_BRU`] = { X: X + W, Z: Z + O, Y: Y + H };
  surfaces[`${C}F`] = [`${C}_FLD`, `${C}_FRD`, `${C}_FRU`, `${C}_FLU`];
  surfaces[`${C}B`] = [`${C}_BLD`, `${C}_BRD`, `${C}_BRU`, `${C}_BLU`];
  surfaces[`${C}L`] = [`${C}_FLD`, `${C}_BLD`, `${C}_BLU`, `${C}_FLU`];
  surfaces[`${C}R`] = [`${C}_FRD`, `${C}_BRD`, `${C}_BRU`, `${C}_FRU`];
});
const SW2 = coordinates['柵.U_BLU'].Z - coordinates['柵.U_FLU'].Z;
const SW1 = SW2 * 1 / 2;
const SS  = (Math.abs(coordinates['柵.U_FLD'].X) + SW1) / 16;
const SPZ = (coordinates['柵.U_FLU'].Z + coordinates['柵.U_BLU'].Z) / 2;
const SPYU = coordinates['柵.U_FLU'].Y;
const SPYM = coordinates['柵.D_FLU'].Y;
const SPYD = coordinates['柵.D_FLD'].Y;
Array(31).fill(null).forEach((_, i) => {
  const IF = [8, 16, 24].includes(i);
  const SPX = SS * (i - 15);
  const WH = (IF ? SW2 : SW1) / 2;
  coordinates[`柵.${i}.FLD`] = { X: SPX - WH, Z: SPZ - WH, Y: SPYM };
  coordinates[`柵.${i}.FRD`] = { X: SPX + WH, Z: SPZ - WH, Y: SPYM };
  coordinates[`柵.${i}.BLD`] = { X: SPX - WH, Z: SPZ + WH, Y: SPYM };
  coordinates[`柵.${i}.BRD`] = { X: SPX + WH, Z: SPZ + WH, Y: SPYM };
  coordinates[`柵.${i}.FLU`] = { X: SPX - WH, Z: SPZ - WH, Y: SPYU };
  coordinates[`柵.${i}.FRU`] = { X: SPX + WH, Z: SPZ - WH, Y: SPYU };
  coordinates[`柵.${i}.BLU`] = { X: SPX - WH, Z: SPZ + WH, Y: SPYU };
  coordinates[`柵.${i}.BRU`] = { X: SPX + WH, Z: SPZ + WH, Y: SPYU };
  surfaces[`柵.${i}.F`] = [`柵.${i}.FLU`, `柵.${i}.FRU`, `柵.${i}.FRD`, `柵.${i}.FLD`];
  surfaces[`柵.${i}.B`] = [`柵.${i}.BLU`, `柵.${i}.BRU`, `柵.${i}.BRD`, `柵.${i}.BLD`];
  if (IF) {
    coordinates[`柵.${i}.DFLD`] = { X: SPX - WH, Z: SPZ - WH, Y: 法廷PYD };
    coordinates[`柵.${i}.DFRD`] = { X: SPX + WH, Z: SPZ - WH, Y: 法廷PYD };
    coordinates[`柵.${i}.DBLD`] = { X: SPX - WH, Z: SPZ + WH, Y: 法廷PYD };
    coordinates[`柵.${i}.DBRD`] = { X: SPX + WH, Z: SPZ + WH, Y: 法廷PYD };
    coordinates[`柵.${i}.DFLU`] = { X: SPX - WH, Z: SPZ - WH, Y: SPYD };
    coordinates[`柵.${i}.DFRU`] = { X: SPX + WH, Z: SPZ - WH, Y: SPYD };
    coordinates[`柵.${i}.DBLU`] = { X: SPX - WH, Z: SPZ + WH, Y: SPYD };
    coordinates[`柵.${i}.DBRU`] = { X: SPX + WH, Z: SPZ + WH, Y: SPYD };
    surfaces[`柵.${i}.DF`] = [`柵.${i}.DFLU`, `柵.${i}.DFRU`, `柵.${i}.DFRD`, `柵.${i}.DFLD`];
    surfaces[`柵.${i}.DB`] = [`柵.${i}.DBLU`, `柵.${i}.DBRU`, `柵.${i}.DBRD`, `柵.${i}.DBLD`];
  }
});
makeChair(-22, -91,    -2, 0,               true);
makeChair(  0, -91,    -2, 0,               true);
makeChair( 22, -91,    -2, 0,               true);
makeChair(-11, -52,   -10, 0,               true);
makeChair( 11, -52,   -10, 0,               true);
makeChair(-77, -19.5, -10, Math.PI / 2,     true);
makeChair(-77,   2.5, -10, Math.PI / 2,     true);
makeChair( 77, -19.5, -10, Math.PI / 2 * 3, true);
makeChair( 77,   2.5, -10, Math.PI / 2 * 3, true);
makeChair( 77, -50.5, -10, Math.PI / 2 * 3, true);
Array(3).fill(null).forEach((_, i) => {
  const baseX = 椅子ZW * (-5 - 1 / 2) - 1.5 * (6 + 1 / 2) - 13 + (椅子ZW * 4 + 1.5 * 5 + 13) * i;
  Array(4).fill(null).forEach((_, j) => {
    const baseZ = 52 + j * 18;
    Array(4).fill(null).forEach((_, k) => {
      makeChair(baseX + (椅子ZW + 1.5) * k, baseZ, -10, Math.PI, k === 0);
    });
  });
});

coordinates['玄関.LFD']         = { X:  -12, Z: 法廷WZ / -2, Y:  -2 };
coordinates['玄関.RFD']         = { X:   12, Z: 法廷WZ / -2, Y:  -2 };
coordinates['玄関.LBD']         = { X:  -12, Z: 法廷WZ / -2 - 5, Y:  -2 };
coordinates['玄関.RBD']         = { X:   12, Z: 法廷WZ / -2 - 5, Y:  -2 };
coordinates['玄関.LFU']         = { X:  -12, Z: 法廷WZ / -2, Y:  33 };
coordinates['玄関.RFU']         = { X:   12, Z: 法廷WZ / -2, Y:  33 };
coordinates['玄関.LBU']         = { X:  -12, Z: 法廷WZ / -2 - 5, Y:  33 };
coordinates['玄関.RBU']         = { X:   12, Z: 法廷WZ / -2 - 5, Y:  33 };
coordinates['玄関.MD']          = { X:    0, Z: 法廷WZ / -2 - 5, Y:  -2 };
coordinates['玄関.MU']          = { X:    0, Z: 法廷WZ / -2 - 5, Y:  33 };
coordinates['正面壁.LD']        = { X:  -30, Z: 法廷WZ / -2, Y: 法廷PYD };
coordinates['正面壁.RD']        = { X:   30, Z: 法廷WZ / -2, Y: 法廷PYD };
coordinates['正面壁.LU']        = { X:  -30, Z: 法廷WZ / -2, Y:  60 };
coordinates['正面壁.RU']        = { X:   30, Z: 法廷WZ / -2, Y:  60 };
coordinates['被告人入出扉.LFD'] = { X: 法廷WX /  2, Z:  -50, Y: 法廷PYD };
coordinates['被告人入出扉.RFD'] = { X: 法廷WX /  2, Z:  -30, Y: 法廷PYD };
coordinates['被告人入出扉.LFU'] = { X: 法廷WX /  2, Z:  -50, Y:  25 };
coordinates['被告人入出扉.RFU'] = { X: 法廷WX /  2, Z:  -30, Y:  25 };
coordinates['被告人入出扉.LBD'] = { X: 法廷WX /  2 + 3, Z:  -50, Y: 法廷PYD };
coordinates['被告人入出扉.RBD'] = { X: 法廷WX /  2 + 3, Z:  -30, Y: 法廷PYD };
coordinates['被告人入出扉.LBU'] = { X: 法廷WX /  2 + 3, Z:  -50, Y:  25 };
coordinates['被告人入出扉.RBU'] = { X: 法廷WX /  2 + 3, Z:  -30, Y:  25 };
coordinates['原告人入出扉.LFD'] = { X: 法廷WX / -2, Z:  -50, Y: 法廷PYD };
coordinates['原告人入出扉.RFD'] = { X: 法廷WX / -2, Z:  -30, Y: 法廷PYD };
coordinates['原告人入出扉.LFU'] = { X: 法廷WX / -2, Z:  -50, Y:  25 };
coordinates['原告人入出扉.RFU'] = { X: 法廷WX / -2, Z:  -30, Y:  25 };
coordinates['原告人入出扉.LBD'] = { X: 法廷WX / -2 - 3, Z:  -50, Y: 法廷PYD };
coordinates['原告人入出扉.RBD'] = { X: 法廷WX / -2 - 3, Z:  -30, Y: 法廷PYD };
coordinates['原告人入出扉.LBU'] = { X: 法廷WX / -2 - 3, Z:  -50, Y:  25 };
coordinates['原告人入出扉.RBU'] = { X: 法廷WX / -2 - 3, Z:  -30, Y:  25 };
coordinates['傍聴人入出扉.LFD'] = { X:  -80, Z: 法廷WZ /  2, Y: 法廷PYD };
coordinates['傍聴人入出扉.RFD'] = { X:  -60, Z: 法廷WZ /  2, Y: 法廷PYD };
coordinates['傍聴人入出扉.LBD'] = { X:  -80, Z: 法廷WZ /  2 + 3, Y: 法廷PYD };
coordinates['傍聴人入出扉.RBD'] = { X:  -60, Z: 法廷WZ /  2 + 3, Y: 法廷PYD };
coordinates['傍聴人入出扉.LFU'] = { X:  -80, Z: 法廷WZ /  2, Y:  25 };
coordinates['傍聴人入出扉.RFU'] = { X:  -60, Z: 法廷WZ /  2, Y:  25 };
coordinates['傍聴人入出扉.LBU'] = { X:  -80, Z: 法廷WZ /  2 + 3, Y:  25 };
coordinates['傍聴人入出扉.RBU'] = { X:  -60, Z: 法廷WZ /  2 + 3, Y:  25 };
coordinates['輪郭.LFD']         = { X: 法廷WX / -2, Z: 法廷WZ / -2, Y: 法廷PYD };
coordinates['輪郭.RFD']         = { X: 法廷WX /  2, Z: 法廷WZ / -2, Y: 法廷PYD };
coordinates['輪郭.LFU']         = { X: 法廷WX / -2, Z: 法廷WZ / -2, Y:  60 };
coordinates['輪郭.RFU']         = { X: 法廷WX /  2, Z: 法廷WZ / -2, Y:  60 };
coordinates['輪郭.LBD']         = { X: 法廷WX / -2, Z: 法廷WZ /  2, Y: 法廷PYD };
coordinates['輪郭.RBD']         = { X: 法廷WX /  2, Z: 法廷WZ /  2, Y: 法廷PYD };
coordinates['輪郭.LBU']         = { X: 法廷WX / -2, Z: 法廷WZ /  2, Y:  60 };
coordinates['輪郭.RBU']         = { X: 法廷WX /  2, Z: 法廷WZ /  2, Y:  60 };
surfaces['玄関.L']         = ['玄関.LFU', '玄関.LFD', '玄関.LBD', '玄関.LBU'];
surfaces['玄関.R']         = ['玄関.RFU', '玄関.RFD', '玄関.RBD', '玄関.RBU'];
surfaces['玄関.U']         = ['玄関.LFU', '玄関.RFU', '玄関.RBU', '玄関.LBU'];
surfaces['玄関.M']         = ['玄関.MD', '玄関.MU'];
surfaces['正面壁']         = ['正面壁.LD', '正面壁.RD', '正面壁.RU', '正面壁.LU'];
surfaces['被告人入出扉.L'] = ['被告人入出扉.LFU', '被告人入出扉.LFD', '被告人入出扉.LBD', '被告人入出扉.LBU'];
surfaces['被告人入出扉.R'] = ['被告人入出扉.RFU', '被告人入出扉.RFD', '被告人入出扉.RBD', '被告人入出扉.RBU'];
surfaces['被告人入出扉.U'] = ['被告人入出扉.LFU', '被告人入出扉.RFU', '被告人入出扉.RBU', '被告人入出扉.LBU'];
surfaces['原告人入出扉.L'] = ['原告人入出扉.LFU', '原告人入出扉.LFD', '原告人入出扉.LBD', '原告人入出扉.LBU'];
surfaces['原告人入出扉.R'] = ['原告人入出扉.RFU', '原告人入出扉.RFD', '原告人入出扉.RBD', '原告人入出扉.RBU'];
surfaces['原告人入出扉.U'] = ['原告人入出扉.LFU', '原告人入出扉.RFU', '原告人入出扉.RBU', '原告人入出扉.LBU'];
surfaces['傍聴人入出扉.L'] = ['傍聴人入出扉.LFU', '傍聴人入出扉.LFD', '傍聴人入出扉.LBD', '傍聴人入出扉.LBU'];
surfaces['傍聴人入出扉.R'] = ['傍聴人入出扉.RFU', '傍聴人入出扉.RFD', '傍聴人入出扉.RBD', '傍聴人入出扉.RBU'];
surfaces['傍聴人入出扉.U'] = ['傍聴人入出扉.LFU', '傍聴人入出扉.RFU', '傍聴人入出扉.RBU', '傍聴人入出扉.LBU'];
surfaces['輪郭.FD']        = ['輪郭.LFD', '輪郭.RFD'];
surfaces['輪郭.FU']        = ['輪郭.LFU', '輪郭.RFU'];
surfaces['輪郭.LD']        = ['輪郭.LFD', '輪郭.LBD'];
surfaces['輪郭.LU']        = ['輪郭.LFU', '輪郭.LBU'];
surfaces['輪郭.RD']        = ['輪郭.RFD', '輪郭.RBD'];
surfaces['輪郭.RU']        = ['輪郭.RFU', '輪郭.RBU'];
surfaces['輪郭.BD']        = ['輪郭.LBD', '輪郭.RBD'];
surfaces['輪郭.BU']        = ['輪郭.LBU', '輪郭.RBU'];

const scale = 2.5;

Object.keys(coordinates).forEach((c) => {
  coordinates[c].X *= scale;
  coordinates[c].Z *= scale;
  coordinates[c].Y *= scale;
});
// Object.keys(surfaces).forEach((s) => {
//   surfaces[s].forEach((c) => {
//     if (!coordinates[c]) console.log(c);
//   });
// });
