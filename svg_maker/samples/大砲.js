const HbaseZ = 0;
const HbaseY = 70;
const HL = 16;
const HT = 25 / 360 * Math.PI * 2;
const HWs = [
  { Z:  110, R: 37 },
  { Z:  130, R: 37 },
  { Z:  135, R: 38 },
  { Z:  140, R: 40 },
  { Z:  140, R: 45 },
  { Z:  135, R: 49 },
  { Z:  130, R: 50 },
  { Z:  120, R: 50 },
  { Z:  110, R: 48 },
  { Z:  100, R: 48 },
  { Z:   90, R: 49 },
  { Z:   70, R: 53 },
  { Z:   50, R: 57 },
  { Z:   30, R: 61 },
  { Z:   10, R: 65 },
  { Z:  -10, R: 69 },
  { Z:  -30, R: 72 },
  { Z:  -50, R: 74 },
  { Z:  -70, R: 75 },
  { Z:  -90, R: 75 },
  { Z: -110, R: 72 },
  { Z: -130, R: 64 },
  { Z: -150, R: 51 },
  { Z: -160, R: 40 },
  { Z: -170, R: 24 },
  { Z: -175, R:  0 },
];

const WR = 70;
const WL = 16;
const WW = 8;
const WA = 5;
const SL = 8;
const WbaseX = 90;
const WbaseY = 0;
const WbaseZ = 0;

const SbaseTO = Math.asin(WW / 2 / (WR - WW));
const SstartT = Math.PI / 16;
const SRI = WW / 2 / Math.sin(Math.PI / SL);

const DW = 50;
const DH = 130;
const DA = 10;
const DbaseY = -30;

const coordinates = {};
const surfaces = {};

Array(HL).fill(null).forEach((_, i) => {
  const baseX = Math.sin(Math.PI * 2 / HL * i);
  const baseY = Math.cos(Math.PI * 2 / HL * i);

  HWs.forEach((HW, j) => {
    const baseR = Math.pow(Math.pow(baseY * HW.R, 2) + Math.pow(HW.Z, 2), 1 / 2);
    const baseT = Math.acos(HW.Z / baseR) * (baseY >= 0 ? 1 : -1);
    const X = baseX * HW.R;
    const Y = Math.sin(baseT + HT) * baseR + HbaseY;
    const Z = Math.cos(baseT + HT) * baseR + HbaseZ;

    coordinates[`H${i}.${j}`] = { X, Y, Z };
    if (j > 0) {
      surfaces[`H${i}.${j}`] = i + 1 < HL
        ? [`H${i}.${j - 1}`, `H${i}.${j}`, `H${i + 1}.${j}`, `H${i + 1}.${j - 1}`]
        : [`H${i}.${j - 1}`, `H${i}.${j}`, `H0.${j}`, `H0.${j - 1}`];
    }
  });
});

const Wcoordinates = [
  { C: 'DFDO', X: WbaseX - WA, Y:      DbaseY,      Z: WbaseZ + DW / 2 },
  { C: 'DBDO', X: WbaseX - WA, Y:      DbaseY,      Z: WbaseZ - DW / 2 },
  { C: 'DFUO', X: WbaseX - WA, Y:      DbaseY + DH, Z: WbaseZ + DW / 2 },
  { C: 'DBUO', X: WbaseX - WA, Y:      DbaseY + DH, Z: WbaseZ - DW / 2 },
  { C: 'DFDI', X: WbaseX - WA - DA, Y: DbaseY + DA, Z: WbaseZ + DW / 2 },
  { C: 'DBDI', X: WbaseX - WA - DA, Y: DbaseY + DA, Z: WbaseZ - DW / 2 },
  { C: 'DFUI', X: WbaseX - WA - DA, Y: DbaseY + DH, Z: WbaseZ + DW / 2 },
  { C: 'DBUI', X: WbaseX - WA - DA, Y: DbaseY + DH, Z: WbaseZ - DW / 2 },
];
const Wsurfaces = [
  { C: 'DO', S: ['DFDO', 'DBDO', 'DBUO', 'DFUO'] },
  { C: 'DI', S: ['DFDI', 'DBDI', 'DBUI', 'DFUI'] },
];

Array(WL).fill(null).forEach((_, i) => {
  const baseY = Math.sin(i / WL * Math.PI * 2);
  const baseZ = Math.cos(i / WL * Math.PI * 2);
  Wcoordinates.push({ C: `W${i}OO`, X: WbaseX,      Y: baseY * WR,        Z: baseZ * WR });
  Wcoordinates.push({ C: `W${i}OI`, X: WbaseX,      Y: baseY * (WR - WW), Z: baseZ * (WR - WW) });
  Wcoordinates.push({ C: `W${i}IO`, X: WbaseX - WA, Y: baseY * WR,        Z: baseZ * WR });
  Wcoordinates.push({ C: `W${i}II`, X: WbaseX - WA, Y: baseY * (WR - WW), Z: baseZ * (WR - WW) });
  Wsurfaces.push({ C: `W${i}O`, S: i + 1 < WL ? [`W${i}OO`, `W${i}OI`, `W${i + 1}OI`, `W${i + 1}OO`] : [`W${i}OO`, `W${i}OI`, `W0OI`, `W0OO`] });
  Wsurfaces.push({ C: `W${i}I`, S: i + 1 < WL ? [`W${i}IO`, `W${i}II`, `W${i + 1}II`, `W${i + 1}IO`] : [`W${i}IO`, `W${i}II`, `W0II`, `W0IO`] });
});

Array(SL).fill(null).forEach((_, i) => {
  const TOS = Math.PI * 2 / SL * i - SbaseTO + SstartT;
  const TOE = Math.PI * 2 / SL * i + SbaseTO + SstartT;
  const TI = Math.PI / SL * (i * 2 - 1) +  + SstartT;
  Wcoordinates.push({ C: `S${i}OOS`, X: WbaseX,      Y: Math.sin(TOS) * (WR - WW) + WbaseY, Z: Math.cos(TOS) * (WR - WW) + WbaseZ });
  Wcoordinates.push({ C: `S${i}OOE`, X: WbaseX,      Y: Math.sin(TOE) * (WR - WW) + WbaseY, Z: Math.cos(TOE) * (WR - WW) + WbaseZ });
  Wcoordinates.push({ C: `S${i}OIS`, X: WbaseX - WA, Y: Math.sin(TOS) * (WR - WW) + WbaseY, Z: Math.cos(TOS) * (WR - WW) + WbaseZ });
  Wcoordinates.push({ C: `S${i}OIE`, X: WbaseX - WA, Y: Math.sin(TOE) * (WR - WW) + WbaseY, Z: Math.cos(TOE) * (WR - WW) + WbaseZ });
  Wcoordinates.push({ C: `S${i}IO`, X: WbaseX,      Y: Math.sin(TI) * SRI + WbaseY, Z: Math.cos(TI) * SRI + WbaseZ });
  Wcoordinates.push({ C: `S${i}II`, X: WbaseX - WA, Y: Math.sin(TI) * SRI + WbaseY, Z: Math.cos(TI) * SRI + WbaseZ });
  Wsurfaces.push({ C: `S${i}O`, S: i + 1 < SL
    ? [`S${i}OOS`, `S${i}OOE`, `S${i + 1}IO`, `S${i}IO`]
    : [`S${i}OOS`, `S${i}OOE`, `S0IO`, `S${i}IO`]
  });
  Wsurfaces.push({ C: `S${i}I`, S: i + 1 < SL
    ? [`S${i}OIS`, `S${i}OIE`, `S${i + 1}II`, `S${i}II`]
    : [`S${i}OIS`, `S${i}OIE`, `S0II`, `S${i}II`]
  });
});

Wcoordinates.forEach((c) => {
  const { C, ...Wcoordinate } = c;
  coordinates[`${C}L`] = { ...Wcoordinate };
  coordinates[`${C}R`] = { ...Wcoordinate, X: Wcoordinate.X * -1 };
});

Wsurfaces.forEach((s) => {
  surfaces[`${s.C}L`] = s.S.map((ss) => `${ss}L` );
  surfaces[`${s.C}R`] = s.S.map((ss) => `${ss}R` );
});

surfaces['DDO'] = ['DFDOL', 'DBDOL', 'DBDOR', 'DFDOR'];
surfaces['DDI'] = ['DFDIL', 'DBDIL', 'DBDIR', 'DFDIR'];

const colors = {
  H: '#888888',
  W: '#bb8866',
  D: '#bb8866',
  S: '#bb8866',
};

const strokeColors = {
  default: '#000000',  
};
