const R1 = 150;
const R2 = 150;
const WB = 6.5;
const W1 = 8;
const W2 = 16;
const L  = 30;
const LE = 0;
const A  = 1;

const coordinatesE = [
  { X:  4, Y:  R1 },
  { X:  6, Y:  R1 - 8 },
  { X:  4, Y:  40 },
  { X:  4, Y:  30 },
  { X:  6, Y:  10 },
  { X:  6, Y:  -5 },
  { X:  4, Y: -15 },
  { X:  2, Y: -20 },
];

const W1B = Math.pow(WB * WB - A * A, 1 / 2);
const T = (Math.asin(WB / 2 / R1) + Math.asin(W1B / 2 / R1)) * 2;
const WA1 = Math.pow((WB + W1B) * (WB + W1B) + A * A, 1 / 2);
const T1A1 = Math.acos((WB + W1B) / WA1);
const T1A2 = Math.acos(WA1 / 2 / W1);
const A1 = Math.sin(T1A2 - T1A1) * W1;
const W1A = Math.cos(T1A2 - T1A1) * W1;
const T1A = Math.asin(W1A / 2 / R1) * 2;
const W2A1 = WB * (R1 + R2) / R1;
const W2B1 = W1B * (R1 + R2) / R1;
const WA2 = Math.pow((W2A1 + W2B1) * (W2A1 + W2B1) + A * A, 1 / 2);
const T2A1 = Math.acos((W2A1 + W2B1) / WA2);
const T2A2 = Math.acos(WA2 / 2 / W2);
const A2 = Math.sin(T2A2 - T2A1) * W2;
const W2A = Math.cos(T2A2 - T2A1) * W2;
const T2A = Math.asin(W2A / 2 / (R1 + R2)) * 2;

const coordinates = {};
const surfaces = {};

const calculateTheta = (X1, Y1, X2, Y2) => {
  const W = Math.pow(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2), 1 / 2);
  let T = Math.acos(Math.abs(X2 - X1) / W);
  if (X2 < X1) T = Math.PI - T;
  if (Y2 < Y1) T *= -1;

  return T;
};

Array(L).fill(null).forEach((_, i) => {
  const T1 = T * (i > LE ? i - LE : 0);
  const ZB = A * L / 2 - A * i;
  const X1A = Math.sin(T1) * R1;
  const Y1A = Math.cos(T1) * R1;
  const X1B = Math.sin(T1 + T1A) * R1;
  const Y1B = Math.cos(T1 + T1A) * R1;
  const X2A = Math.sin(T1) * (R1 + R2);
  const Y2A = Math.cos(T1) * (R1 + R2);
  const X2B = Math.sin(T1 + T2A) * (R1 + R2);
  const Y2B = Math.cos(T1 + T2A) * (R1 + R2);
  const Z1A = ZB - (i <= LE || i === L - 1 ? 0 : A1 / 2);
  const Z1B = ZB + (i <= LE || i === L - 1 ? 0 : A1 / 2);
  const Z2A = ZB - (i <= LE || i === L - 1 ? 0 : A1 / 2);
  const Z2B = ZB + (i <= LE || i === L - 1 ? 0 : A1 / 2);
  coordinates[`D${i}.1A`] = { X: X1A, Y: Y1A, Z: Z1A };
  coordinates[`D${i}.1B`] = { X: X1B, Y: Y1B, Z: Z1B };
  coordinates[`D${i}.2A`] = { X: X2A, Y: Y2A, Z: Z2A };
  coordinates[`D${i}.2B`] = { X: X2B, Y: Y2B, Z: Z2B };
  if (i > 0) {
    surfaces[`D${i - 1}.2B`] = [`D${i - 1}.1B`, `D${i}.1A`, `D${i}.2A`, `D${i - 1}.2B`];
  }
  surfaces[`D${i}2A`] = [`D${i}.1A`, `D${i}.1B`, `D${i}.2B`, `D${i}.2A`];
  surfaces[`E${i}D`] = [];
  const EsinBase = Math.sin(T1 + T1A / 2);
  const EcosBase = Math.cos(T1 + T1A / 2);
  coordinatesE.forEach((c, j) => {
    coordinates[`E${i}.${j}LD`] = { X: EcosBase * c.X + EsinBase * c.Y, Y: EcosBase * c.Y - EsinBase * c.X, Z: ZB };
    surfaces[`E${i}D`].push(`E${i}.${j}LD`);
  });
  [...coordinatesE].reverse().forEach((c, j) => {
    coordinates[`E${i}.${j}RD`] = { X: EsinBase * c.Y - EcosBase * c.X, Y: EcosBase * c.Y + EsinBase * c.X, Z: ZB };
    surfaces[`E${i}D`].push(`E${i}.${j}RD`);
  });
  if (i === 0 || i === L - 1) {
    surfaces[`E${i}D`] = surfaces[`E${i}D`].concat([`D${i}.2A`, `D${i}.2B`]);
    surfaces[`E${i}U`] = [];
    surfaces[`E${i}D`].map((presCode, j, surface) => {
      const prevCode = surface[(j === 0 ? surface.length : j) - 1];
      const prevCoordinate = coordinates[prevCode];
      const presCoordinate = coordinates[presCode];
      const CT = calculateTheta(prevCoordinate.X, prevCoordinate.Y, presCoordinate.X, presCoordinate.Y);
    
      return {
        X1: prevCoordinate.X - Math.cos(CT + Math.PI / 2) * 2,
        Y1: prevCoordinate.Y - Math.sin(CT + Math.PI / 2) * 2,
        X2: presCoordinate.X - Math.cos(CT + Math.PI / 2) * 2,
        Y2: presCoordinate.Y - Math.sin(CT + Math.PI / 2) * 2,
      };
    }).map((presPos, j) => {
      const funcs = { A: null, B: null, X: null, Y: null };

      if (presPos.X2 !== presPos.X1 && presPos.Y2 !== presPos.Y1) {
        funcs.A = (presPos.Y2 - presPos.Y1) / (presPos.X2 - presPos.X1);
        funcs.B = presPos.Y2 - funcs.A * presPos.X2;
      } else {
        funcs.X = presPos.X2 === presPos.X1 ? presPos.X2 : null;
        funcs.Y = presPos.Y2 === presPos.Y1 ? presPos.Y2 : null;
      }
    
      return funcs;
    }).forEach((presFx, j, funcs) => {
      const prevFx = funcs[(j === 0 ? funcs.length : j) - 1];
      const { A, B } = presFx.A !== null ? presFx : prevFx;

      let X = 0;
      let Y = 0;
    
      if (presFx.X !== null || prevFx.X !== null) {
        X = presFx.X !== null ? presFx.X : prevFx.X;
        Y = presFx.Y !== null ? presFx.Y : prevFx.Y !== null ? prevFx.Y : X * A + B;
      } else if (presFx.Y !== null || prevFx.Y !== null) {
        X = presFx.X !== null ? presFx.X : prevFx.X !== null ? prevFx.X : (Y - B) / A;
        Y = presFx.Y !== null ? presFx.Y : prevFx.Y;
      } else {
        X = (prevFx.B - presFx.B) / (presFx.A - prevFx.A);
        Y = presFx.A * X + presFx.B;
      }

      coordinates[`E${i}U${j}`] = { X, Y, Z: ZB + (i === 0 ? 2 : -2) };
      surfaces[`E${i}U`].push(`E${i}U${j}`);
    });
  }
});

const colors = {
  default: [255, 255, 255],
  D: [255, 200, 224],
  E: [200, 160, 128],
};

const strokeColors = {
  default: [0, 0, 0],
  D: [176, 80, 96],
};
