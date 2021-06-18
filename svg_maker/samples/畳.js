
const WX = 910 / 8;
const WZ = WX * 2;
const WA = 60 / 8;
const WH = 28 / 8;
const LM = 64;
const coordinates = {};
const surfaces = {};
const make = (index, X, Z, T, K) => {
  const coordinatesBase = {
    TLFU: { X: WX /  2, Z: WZ /  2, Y: WA /  2 },
    TLBU: { X: WX /  2, Z: WZ / -2, Y: WA /  2 },
    TRFU: { X: WX / -2, Z: WZ /  2, Y: WA /  2 },
    TRBU: { X: WX / -2, Z: WZ / -2, Y: WA /  2 },
    TLFD: { X: WX /  2, Z: WZ /  2, Y: WA / -2 },
    TLBD: { X: WX /  2, Z: WZ / -2, Y: WA / -2 },
    TRFD: { X: WX / -2, Z: WZ /  2, Y: WA / -2 },
    TRBD: { X: WX / -2, Z: WZ / -2, Y: WA / -2 },
    HLFUO: { X: WX /  2,      Z: WZ /  2, Y: WA /  2 },
    HLBUO: { X: WX /  2,      Z: WZ / -2, Y: WA /  2 },
    HLFUI: { X: WX /  2 - WH, Z: WZ /  2, Y: WA /  2 },
    HLBUI: { X: WX /  2 - WH, Z: WZ / -2, Y: WA /  2 },
    HRFUO: { X: WX / -2,      Z: WZ /  2, Y: WA /  2 },
    HRBUO: { X: WX / -2,      Z: WZ / -2, Y: WA /  2 },
    HRFUI: { X: WX / -2 + WH, Z: WZ /  2, Y: WA /  2 },
    HRBUI: { X: WX / -2 + WH, Z: WZ / -2, Y: WA /  2 },
    HLFDO: { X: WX /  2,      Z: WZ /  2, Y: WA / -2 },
    HLBDO: { X: WX /  2,      Z: WZ / -2, Y: WA / -2 },
    HLFDI: { X: WX /  2 - WH, Z: WZ /  2, Y: WA / -2 },
    HLBDI: { X: WX /  2 - WH, Z: WZ / -2, Y: WA / -2 },
    HRFDO: { X: WX / -2,      Z: WZ /  2, Y: WA / -2 },
    HRBDO: { X: WX / -2,      Z: WZ / -2, Y: WA / -2 },
    HRFDI: { X: WX / -2 + WH, Z: WZ /  2, Y: WA / -2 },
    HRBDI: { X: WX / -2 + WH, Z: WZ / -2, Y: WA / -2 },
    ...Array(LM - 1).fill(null).reduce((res, _, i) => ({
      ...res,
      [`M${i}F`]: { X: WX * (-1 / 2 + 1 / LM * (i + 1)), Z: WZ /  2, Y: WA / 2 },
      [`M${i}B`]: { X: WX * (-1 / 2 + 1 / LM * (i + 1)), Z: WZ / -2, Y: WA / 2 },
    }), {}),
  };
  const surfacesBase = {
    // TU: ['TLFU', 'TRFU', 'TRBU', 'TLBU'],
    // TD: ['TLFD', 'TRFD', 'TRBD', 'TLBD'],
    HLU: ['HLFUO', 'HLFUI', 'HLBUI', 'HLBUO'],
    HLD: ['HLFDO', 'HLFDI', 'HLBDI', 'HLBDO'],
    HRU: ['HRFUO', 'HRFUI', 'HRBUI', 'HRBUO'],
    HRD: ['HRFDO', 'HRFDI', 'HRBDI', 'HRBDO'],
  };
  Array(LM - 1).fill(null).forEach((_, i) => {
    surfacesBase[`M${i}`] = [`M${i}F`, `M${i}B`];
  });
  Object.keys(coordinatesBase).forEach((code) => {
    const X1 = coordinatesBase[code].X;
    const Y1 = coordinatesBase[code].Y * Math.cos(K) + coordinatesBase[code].Z * Math.sin(K);
    const Z1 = coordinatesBase[code].Z * Math.cos(K) - coordinatesBase[code].Y * Math.sin(K) - WZ / 2 * (1 - Math.cos(K));
    const X2 = T === 0 ? X1 : (X1 * Math.cos(Math.PI / 2) - Z1 * Math.sin(Math.PI / 2));
    const Z2 = T === 0 ? Z1 : (Z1 * Math.cos(Math.PI / 2) + X1 * Math.sin(Math.PI / 2));
    coordinates[`${index}.${code}`] = {
      X: X2 + X * WX,
      Y: Y1 + WZ / 2 * Math.sin(K),
      Z: Z2 + Z * WX,
    };
  });
  Object.keys(surfacesBase).forEach((code) => {
    surfaces[`${index}.${code}`] = surfacesBase[code].map((c) => `${index}.${c}`);
  });
};

make(0,  0,    0,   0, 80 / 180 * Math.PI);
make(1,  1,    1,   0, 0);
make(2,  1,   -1,   0, 0);
make(3, -1,    0,   0, 0);
make(4, -0.5,  1.5, 1, 0);
make(5, -0.5, -1.5, 1, 0);
