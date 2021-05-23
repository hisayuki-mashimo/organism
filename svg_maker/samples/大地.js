const R = 150;
const latitudeL = 20;
const landL = 3;
const STATUS_SEA = 1;
const STATUS_LAND = 2;

const latitudeW = R * Math.PI / latitudeL;
const coordinates = {
  N: { X: 0, Y: R,      Z: 0 },
  S: { X: 0, Y: R * -1, Z: 0 },
};
const surfaces = {};
const terrainParams = { N: [], S: [] };

Array(Math.ceil(latitudeL / 2)).fill(null).forEach((_1, i) => {
  const TI1 = Math.PI / latitudeL * (i);
  const TI2 = Math.PI / latitudeL * (i + 1);
  const RI1 = Math.sin(TI1) * R;
  const RI2 = Math.sin(TI2) * R;
  const Y1 = Math.cos(TI1) * R;
  const Y2 = Math.cos(TI2) * R;
  const longitudeW = RI2 * Math.PI * 2;
  const longitudeL = Math.round(longitudeW / latitudeW);

  terrainParams.N[i] = [];
  terrainParams.S[i] = [];

  Array(longitudeL).fill(null).forEach((_2, k2) => {
    const k1 = k2 > 0 ? k2 - 1 : longitudeL - 1;
    const TK = Math.PI * 2 / longitudeL * k2;
    const X1 = Math.sin(TK) * RI1;
    const X2 = Math.sin(TK) * RI2;
    const Z1 = Math.cos(TK) * RI1;
    const Z2 = Math.cos(TK) * RI2;

    ['N', 'S'].forEach((v) => {
      coordinates[`${v}.I${i + 1}.K${k2}.1`] = { X: X1, Y: Y1 * (v === 'N' ? 1 : -1), Z: Z1 };
      coordinates[`${v}.I${i + 1}.K${k2}.2`] = { X: X2, Y: Y2 * (v === 'N' ? 1 : -1), Z: Z2 };

      if (i === 0) {
        terrainParams[v][i][k2] = { S: 0, C: [v, `${v}.I${i + 1}.K${k1}.2`, `${v}.I${i + 1}.K${k2}.2`] };
      } else {
        terrainParams[v][i][k2] = { S: 0, C: [`${v}.I${i + 1}.K${k1}.1`, `${v}.I${i + 1}.K${k1}.2`, `${v}.I${i + 1}.K${k2}.2`, `${v}.I${i + 1}.K${k2}.1`] };
      }
    });
    if (latitudeL % 2 && i + 2 > latitudeL / 2) {
      terrainParams.N[i + 1][k2] = { S: 0, C: [`N.I${i + 1}.K${k1}.2`, `S.I${i + 1}.K${k1}.2`, `S.I${i + 1}.K${k2}.2`, `N.I${i + 1}.K${k2}.2`] };
    }
  });
});

const params = terrainParams.N.concat(terrainParams.S.reverse());

const colors = {
  default: '#0044ff',
  L: '#22aa22',
  C: '#ffaaaa',
  LC: '#aa44aa',
};
const strokeColors = {
  default: '#002288',
};

const getSurface = (latitude, longitude) => {
  const i = latitude === 1 ? 0 : Math.floor(latitude * latitudeL);
  const k = longitude === 1 ? 0 : Math.floor(longitude * params[i].length);

  return [i, k];
};

const getAroundSurfaces = (latitude, longitude, surfaceL) => {
  const aroundSurfaces = [];

  const TI = Math.PI * latitude;
  const TK = Math.PI * longitude * 2;
  const TL = Math.PI / latitudeL * surfaceL;
  const LT = Math.max(Math.ceil(surfaceL * 2 * Math.PI) * 2, 8);
  const RL = Math.sin(TL);
  const ZL = Math.cos(TL);

  Array(LT).fill(null).forEach((_, i) => {
    const T = Math.PI * 2 / LT * i;
    const I = Math.cos(T) * RL;
    const K = Math.sin(T) * RL;
    const ZL2 = Math.pow(I * I + ZL * ZL, 1 / 2);
    const TI2 = TI - Math.asin(I / ZL2);
    const Z = Math.sin(TI2) * ZL2;
    const Y = Math.cos(TI2) * ZL2;
    const TI3 = (Math.acos(Y) * (Z >= 0 ? 1 : -1)) % Math.PI;
    const TK2 = (TK + (K !== 0 ? Math.atan(K / Z) : 0)) % (Math.PI * 2);
    let I2 = TI3 / Math.PI;
    let K2 = TK2 / Math.PI / 2;
    if (I2 < 0) {
      I2 = I2 * -1;
      K2 += 1 / 2;
    }
    if (K2 < 0) {
      K2 += 1;
    } else if (K2 > 1) {
      K2 -= 1;
    }
    const [PI, PK] = getSurface(I2, K2);
    if (!aroundSurfaces.find((pi, pk) => PI === pi && PK === pk)) {
      aroundSurfaces.push([PI, PK, I2, K2]);
    }
  });

  return aroundSurfaces;
};

const landS = 4;
Array(4).fill(null).forEach((_1) => {
  const [ti, tk] = [Math.random(), Math.random()];
  const [ib, kb] = getSurface(ti, tk);
  // console.log(`
  // ${ti} >> ${ib}
  // ${tk} >> ${kb}
  // `);
  params[ib][kb].S = STATUS_LAND;

  Array(landS).fill(null).forEach((_2, c) => {
    getAroundSurfaces(ti, tk, c + 1).forEach(([i, k, ti, tk]) => {
      const [S, L, U] = getAroundSurfaces(ti, tk, 1).reduce(([s, l, u], [ai, ak]) => {
        if (params[i][k].S !== 0) return [s, l, u];

        switch (params[ai][ak].S) {
          case STATUS_SEA:
            return [s + 1, l, u];
          case STATUS_LAND:
            return [s, l + 1, u];
          default:
            return [s, l, u + 1];
        }
      }, [0, 0, 0]);

      const denominator = 5 * (landS - 1) + 3 * L * (landS - 1) + 2 * S * landS + U;
      const percentage = (5 * (landS - 1) + 3 * L * (landS - 1)) / denominator;
      const rand = Math.random();
      // console.log(`(${c}) [${i}.${k}] : ${Math.ceil(percentage * 100)}% >>> ${rand < percentage ? '○' : '×'}(${Math.floor(rand * 100)})`);
      params[i][k].S = rand < percentage ? STATUS_LAND : STATUS_SEA;
    });
  });
  params[ib][kb].S += 5;
});

params.forEach((param1, i) => {
  param1.forEach((param2, k) => {
    // surfaces[`${param2.S === 1 ? 'L' : 'S'}.${i}.${k}`] = param2.C;
    surfaces[`${
      param2.S === STATUS_LAND
        ? 'L'
        : param2.S === STATUS_LAND + 5
          ? 'C'
          : param2.S === 3
            ? 'LC'
            : 'S'
    }.${i}.${k}`] = param2.C;
  });
});
