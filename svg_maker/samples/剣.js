const [coordinates, surfaces] = [
  [ { X: 10, Y:   0, Z: 0     }, { X: 15, Y:  200, Z:  0     }, { X: 0, Y:  200, Z:  4     }, { X: 0, Y:   0, Z:  8 / 3 } ], // 主面
  [ { X: 15, Y: 200, Z: 0     }, { X:  0, Y:  200, Z:  4     }, { X: 0, Y:  280, Z:  0     } ], // 上面
  [ { X:  5, Y: 200, Z: 8 / 3 }, { X:  0, Y:  230, Z:  5 / 2 }, { X: 0, Y:  200, Z:  4     } ], // 装飾上
  [ { X:  5, Y: 200, Z: 8 / 3 }, { X:  0, Y:  200, Z:  4     }, { X: 0, Y:  100, Z: 10 / 3 } ], // 装飾下
  [ { X: 40, Y:   0, Z: 5     }, { X: 32, Y:  -10, Z:  4     }, { X: 0, Y:  -10, Z:  5     }, { X: 0, Y:   0, Z: 25 / 4 } ], // 鍔
  [ { X: 10, Y: -10, Z: 2     }, { X:  8, Y:  -95, Z:  8 / 5 }, { X: 0, Y:  -95, Z: 16 / 5 }, { X: 0, Y: -10, Z:  4     } ], // 柄上
  [ { X:  8, Y: -95, Z: 8 / 5 }, { X:  0, Y:  -95, Z: 16 / 5 }, { X: 0, Y: -105, Z:  0     } ], // 柄下
].reduce((res, params, index) => {
  params.forEach((c, n) => {
    res[0][`C${index}.${n}FL`] = { ...c };
    res[0][`C${index}.${n}FR`] = { ...c, X: c.X * -1 };
    res[0][`C${index}.${n}BL`] = { ...c, Z: c.Z * -1 };
    res[0][`C${index}.${n}BR`] = { ...c, X: c.X * -1, Z: c.Z * -1 };
  });
  res[1][`C${index}FL`] = params.map((c, n) => `C${index}.${n}FL`);
  res[1][`C${index}FR`] = params.map((c, n) => `C${index}.${n}FR`);
  res[1][`C${index}BL`] = params.map((c, n) => `C${index}.${n}BL`);
  res[1][`C${index}BR`] = params.map((c, n) => `C${index}.${n}BR`);
  return res;
}, [{}, {}]);
