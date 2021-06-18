const BXW = 100;
const BZW = 201;
const BYW = 35;
const BAW = 10;
const BRL = 8;
const SYW = 78;
const SAW = 4;
const SRW = 20;
const coordinates = {};
const surfaces = {
  BU: [], BD: [],
};
[
  { C: 'BLF', P: { X: BXW /  2, Z: BZW /  2, Y: BYW } },
  { C: 'BLB', P: { X: BXW /  2, Z: BZW / -2, Y: BYW } },
  { C: 'BRB', P: { X: BXW / -2, Z: BZW / -2, Y: BYW } },
  { C: 'BRF', P: { X: BXW / -2, Z: BZW /  2, Y: BYW } },
].forEach((c) => {
  coordinates[`${c.C}U`] = { ...c.P };
  coordinates[`${c.C}D`] = { ...c.P, Y: c.P.Y - BAW };
  surfaces.BU.push(`${c.C}U`);
  surfaces.BD.push(`${c.C}D`);
});
[
  { C: 'SB', S: [
    { C: 'ODD', P: { X: BXW / 2, Z: BZW / 2 + SAW, Y: 0 } },
    ...Array(BRL + 1).fill(null).map((_, i) => ({ C: `OR${i}`, P: {
      X: BXW / 2 - (1 - Math.cos(Math.PI / 2 / BRL * i)) * SRW,
      Y: SYW - (1 - Math.sin(Math.PI / 2 / BRL * i)) * SRW,
      Z: BZW / 2 + SAW,
    }})),
    { C: 'OU0', P: { X: 0, Y: SYW,       Z: BZW / 2 + SAW } },
    { C: 'IU0', P: { X: 0, Y: SYW - SAW, Z: BZW / 2 + SAW } },
    ...Array(BRL).fill(null).map((_, i) => ({ C: `IR${BRL - i}`, P: {
      X: BXW / 2 - SRW + Math.sin(Math.PI / 2 / BRL * i) * (SRW - SAW),
      Y: SYW - SAW - (1 - Math.cos(Math.PI / 2 / BRL * i)) * (SRW - SAW),
      Z: BZW / 2 + SAW,
    }})),
    { C: 'IDD', P: { X: BXW / 2 - SAW, Z: BZW / 2 + SAW, Y: 0 } },
  ] },
  { C: 'SS', S: [
    { C: 'UO', P: { X: (BXW / 2 - SAW * 2) / 3 + SAW, Y: SYW - SAW, Z: BZW / 2 + SAW } },
    { C: 'UI', P: { X: (BXW / 2 - SAW * 2) / 3,       Y: SYW - SAW, Z: BZW / 2 + SAW } },
    { C: 'BI', P: { X: (BXW / 2 - SAW * 2) / 3,       Y: BYW - BAW, Z: BZW / 2 + SAW } },
    { C: 'BO', P: { X: (BXW / 2 - SAW * 2) / 3 + SAW, Y: BYW - BAW, Z: BZW / 2 + SAW } },
  ] },
].forEach((cs) => {
  surfaces[`${cs.C}LFO`] = [];
  surfaces[`${cs.C}LFI`] = [];
  surfaces[`${cs.C}LBO`] = [];
  surfaces[`${cs.C}LBI`] = [];
  surfaces[`${cs.C}RFO`] = [];
  surfaces[`${cs.C}RFI`] = [];
  surfaces[`${cs.C}RBO`] = [];
  surfaces[`${cs.C}RBI`] = [];
  cs.S.forEach((c) => {
    coordinates[`${cs.C}.${c.C}LFO`] = { ...c.P };
    coordinates[`${cs.C}.${c.C}LFI`] = { ...c.P, Z: c.P.Z - SAW };
    coordinates[`${cs.C}.${c.C}LBO`] = { ...c.P, Z: c.P.Z * -1 };
    coordinates[`${cs.C}.${c.C}LBI`] = { ...c.P, Z: c.P.Z * -1 + SAW };
    coordinates[`${cs.C}.${c.C}RFO`] = { ...c.P, X: c.P.X * -1 };
    coordinates[`${cs.C}.${c.C}RFI`] = { ...c.P, X: c.P.X * -1, Z: c.P.Z - SAW };
    coordinates[`${cs.C}.${c.C}RBO`] = { ...c.P, X: c.P.X * -1, Z: c.P.Z * -1 };
    coordinates[`${cs.C}.${c.C}RBI`] = { ...c.P, X: c.P.X * -1, Z: c.P.Z * -1 + SAW };
    surfaces[`${cs.C}LFO`].push(`${cs.C}.${c.C}LFO`);
    surfaces[`${cs.C}LFI`].push(`${cs.C}.${c.C}LFI`);
    surfaces[`${cs.C}LBO`].push(`${cs.C}.${c.C}LBO`);
    surfaces[`${cs.C}LBI`].push(`${cs.C}.${c.C}LBI`);
    surfaces[`${cs.C}RFO`].push(`${cs.C}.${c.C}RFO`);
    surfaces[`${cs.C}RFI`].push(`${cs.C}.${c.C}RFI`);
    surfaces[`${cs.C}RBO`].push(`${cs.C}.${c.C}RBO`);
    surfaces[`${cs.C}RBI`].push(`${cs.C}.${c.C}RBI`);
  });
});
coordinates.DLFU = { X: BXW /  2 - SAW, Y: BYW - BAW,       Z: BZW /  2 };
coordinates.DLFD = { X: BXW /  2 - SAW, Y: BYW - BAW - SAW, Z: BZW /  2 };
coordinates.DRFU = { X: BXW / -2 + SAW, Y: BYW - BAW,       Z: BZW /  2 };
coordinates.DRFD = { X: BXW / -2 + SAW, Y: BYW - BAW - SAW, Z: BZW /  2 };
coordinates.DLBU = { X: BXW /  2 - SAW, Y: BYW - BAW,       Z: BZW / -2 };
coordinates.DLBD = { X: BXW /  2 - SAW, Y: BYW - BAW - SAW, Z: BZW / -2 };
coordinates.DRBU = { X: BXW / -2 + SAW, Y: BYW - BAW,       Z: BZW / -2 };
coordinates.DRBD = { X: BXW / -2 + SAW, Y: BYW - BAW - SAW, Z: BZW / -2 };
surfaces.DF = ['DLFU', 'DLFD', 'DRFD', 'DRFU'];
surfaces.DB = ['DLBU', 'DLBD', 'DRBD', 'DRBU'];
coordinates.ELFU = { X: BXW /  2, Y: BYW - BAW,       Z: BZW /  2 };
coordinates.ELFD = { X: BXW /  2, Y: BYW - BAW - SAW, Z: BZW /  2 };
coordinates.ERFU = { X: BXW / -2, Y: BYW - BAW,       Z: BZW /  2 };
coordinates.ERFD = { X: BXW / -2, Y: BYW - BAW - SAW, Z: BZW /  2 };
coordinates.ELBU = { X: BXW /  2, Y: BYW - BAW,       Z: BZW / -2 };
coordinates.ELBD = { X: BXW /  2, Y: BYW - BAW - SAW, Z: BZW / -2 };
coordinates.ERBU = { X: BXW / -2, Y: BYW - BAW,       Z: BZW / -2 };
coordinates.ERBD = { X: BXW / -2, Y: BYW - BAW - SAW, Z: BZW / -2 };
surfaces.EL = ['ELFU', 'ELFD', 'ELBD', 'ELBU'];
surfaces.ER = ['ERFU', 'ERFD', 'ERBD', 'ERBU'];
