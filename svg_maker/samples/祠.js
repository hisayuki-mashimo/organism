const coordinates = {};
const surfaces = {};

const 屋根B = { Y: 100, R: 100, A: 0.2, S: 0.8, P: 0.5 };
const 屋根S = [
  { T: 44 },
  { T: 40 },
  { T: 36 },
  { T: 32 },
  { T: 28 },
];

const [屋根CS, 屋根W, 屋根H] = 屋根S.reduce(([CS, XU0, YU0, A0, BA0, BS0], { T }, i) => {
  const T1 = T / 180 * Math.PI;
  const XU1 = XU0 + Math.cos(T1);
  const YU1 = YU0 + Math.sin(T1);
  const XA1 = XU1 - Math.sin(T1) * 屋根B.A;
  const YA1 = YU1 + Math.cos(T1) * 屋根B.A;
  const XS1 = XU1 - Math.sin(T1) * 屋根B.S;
  const YS1 = YU1 + Math.cos(T1) * 屋根B.S;
  const A1 = (YU1 - YU0) / (XU1 - XU0);
  const BA1 = YA1 - A1 * XA1;
  const BS1 = YS1 - A1 * XS1;
  const [XA, YA, XS, YS] = i === 0
    ? [0, BA1, 0, BS1]
    : [(BA1 - BA0) / (A0 - A1), A1 * (BA1 - BA0) / (A0 - A1) + BA1, (BS1 - BS0) / (A0 - A1), A1 * (BS1 - BS0) / (A0 - A1) + BS1];
  CS.push({ XU: XU0, YU: YU0, XA, YA, XS, YS });
  if (i === 屋根S.length - 1) {
    const XU2 = XU0 + Math.cos(T1) * 屋根B.P
    const YU2 = YU0 + Math.sin(T1) * 屋根B.P;
    const XA2 = XU2 - Math.sin(T1) * 屋根B.A;
    const YA2 = YU2 + Math.cos(T1) * 屋根B.A;
    const XS2 = XU2 - Math.sin(T1) * 屋根B.S;
    const YS2 = YU2 + Math.cos(T1) * 屋根B.S;

    CS.push({ XU: XU1, YU: YU1, XA: XA1, YA: YA1, XA2, YA2, XS: XS2, YS: YS2 });
  }

  return [CS, XU1, YU1, A1, BA1, BS1];
}, [[], 0, 0.1, null, null]);

屋根CS.forEach(({ XU, YU, XA, YA, XS, YS }, i) => {
  coordinates[`Y${i}ULF`] = { X: XU / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YU) / 屋根W * 屋根B.R, Z: 屋根B.R };
  coordinates[`Y${i}ULB`] = { X: XU / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YU) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 };
  coordinates[`Y${i}URF`] = { X: XU / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YU) / 屋根W * 屋根B.R, Z: 屋根B.R };
  coordinates[`Y${i}URB`] = { X: XU / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YU) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 };
  coordinates[`Y${i}DLF`] = { X: XA / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YA) / 屋根W * 屋根B.R, Z: 屋根B.R };
  coordinates[`Y${i}DLB`] = { X: XA / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YA) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 };
  coordinates[`Y${i}DRF`] = { X: XA / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YA) / 屋根W * 屋根B.R, Z: 屋根B.R };
  coordinates[`Y${i}DRB`] = { X: XA / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YA) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 };

  const [XA2, YA2] = i < 屋根CS.length - 1
    ? [XA, YA]
    : [屋根CS[i].XA2, 屋根CS[i].YA2];
  coordinates[`S${i}ULF`] = { X: XA2 / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YA2) / 屋根W * 屋根B.R, Z: 屋根B.R - 10 };
  coordinates[`S${i}ULB`] = { X: XA2 / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YA2) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 + 10 };
  coordinates[`S${i}URF`] = { X: XA2 / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YA2) / 屋根W * 屋根B.R, Z: 屋根B.R - 10 };
  coordinates[`S${i}URB`] = { X: XA2 / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YA2) / 屋根W * 屋根B.R, Z: 屋根B.R * -1 + 10 };
  coordinates[`S${i}DLF`] = { X: XS  / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YS)  / 屋根W * 屋根B.R, Z: 屋根B.R - 10 };
  coordinates[`S${i}DLB`] = { X: XS  / 屋根W * 屋根B.R,      Y: 屋根B.Y + (屋根H - YS)  / 屋根W * 屋根B.R, Z: 屋根B.R * -1 + 10 };
  coordinates[`S${i}DRF`] = { X: XS  / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YS)  / 屋根W * 屋根B.R, Z: 屋根B.R - 10 };
  coordinates[`S${i}DRB`] = { X: XS  / 屋根W * 屋根B.R * -1, Y: 屋根B.Y + (屋根H - YS)  / 屋根W * 屋根B.R, Z: 屋根B.R * -1 + 10 };
  if (i > 0) {
    surfaces[`Y${i}UL`] = [`Y${i - 1}ULF`, `Y${i - 1}ULB`, `Y${i}ULB`, `Y${i}ULF`];
    surfaces[`Y${i}UR`] = [`Y${i - 1}URF`, `Y${i - 1}URB`, `Y${i}URB`, `Y${i}URF`];
    surfaces[`Y${i}DL`] = [`Y${i - 1}DLF`, `Y${i - 1}DLB`, `Y${i}DLB`, `Y${i}DLF`];
    surfaces[`Y${i}DR`] = [`Y${i - 1}DRF`, `Y${i - 1}DRB`, `Y${i}DRB`, `Y${i}DRF`];

    surfaces[`S${i}FL`] = [`S${i - 1}ULF`, `S${i - 1}DLF`, `S${i}DLF`, `S${i}ULF`];
    surfaces[`S${i}FR`] = [`S${i - 1}URF`, `S${i - 1}DRF`, `S${i}DRF`, `S${i}URF`];
    surfaces[`S${i}BL`] = [`S${i - 1}ULB`, `S${i - 1}DLB`, `S${i}DLB`, `S${i}ULB`];
    surfaces[`S${i}BR`] = [`S${i - 1}URB`, `S${i - 1}DRB`, `S${i}DRB`, `S${i}URB`];
  }
});

surfaces.SL = [`S${屋根CS.length - 1}ULF`, `S${屋根CS.length - 1}DLF`, `S${屋根CS.length - 1}DLB`, `S${屋根CS.length - 1}ULB`];
surfaces.SR = [`S${屋根CS.length - 1}URF`, `S${屋根CS.length - 1}DRF`, `S${屋根CS.length - 1}DRB`, `S${屋根CS.length - 1}URB`];

const 支柱B = { P: 60, A: 15 };

[ 'T', 'Z', 'N', 'B' ].forEach((C, i) => {
  const T = Math.PI * (i / 2 + 1 / 4);
  const XB = 支柱B.P * Math.pow(2, 1 / 2) * Math.sin(T);
  const ZB = 支柱B.P * Math.pow(2, 1 / 2) * Math.cos(T);
  ['L', 'R'].forEach((D, j) => {
    const X = XB + 支柱B.A / (j === 0 ? 2 : -2);
    ['F', 'B'].forEach((I, k) => {
      const Z = ZB + 支柱B.A / (k === 0 ? 2 : -2);
      coordinates[`C1${C}${I}${D}`] = { X, Y:  115, Z };
      coordinates[`C2${C}${I}${D}`] = { X, Y:  100, Z };
      coordinates[`C3${C}${I}${D}`] = { X, Y:   70, Z };
      coordinates[`C4${C}${I}${D}`] = { X, Y:   55, Z };
      coordinates[`C5${C}${I}${D}`] = { X, Y:  -50, Z };
      coordinates[`C6${C}${I}${D}`] = { X, Y:  -65, Z };
    });
  });
  surfaces[`C1${C}F`] = [`C2${C}FL`, `C2${C}FR`, `C3${C}FR`, `C3${C}FL`];
  surfaces[`C1${C}B`] = [`C2${C}BL`, `C2${C}BR`, `C3${C}BR`, `C3${C}BL`];
  surfaces[`C2${C}F`] = [`C4${C}FL`, `C4${C}FR`, `C5${C}FR`, `C5${C}FL`];
  surfaces[`C2${C}B`] = [`C4${C}BL`, `C4${C}BR`, `C5${C}BR`, `C5${C}BL`];
});

[1, 3, 5].forEach((N) => {
  surfaces[`CD${N}F`] = [`C${N}TFL`, `C${N + 1}TFL`, `C${N + 1}BFR`, `C${N}BFR`];
  surfaces[`CD${N}B`] = [`C${N}ZBL`, `C${N + 1}ZBL`, `C${N + 1}NBR`, `C${N}NBR`];
  surfaces[`CD${N}L`] = [`C${N}TBL`, `C${N + 1}TBL`, `C${N + 1}ZFL`, `C${N}ZFL`];
  surfaces[`CD${N}R`] = [`C${N}BBR`, `C${N + 1}BBR`, `C${N + 1}NFR`, `C${N}NFR`];
});

[2, 4].forEach((N) => {
  ['L', 'R'].forEach((D, i) => {
    const DP = (支柱B.P + 支柱B.A / 2 - 5) * (i === 0 ? 1 : -1);
    const IX = (支柱B.P - 支柱B.A / 2) * (i === 0 ? 1 : -1);
    ['F', 'B'].forEach((I, j) => {
      const IZ = (支柱B.P + 支柱B.A / 2 - 5) * (j === 0 ? 1 : -1);
      const DZ = (支柱B.P - 支柱B.A / 2) * (j === 0 ? 1 : -1);
      coordinates[`K${N}${I}${D}U`] = { X: IX, Y: coordinates[`C${N}TFL`].Y, Z: IZ };
      coordinates[`K${N}${I}${D}D`] = { X: IX, Y: coordinates[`C${N + 1}TFL`].Y, Z: IZ };
      coordinates[`K${N}${D}${I}U`] = { X: DP, Y: coordinates[`C${N}TFL`].Y, Z: DZ };
      coordinates[`K${N}${D}${I}D`] = { X: DP, Y: coordinates[`C${N + 1}TFL`].Y, Z: DZ };
    });
  });
    if (N !== 4) {
      surfaces[`K${N}F`] = [`K${N}FLU`, `K${N}FRU`, `K${N}FRD`, `K${N}FLD`];
    }
    surfaces[`K${N}B`] = [`K${N}BLU`, `K${N}BRU`, `K${N}BRD`, `K${N}BLD`];
    surfaces[`K${N}L`] = [`K${N}LFU`, `K${N}LFD`, `K${N}LBD`, `K${N}LBU`];
    surfaces[`K${N}R`] = [`K${N}RFU`, `K${N}RFD`, `K${N}RBD`, `K${N}RBU`];
});

coordinates.TU = { ...coordinates.C4TFL, X: 0 };
coordinates.TD = { ...coordinates.C5TFL, X: 0 };
surfaces.TL = ['C4TFR', 'TU', 'TD', 'C5TFR'];
surfaces.TR = ['C4BFL', 'TU', 'TD', 'C5BFL'];

['L', 'R'].forEach((D, i) => {
  ['F', 'B'].forEach((I, j) => {
    coordinates[`N${I}${D}U`] = { X: i === 0 ? 7 : -7, Y: coordinates.Y0ULF.Y + 15, Z: (屋根B.R + 3) * (j === 0 ? 1 : -1) };
    coordinates[`N${I}${D}D`] = { X: i === 0 ? 7 : -7, Y: coordinates.Y0ULF.Y -  4, Z: (屋根B.R + 3) * (j === 0 ? 1 : -1) };
  });
});
surfaces.NL = ['NFLU', 'NFLD', 'NBLD', 'NBLU'];
surfaces.NR = ['NFRU', 'NFRD', 'NBRD', 'NBRU'];

const 穴B = [
  {X: 0,   Y:  9 },
  {X: 1,   Y:  8.3 },
  {X: 2,   Y:  7.8 },
  {X: 3,   Y:  7 },
  {X: 4,   Y:  6 },
  {X: 5,   Y:  4 },
  {X: 6,   Y:  1 },
  {X: 5,   Y: -2.5 },
  {X: 4,   Y: -3 },
  {X: 3.2, Y: -4 },
  {X: 1.8, Y: -4 },
  {X: 0,   Y: -1 },
];

surfaces['AL'] = [];
surfaces['AR'] = [];

穴B.forEach((A, i) => {
  ['L', 'R'].forEach((D1, j) => {
    const XB = 20 * (j === 0 ? 1 : -1);
    if (i === 0 || i === 穴B.length - 1) {
      coordinates[`A${D1}${i}`] = { ...A, X: XB, Z: 支柱B.P + 支柱B.A / 2 };
      surfaces[`A${D1}`].push(`A${D1}${i}`);
    } else {
      ['L', 'R'].forEach((D2, k) => {
        const X = XB + A.X * (k === 0 ? 1 : -1);
        coordinates[`A${D1}${i}${D2}`] = { X, Y: A.Y, Z: 支柱B.P + 支柱B.A / 2 };
        k
          ? surfaces[`A${D1}`].push(`A${D1}${i}${D2}`)
          : surfaces[`A${D1}`].unshift(`A${D1}${i}${D2}`);
      });
    }
  });
});
