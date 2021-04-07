サンプル: 床
const [W, L] = [20, 8];
const [coordinates, surfaces] =
  Array(L).fill(0).reduce((resX, _, xn) =>
    Array(L).fill(0).reduce((resZ, _, zn) => [{
      ...resZ[0],
      [`${xn}.${zn}A`]: { X: W * (L * -1 + xn * 2 - 1 / 2), Y: 0, Z: W * (L * -1 + zn * 2 - 1 / 2) },
      [`${xn}.${zn}B`]: { X: W * (L * -1 + xn * 2 - 1 / 2), Y: 0, Z: W * (L * -1 + zn * 2 + 1 / 2) },
      [`${xn}.${zn}C`]: { X: W * (L * -1 + xn * 2 + 1 / 2), Y: 0, Z: W * (L * -1 + zn * 2 + 1 / 2) },
      [`${xn}.${zn}D`]: { X: W * (L * -1 + xn * 2 + 1 / 2), Y: 0, Z: W * (L * -1 + zn * 2 - 1 / 2) },
    }, {
      ...resZ[1],
      [`${xn}.${zn}S`]: [`${xn}.${zn}A`, `${xn}.${zn}B`, `${xn}.${zn}C`, `${xn}.${zn}D`],
      ...(xn > 0 && zn > 0 ? {
        [`${xn}.${zn}Z`]: [`${xn - 1}.${zn - 1}C`, `${xn - 1}.${zn}D`, `${xn}.${zn}A`, `${xn}.${zn - 1}B`]
      } : {})
    }], resX), [{}, {}]);
