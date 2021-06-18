const WL = 24;
const WX = 130;
const WK = 5 / 180 * Math.PI;
const W = [
  { X: -45, R: 45, K: 0 },
  { X: -40, R: 50, K: 0 },
  { X: -20, R: 50, K: 0 },
  { X:  -15, R: 45, K: 0 },
  { X:  -15, R: 42, K: 0 },
  { X:  -15, R: 38, K: 0 },
  { X:  -10, R: 25, K: 0 },
  { X:  7, R: 20, K: 4 / 180 * Math.PI },
  { X:  9, R: 15, K: 4 / 180 * Math.PI },
  { X:  9, R: 12, K: 4 / 180 * Math.PI },
];
const coordinates = {};
const coordinatesW = {};
const surfaces = {};
const surfacesW = {};

Array(WL).fill(null).forEach((_1, i) => {
  const prevI = i > 0 ? i - 1 : WL - 1;
  const T = Math.PI * 2 / WL * i;

  W.forEach((w, j) => {
    const BY = Math.cos(T) * w.R;
    const X = Math.sin(w.K) * BY + w.X;
    const Y = Math.cos(w.K) * BY;
    const Z = Math.sin(T) * w.R;

    coordinatesW[`W${i}.${j}`] = { X, Y, Z };

    if (j > 0) {
      surfacesW[`W${i}.${j}`] = [`W${i}.${j}`, `W${i}.${j - 1}`, `W${prevI}.${j - 1}`, `W${prevI}.${j}`];
    }
  });
});

Object.keys(coordinatesW).forEach((code) => {
  const { X: _X, Y: _Y, Z } = coordinatesW[code];
  const X = Math.sin(WK) * _Y + Math.cos(WK) * _X + WX;
  const Y = Math.cos(WK) * _Y - Math.sin(WK) * _X;
  coordinates[`${code}L`] = { X, Y, Z };
  coordinates[`${code}R`] = { X: X * -1, Y, Z };
});
Object.keys(surfacesW).forEach((code) => {
  surfaces[`${code}L`] = surfacesW[code].map((c) => `${c}L`);
  surfaces[`${code}R`] = surfacesW[code].map((c) => `${c}R`);
});

const SL = 12;
const ST = 200 / 180 * Math.PI;
const SO = 24;
const SR = WX;
const SY = 10;

Array(SL + 1).fill(null).forEach((_, i) => {
  const BY = Math.sin((ST - Math.PI) / 2) * SR + SY;
  const T = ST / SL * i - ST / 2;
  const X = Math.sin(T) * SR;
  const Y = Math.cos(T) * SR + BY;
  coordinates[`S${i}F`] = { X, Y, Z: SO /  2 };
  coordinates[`S${i}B`] = { X, Y, Z: SO / -2 };
  if (i > 0) {
    surfaces[`S${i}F`] = [`S${i - 1}F`, `S${i}F`];
    surfaces[`S${i}B`] = [`S${i - 1}B`, `S${i}B`];
  }
});

const UL = 12;
const UT = 150 / 180 * Math.PI;
const UOA = 30;
const UOI = 10;
const UR = WX - 5;
const UY = 50;

Array(UL + 1).fill(null).forEach((_, i) => {
  const BY = Math.sin((UT - Math.PI) / 2) * UR + UY;
  const T = UT / UL * i - UT / 2;
  const X = Math.sin(T) * UR;
  const Y = Math.cos(T) * UR + BY;
  coordinates[`U${i}F`] = { X, Y, Z: Math.cos(T) * (UOA - UOI) /  2 + UOI / 2 };
  coordinates[`U${i}B`] = { X, Y, Z: Math.cos(T) * (UOA - UOI) / -2 - UOI / 2 };
  if (i > 0) {
    surfaces[`U${i}`] = [`U${i}F`, `U${i - 1}F`, `U${i - 1}B`, `U${i}B`];
  }
});

