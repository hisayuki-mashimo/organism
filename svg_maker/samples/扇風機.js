const coordinates = {};
const surfaces = {};
const params = {
  羽根枚数: 3,
  羽根径: [
    [37,  83],
    [37,  89],
    [37,  92],
    [37,  93],
    [37,  94],
    [37,  95],
    [37,  96],
    [37,  97],
    [37,  98],
    [37,  99],
    [37, 100],
    [37, 100],
    [37, 100],
    [37,  98],
  ],
  羽根幅: [
    [  0 / 3000, 601 / 3000],
    [ -5 / 3000, 601 / 3000],
    [ -9 / 3000, 603 / 3000],
    [-12 / 3000, 605 / 3000],
    [-11 / 3000, 607 / 3000],
    [ -9 / 3000, 609 / 3000],
    [ -7 / 3000, 609 / 3000],
    [ -4 / 3000, 611 / 3000],
    [  0 / 3000, 615 / 3000],
    [  6 / 3000, 615 / 3000],
    [ 11 / 3000, 615 / 3000],
    [ 18 / 3000, 620 / 3000],
    [ 26 / 3000, 621 / 3000],
    [ 34 / 3000, 626 / 3000],
    [ 44 / 3000, 637 / 3000],
    [ 58 / 3000, 647 / 3000],
    [ 73 / 3000, 630 / 3000],
    [ 94 / 3000, 580 / 3000],
  ],
  羽根傾斜: [15, 25],
  柵数: 24,
  柵形状F: [
    [ 48, 139],
    [ 55, 140],
    [ 65, 139],
    [ 75, 138],
    [ 85, 136],
    [ 95, 134],
    [105, 131],
    [115, 127],
    [125, 123],
    [135, 116],
    [145, 106],
    [150,  81],
  ],
  柵形状B: [
    [ 48, 38],
    [ 55, 38],
    [ 65, 37],
    [ 75, 35],
    [ 85, 36],
    [ 95, 37],
    [105, 38],
    [115, 42],
    [125, 46],
    [135, 51],
    [145, 59],
    [150, 81],
  ],
  電動機形状: [
    [57,  34],
    [52, -54],
    [47, -84],
    [44, -89],
    [22, -95],
  ],
  操作器位置: { Z: -60, Y: 48 },
  操作器形状: [
    [ 5,  0],
    [ 5, 10],
    [10, 12],
    [10, 18],
    [ 7, 20],
    [ 5, 20],
    [ 3, 18],
  ],
  支柱位置: { Z: 0, Y: -50 },
  支柱形状: [
    [ 21,    0 ],
    [ 18,  -40 ],
    [ 18, -200 ],
    [ 22, -200 ],
    [ 22, -400 ],
    [ 24, -410 ],
    [ 28, -420 ],
  ],
  台位置: { Z: 30, Y: -470 },
  台形状: [
    [ 30,  -7],
    [ 45,  -8],
    [ 65, -10],
    [ 85, -16],
    [105, -22],
    [125, -30],
    [145, -40],
    [145, -48],
  ],
  送風縦角度: -10 / 180 * Math.PI,
  送風横角度:  12 / 180 * Math.PI,
};

const 送風機構座標計算 = (LX0, LY0, LZ0) => {
  const RY0 = LX0 === 0 ? LZ0 : Math.pow(LX0 * LX0 + LZ0 * LZ0, 1 / 2);
  const TY0 = LX0 === 0 ? 0 : Math.acos(LZ0 / RY0) * (LX0 >= 0 ? 1 : -1);
  const TY1 = TY0 + params.送風横角度;
  const LX1 = TY1 === TY0 ? LX1 : Math.sin(TY1) * RY0;
  const LZ1 = TY1 === TY0 ? LZ1 : Math.cos(TY1) * RY0;

  const RX1 = Math.pow(LY0 * LY0 + LZ1 * LZ1, 1 / 2);
  const TX1 = Math.acos(LZ1 / RX1) * (LY0 >= 0 ? 1 : -1);
  const TX2 = TX1 + params.送風縦角度;
  const LY2 = TX2 === TX1 ? LY0 : Math.sin(TX2) * RX1;
  const LZ2 = TX2 === TX1 ? LZ1 : Math.cos(TX2) * RX1;

  return { X: LX1, Y: LY2, Z: LZ2 };
};

const 冷却穴TB = Math.PI * 2 / params.羽根枚数 * 0.8 / params.羽根径.length;
const 冷却穴RB = params.電動機形状[0][0] * 0.8;
const 冷却穴ZB = params.電動機形状[0][1];

Array(params.羽根枚数).fill(null).forEach((_, i) => {
  params.羽根幅.forEach(([TS, TW], j) => {
    const T1 = i / params.羽根枚数 + TS;
    const Z1 = (params.羽根傾斜[1] - params.羽根傾斜[0]) / params.羽根幅.length * j + params.羽根傾斜[0];
    params.羽根径.forEach(([RS, RW], k) => {
      const T2 = Math.PI * 2 * (T1 + TW * k / params.羽根径.length);
      const R2 = RS + RW * j / params.羽根幅.length;
      const X2 = Math.sin(T2) * R2;
      const Y2 = Math.cos(T2) * R2;
      const Z2 = Z1 * Math.pow(1 - k / params.羽根径.length, 2) + 71;
      coordinates[`羽根${i}.${j}.${k}`] = 送風機構座標計算(X2, Y2, Z2);
      if (j > 0 && k > 0) {
        surfaces[`H${i}.${j}.${k}`] = [`羽根${i}.${j - 1}.${k - 1}`, `羽根${i}.${j - 1}.${k}`, `羽根${i}.${j}.${k}`, , `羽根${i}.${j}.${k - 1}`];
      }
    });
  });

  const 冷却穴TS = Math.PI * 2 / params.羽根枚数 * i - 冷却穴TB * params.羽根径.length / 2;
  surfaces[`R${i}`] = [];
  params.羽根径.forEach((_, k) => {
    const T1 = 冷却穴TS + 冷却穴TB * k;
    const XO = Math.sin(T1) * 冷却穴RB;
    const YO = Math.cos(T1) * 冷却穴RB;
    const XI = Math.sin(T1) * (冷却穴RB - 10);
    const YI = Math.cos(T1) * (冷却穴RB - 10);
    coordinates[`冷却穴${i}.${k}O`] = 送風機構座標計算(XO, YO, 冷却穴ZB);
    coordinates[`冷却穴${i}.${k}I`] = 送風機構座標計算(XI, YI, 冷却穴ZB);
    surfaces[`R${i}`].push(`冷却穴${i}.${k}O`);
    surfaces[`R${i}`].unshift(`冷却穴${i}.${k}I`);
  });
});

surfaces.SS = [];

Array(params.柵数).fill(null).forEach((_, i) => {
  const T1 = Math.PI * 2 / params.柵数 * i;
  const T2 = Math.PI * 2 / params.柵数 * (i + 1 / 2);
  params.柵形状F.forEach(([R1, Z1], j) => {
    const X1 = Math.sin(T1) * R1;
    const Y1 = Math.cos(T1) * R1;
    coordinates[`柵F${i}.${j}`] = 送風機構座標計算(X1, Y1, Z1);
    if (j > 0) {
      surfaces[`SF${i}.${j}`] = [`柵F${i}.${j - 1}`, `柵F${i}.${j}`];
    }
  });
  params.柵形状B.forEach(([R1, Z1], j) => {
    const X1 = Math.sin(T1) * R1;
    const Y1 = Math.cos(T1) * R1;
    coordinates[`柵B${i}.${j}`] = 送風機構座標計算(X1, Y1, Z1);
    if (j > 0) {
      surfaces[`SB${i}.${j}`] = [`柵B${i}.${j - 1}`, `柵B${i}.${j}`];
    }
  });

  ['F', 'B'].forEach((M, j) => {
    [T1, T2].forEach((T, t) => {
      const XI = Math.sin(T) * 147;
      const YI = Math.cos(T) * 147;
      const XO = Math.sin(T) * 153;
      const YO = Math.cos(T) * 153;
      coordinates[`枠${M}${i}.${t}I`] = 送風機構座標計算(XI, YI, j === 0 ? 83 : 79);
      coordinates[`枠${M}${i}.${t}O`] = 送風機構座標計算(XO, YO, j === 0 ? 83 : 79);
    });
    surfaces[`W${M}${i}.0`] = [`枠${M}${i}.0I`, `枠${M}${i}.0O`, `枠${M}${i}.1O`, `枠${M}${i}.1I`];
    surfaces[`W${M}${i}.1`] = [`枠${M}${i}.1I`, `枠${M}${i}.1O`, `枠${M}${(i + 1) % params.柵数}.0O`, `枠${M}${(i + 1) % params.柵数}.0I`];
  });

  const ZXO = Math.sin(T1) * 37;
  const ZYO = Math.cos(T1) * 37;
  const ZXM = Math.sin(T1) * 33;
  const ZYM = Math.cos(T1) * 33;
  const ZXI = Math.sin(T1) * 27;
  const ZYI = Math.cos(T1) * 27;
  coordinates[`軸${i}OF`] = 送風機構座標計算(ZXO, ZYO,  91);
  coordinates[`軸${i}OB`] = 送風機構座標計算(ZXO, ZYO,  61);
  coordinates[`軸${i}M`]  = 送風機構座標計算(ZXM, ZYM,  91);
  coordinates[`軸${i}I`]  = 送風機構座標計算(ZXI, ZYI, 106);
  surfaces[`Z${i}O`] = [`軸${i}OF`, `軸${i}OB`, `軸${(i + 1) % params.柵数}OB`, `軸${(i + 1) % params.柵数}OF`];
  surfaces[`Z${i}I`] = [`軸${i}M`, `軸${i}I`, `軸${(i + 1) % params.柵数}I`, `軸${(i + 1) % params.柵数}M`];

  const KXO = Math.sin(T1) * 48;
  const KYO = Math.cos(T1) * 48;
  const KXI = Math.sin(T1) * 39;
  const KYI = Math.cos(T1) * 39;
  coordinates[`飾輪${i}O`] = 送風機構座標計算(KXO, KYO, 141);
  coordinates[`飾輪${i}I`] = 送風機構座標計算(KXI, KYI, 145);
  coordinates[`飾輪${i}B`] = 送風機構座標計算(KXO, KYO, 137);
  surfaces.SS.push(`飾輪${i}I`);
  surfaces[`S${i}O`] = [`飾輪${i}I`, `飾輪${i}O`, `飾輪${(i + 1) % params.柵数}O`, `飾輪${(i + 1) % params.柵数}I`];
  surfaces[`S${i}B`] = [`飾輪${i}O`, `飾輪${i}B`, `飾輪${(i + 1) % params.柵数}B`, `飾輪${(i + 1) % params.柵数}O`];
});

const 電動機BYF = Math.cos(Math.PI * 3 / 4) * params.電動機形状[0][0] - 20;
const 電動機BYB = Math.cos(Math.PI * 3 / 4) * params.電動機形状[params.電動機形状.length - 2][0] - 15;
const 電動機BZF = params.電動機形状[0][1];
const 電動機BW = params.電動機形状[params.電動機形状.length - 2][1] - 電動機BZF;

['L', 'R'].forEach((D, d) => {
  Array(17).fill(null).forEach((_, i) => {
    const T1 = Math.PI * i / 16;
    params.電動機形状.forEach(([R1, Z1], j) => {
      if (j >= params.電動機形状.length - 2 || i <= 12) {
        const X1 = Math.sin(T1) * R1 * (d === 0 ? 1 : -1);
        const Y1 = Math.cos(T1) * R1;
        coordinates[`電動機${i}.${j}${D}`] = 送風機構座標計算(X1, Y1, Z1);
        if (i > 0 && j > 0 && (j === params.電動機形状.length - 1 || i <= 12)) {
          surfaces[`DE${i}.${j}${D}`] = [`電動機${i - 1}.${j - 1}${D}`, `電動機${i - 1}.${j}${D}`, `電動機${i}.${j}${D}`, `電動機${i}.${j - 1}${D}`]
        }
        if (i === 12 && j < params.電動機形状.length - 1) {
          coordinates[`電動機B.${j}${D}`] = 送風機構座標計算(X1 * 7 / 8, (電動機BYB - 電動機BYF) * (Z1 - 電動機BZF) / 電動機BW + 電動機BYF, Z1);
          if (j > 0) {
            surfaces[`DEB.${j}${D}`] = [`電動機${i}.${j - 1}${D}`, `電動機B.${j - 1}${D}`, `電動機B.${j}${D}`, `電動機${i}.${j}${D}`];
          }
        }
      }
    });
  });

  Array(7).fill(null).forEach((_, i) => {
    const T = Math.PI / 6 * i;
    params.支柱形状.forEach(([RR, RY], j) => {
      const X = Math.sin(T) * RR / 5 * (d === 0 ? 3 : -3);
      const Z = Math.cos(T) * RR + params.支柱位置.Z;
      const Y = RY + params.支柱位置.Y;
      coordinates[`支柱${i}.${j}${D}`] = { X, Y, Z };
      if (i > 0 && j > 0) {
        surfaces[`C${i}${j}${D}`] = [`支柱${i - 1}.${j - 1}${D}`, `支柱${i - 1}.${j}${D}`, `支柱${i}.${j}${D}`, `支柱${i}.${j - 1}${D}`];
      }
    });
  });

  Array(25).fill(null).forEach((_, i) => {
    const T = Math.PI / 24 * i;
    params.台形状.forEach(([RR, RY], j) => {
      const K = (params.台位置.Z - params.支柱位置.Z) * Math.min(j / (params.台形状.length - 2), 1);
      const X = Math.sin(T) * RR * (d === 0 ? 1 : -1);
      const Z = Math.cos(T) * RR + K + params.支柱位置.Z;
      const Y = RY + params.台位置.Y;
      coordinates[`台${i}.${j}${D}`] = { X, Y, Z };
      if (j === 0) {
        const [SR, SY] = params.支柱形状[params.支柱形状.length - 1];
        const XS = Math.sin(T) * SR / 5 * (d === 0 ? 3 : -3);
        const ZS = Math.cos(T) * SR + params.支柱位置.Z;
        const YS = SY + params.支柱位置.Y;
        coordinates[`台${i}.S${D}`] = { X: XS, Y: YS, Z: ZS };
      }
      if (i > 0) {
        if (j === 0) {
          surfaces[`DA${i}.S${D}`] = [`台${i - 1}.S${D}`, `台${i - 1}.${j}${D}`, `台${i}.${j}${D}`, `台${i}.S${D}`];
        } else {
          surfaces[`DA${i}.${j}${D}`] = [`台${i - 1}.${j - 1}${D}`, `台${i - 1}.${j}${D}`, `台${i}.${j}${D}`, `台${i}.${j - 1}${D}`];
        }
      }
    });
  });

  const [XTD, XTM, XTU] = [40, 36, 30].map((X) => X * (d === 0 ? 1 : -1));
  coordinates[`取手${D}D`] = 送風機構座標計算(XTD, 40, 電動機BZF);
  coordinates[`取手${D}M`] = 送風機構座標計算(XTM, 75, 電動機BZF - 5);
  coordinates[`取手${D}U`] = 送風機構座標計算(XTU, 80, 電動機BZF - 6);
  if (d === 0) {
    coordinates['取手M'] = 送風機構座標計算(0, 80, 電動機BZF - 6);
  }
  surfaces[`T${D}D`] = [`取手${D}D`, `取手${D}M`];
  surfaces[`T${D}M`] = [`取手${D}M`, `取手${D}U`];
  surfaces[`T${D}U`] = [`取手${D}U`, '取手M'];
});

const 指示器位置 = {
  R: params.台形状[params.台形状.length - 2][0],
  Y: params.台形状[params.台形状.length - 2][1] + params.台位置.Y,
};

surfaces.KF = [];
surfaces.KB = [];

Array(12).fill(null).forEach((_, i) => {
  const T0 = Math.PI / 6 * i;
  params.操作器形状.forEach(([R0, Y0], j) => {
    const X1 = Math.sin(T0) * R0;
    const Z1 = Math.cos(T0) * R0 + params.操作器位置.Z;
    const Y1 = Y0 + params.操作器位置.Y;
    coordinates[`操作器${i}.${j}`] = 送風機構座標計算(X1, Y1, Z1);
    if (j > 0) {
      surfaces[`SO${i}.${j}`] = [`操作器${i}.${j - 1}`, `操作器${i}.${j}`, `操作器${(i + 1) % 12}.${j}`, `操作器${(i + 1) % 12}.${j - 1}`];
    }
  });

  const T1 = T0 + Math.PI / 24 * (i % 2 === 0 ? 0.1 : -1.0);
  const T2 = T0 + Math.PI / 24 * (i % 2 === 0 ? 1.0 : -0.1);
  const R1 = 30 * (i % 2 === 0 ? 1.0 : 0.9);
  const R2 = 30 * (i % 2 === 0 ? 0.9 : 1.0);
  const X1 = Math.sin(T1) * R1;
  const Y1 = Math.cos(T1) * R1;
  const X2 = Math.sin(T2) * R2;
  const Y2 = Math.cos(T2) * R2;
  ['F', 'B'].forEach((M, m) => {
    coordinates[`固定器${i}.1${M}`] = 送風機構座標計算(X1, Y1, 電動機BZF + (m === 0 ? 10 : 0));
    coordinates[`固定器${i}.2${M}`] = 送風機構座標計算(X2, Y2, 電動機BZF + (m === 0 ? 10 : 0));
    surfaces[`K${M}`].push(`固定器${i}.1${M}`, `固定器${i}.2${M}`);
  });
});

Array(4).fill(null).forEach((_1, i) => {
  surfaces[`SH${i}`] = [];
  const T0 = Math.PI * (i / 12 - 3 / 24);
  const X0 = Math.sin(T0) * 指示器位置.R;
  const Z0 = Math.cos(T0) * 指示器位置.R;
  Array(12).fill(null).forEach((_2, j) => {
    const T = Math.PI * j / 6;
    const X = Math.sin(T) * 10 + X0;
    const Z = Math.cos(T) * 10 + Z0;
    coordinates[`指示器${i}.${j}`] = { X, Z, Y: 指示器位置.Y + 15 };
    surfaces[`SH${i}`].push(`指示器${i}.${j}`);
  });
});

Array(8).fill(null).forEach((_, i) => {
  const T1 = Math.PI / 4 * i;
  ['F', 'B'].forEach((M, m) => {
    const X1 = Math.sin(T1) * 4;
    const Y1 = Math.cos(T1) * 4;
    const Z1 = 電動機BZF + (m === 0 ? 40 : 10);
    coordinates[`回転軸${i}${M}`] = 送風機構座標計算(X1, Y1, Z1);
  });
  surfaces[`回転軸${i}`] = [`回転軸${i}F`, `回転軸${i}B`, `回転軸${(i + 1) % 8}B`, `回転軸${(i + 1) % 8}F`];
});

Object.keys(coordinates).forEach((code) => {
  // coordinates[code].X *= 4 / 5;
  // coordinates[code].Y *= 4 / 5;
  // coordinates[code].Z *= 4 / 5;
  coordinates[code].Y += 100;
});

const colors = {
  default: '#ffffff',
  H: '#0088aa88',
  R: '#000000',
  Z: '#0088aaee',
  SH: '#ccccff',
  SH0: '#ffaaaa',
};
const strokeColors = {
  default: '#000000aa',
  H: '#00558888',
  Z: '#005588ee',
};
