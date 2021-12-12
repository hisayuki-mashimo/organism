const coordinates = {};
const surfaces = {};
const 拡大係数 = 5;
const params = {
  A: {
    佛石D:   { X:  0,   Y: 20, Z:  0,    W:  8, H: 20, A:  8 },
    上台:    { X:  0,   Y: 11, Z:  0,    W: 12, H:  9, A: 12 },
    下台:    { X:  0,   Y:  0, Z:  0,    W: 19, H: 11, A: 19 },
    供物台U: { X:  0,   Y: 17, Z:  7.75, W: 10, H:  1, A:  4 },
    供物台D: { X:  0,   Y: 11, Z:  7.75, W:  8, H:  5, A:  4 },
    花立石L: { X:  7.5, Y:  2, Z: 11.5,  W:  4, H: 16, A:  4 },
    花立石R: { X: -7.5, Y:  2, Z: 11.5,  W:  4, H: 16, A:  4 },
    水鉢石:  { X:  0,   Y:  2, Z: 12.5,  W: 11, H:  9, A:  4 },
    水鉢台:  { X:  0,   Y:  0, Z: 13.5,  W: 19, H:  2, A:  8 },
  },
  B: {
    佛石D:   { X:  0,   Y: 19, Z:  0,    W: 10, H: 18, A:  8 },
    上台:    { X:  0,   Y: 11, Z:  0,    W: 14, H:  8, A: 14 },
    下台:    { X:  0,   Y:  0, Z:  0,    W: 19, H: 11, A: 19 },
    供物台U: { X:  0,   Y: 17, Z:  7.75, W: 10, H:  1, A:  4 },
    供物台D: { X:  0,   Y: 11, Z:  7.75, W: 10, H:  5, A:  4 },
    花立石L: { X:  7.5, Y:  2, Z: 11.5,  W:  4, H: 12, A:  4 },
    花立石R: { X: -7.5, Y:  2, Z: 11.5,  W:  4, H: 12, A:  4 },
    水鉢石:  { X:  0,   Y:  2, Z: 12.5,  W: 11, H:  9, A:  4 },
    水鉢台:  { X:  0,   Y:  0, Z: 13.5,  W: 19, H:  2, A:  8 },
  },
  C: {
    佛石D:   { X:  0,   Y: 21, Z:  0,    W:  9, H: 21, A:  8 },
    上台:    { X:  0,   Y: 11, Z:  0,    W: 14, H: 10, A: 12 },
    下台:    { X:  0,   Y:  0, Z:  0,    W: 21, H: 11, A: 19 },
    供物台U: { X:  0,   Y: 17, Z:  7.75, W: 12, H:  1, A:  4 },
    供物台D: { X:  0,   Y: 11, Z:  7.75, W: 10, H:  5, A:  4 },
    花立石L: { X:  8.5, Y:  2, Z: 11.5,  W:  4, H: 14, A:  4 },
    花立石R: { X: -8.5, Y:  2, Z: 11.5,  W:  4, H: 14, A:  4 },
    水鉢石:  { X:  0,   Y:  2, Z: 12.5,  W: 11, H:  9, A:  4 },
    水鉢台:  { X:  0,   Y:  0, Z: 13.5,  W: 21, H:  2, A:  8 },
  },
};

const make = (code, index, XB, ZB, direction) => {
  Object.keys(params[code]).forEach((K) => {
    const param = params[code][K];
    ['L', 'R'].forEach((D, d) => {
      const X = 拡大係数 * (param.X + param.W / (d === 0 ? 2 : -2)) + XB;
      ['F', 'B'].forEach((M, m) => {
        const Z  = 拡大係数 * (param.Z + param.A / (m === 0 ? 2 : -2)) * direction + ZB;
        const YD = 拡大係数 * param.Y;
        const YU = 拡大係数 * (param.Y + param.H);
        coordinates[`${code}${index}${K}${D}${M}U`] = { X, Y: YU, Z };
        coordinates[`${code}${index}${K}${D}${M}D`] = { X, Y: YD, Z };
      });
    });
    surfaces[`${code}${index}${K}F`] = [`${code}${index}${K}LFU`, `${code}${index}${K}RFU`, `${code}${index}${K}RFD`, `${code}${index}${K}LFD`];
    surfaces[`${code}${index}${K}B`] = [`${code}${index}${K}LBU`, `${code}${index}${K}RBU`, `${code}${index}${K}RBD`, `${code}${index}${K}LBD`];
    surfaces[`${code}${index}${K}L`] = [`${code}${index}${K}LFU`, `${code}${index}${K}LBU`, `${code}${index}${K}LBD`, `${code}${index}${K}LFD`];
    surfaces[`${code}${index}${K}R`] = [`${code}${index}${K}RFU`, `${code}${index}${K}RBU`, `${code}${index}${K}RBD`, `${code}${index}${K}RFD`];
  });

  ['L', 'R'].forEach((D, d) => {
    ['F', 'B'].forEach((M, m) => {
      coordinates[`${code}${index}佛石U${D}${M}U`] = {
        X: coordinates[`${code}${index}佛石D${D}${M}U`].X + 拡大係数 * (d === 0 ? -1 : 1),
        Y: coordinates[`${code}${index}佛石D${D}${M}U`].Y + 拡大係数 * 1,
        Z: coordinates[`${code}${index}佛石D${D}${M}U`].Z + 拡大係数 * (m === 0 ? -1 : 1) * direction,
      };
    });
  });
  surfaces[`${code}${index}佛石UF`] = [`${code}${index}佛石ULFU`, `${code}${index}佛石URFU`, `${code}${index}佛石DRFU`, `${code}${index}佛石DLFU`];
  surfaces[`${code}${index}佛石UB`] = [`${code}${index}佛石ULBU`, `${code}${index}佛石URBU`, `${code}${index}佛石DRBU`, `${code}${index}佛石DLBU`];
  surfaces[`${code}${index}佛石UL`] = [`${code}${index}佛石ULFU`, `${code}${index}佛石ULBU`, `${code}${index}佛石DLBU`, `${code}${index}佛石DLFU`];
  surfaces[`${code}${index}佛石UR`] = [`${code}${index}佛石URFU`, `${code}${index}佛石URBU`, `${code}${index}佛石DRBU`, `${code}${index}佛石DRFU`];

  surfaces[`${code}${index}供物台MF`] = [`${code}${index}供物台DLFU`, `${code}${index}供物台DRFU`, `${code}${index}供物台URFD`, `${code}${index}供物台ULFD`];
  surfaces[`${code}${index}供物台ML`] = [`${code}${index}供物台DLFU`, `${code}${index}供物台DLBU`, `${code}${index}供物台ULBD`, `${code}${index}供物台ULFD`];
  surfaces[`${code}${index}供物台MR`] = [`${code}${index}供物台DRFU`, `${code}${index}供物台DRBU`, `${code}${index}供物台URBD`, `${code}${index}供物台URFD`];
};

// make('A', 0,  160, -160,  1);
// make('B', 1,    0, -160,  1);
// make('C', 2, -160, -160,  1);
// make('A', 3, -280, -160,  1);
// make('B', 4,  160,  160, -1);
// make('A', 5,    0,  160, -1);
// make('C', 6, -160,  160, -1);
// make('B', 7, -280,  160, -1);
make('A', 0, 0, 0, 1);

