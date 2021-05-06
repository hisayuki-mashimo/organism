const [battlementLH, battlementLD, curtainL] = [2, 0, 10];
const [battlementW, gapW, wallW] = [30, 10, 10];
const [battlementYU, battlementYD, wallUDY, wallDDY, fulcrumDY ] = [100, 75, 25, -250, -8 ];
const battlementWD = battlementW * Math.sin(Math.PI / 4);
const wallWD = wallW * Math.sin(Math.PI / 4);
const gapWD = gapW * Math.sin(Math.PI / 4);
const towerSideX = (battlementW + gapW) * (battlementLH + 1) / 2;
const towerSideZ = (battlementW + gapW) * (battlementLD + 1) * Math.sin(Math.PI / 4) + towerSideX;

const coordinatesB = [
  ...([
    { C: 'BB0SF', X: towerSideX, Z: towerSideZ },
    { C: 'BH0EF', X: towerSideX - battlementW / 2, Z: towerSideZ },
    { C: 'BD0EF', X: towerSideX + battlementWD / 2, Z: towerSideZ - battlementWD / 2 },
    { C: 'BB0SB', X: towerSideX - wallW / Math.tan(Math.PI * 3 / 8), Z: towerSideZ - wallW },
    { C: 'BH0EB', X: towerSideX - battlementW / 2, Z: towerSideZ - wallW },
    { C: 'BD0EB', X: towerSideX + battlementWD / 2 - wallWD, Z: towerSideZ - battlementWD / 2 - wallWD },
  ]).reduce((res, c) => [
    ...res,
    c,
    { ...c, C: c.C.replace('0', battlementLH + 1), X: c.X * -1 },
  ], []),
  ...Array(battlementLH).fill(null).reduce((res, _, i) => {
    const cSF = { C: `BH${i + 1}SF`, X: towerSideX - battlementW / 2 - battlementW * i - gapW * (i + 1), Z: towerSideZ };
    const cSB = { C: `BH${i + 1}SB`, X: cSF.X, Z: cSF.Z - wallW };
    const cEF = { C: `BH${i + 1}EF`, X: cSF.X - battlementW, Z: cSF.Z };
    const cEB = { C: `BH${i + 1}EB`, X: cEF.X, Z: cSB.Z };
    return [ ...res, cSF, cSB, cEF, cEB ];
  }, []),
  ...Array(battlementLD).fill(null).reduce((res, _, i) => {
    const cSF = { C: `BD${i + 1}SF`, X: towerSideX + battlementWD / 2 + battlementWD * i + gapWD * (i + 1), Z: towerSideZ - battlementWD / 2 - battlementWD * i - gapWD * (i + 1) };
    const cSB = { C: `BD${i + 1}SB`, X: cSF.X - wallWD, Z: cSF.Z - wallWD };
    const cEF = { C: `BD${i + 1}EF`, X: cSF.X + battlementWD, Z: cSF.Z - battlementWD };
    const cEB = { C: `BD${i + 1}EB`, X: cEF.X - wallWD, Z: cSB.Z - battlementWD };
    return [ ...res, cSF, cSB, cEF, cEB ];
  }, []),
].reduce((res, c) => [
  ...res,
  { C: `${c.C}U`, X: c.X, Z: c.Z, Y: battlementYU },
  { C: `${c.C}D`, X: c.X, Z: c.Z, Y: battlementYD },
], []);

const surfacesB = [
  { C: 'BH0F', S: [ 'BB0SFU', 'BB0SFD', 'BH0EFD', 'BH0EFU'] },
  { C: 'BD0F', S: [ 'BB0SFU', 'BB0SFD', 'BD0EFD', 'BD0EFU'] },
  { C: 'BH0B', S: [ 'BB0SBU', 'BB0SBD', 'BH0EBD', 'BH0EBU'] },
  { C: 'BD0B', S: [ 'BB0SBU', 'BB0SBD', 'BD0EBD', 'BD0EBU'] },
  { C: `BH${battlementLH + 1}F`, S: [ `BB${battlementLH + 1}SFU`, `BB${battlementLH + 1}SFD`, `BH${battlementLH + 1}EFD`, `BH${battlementLH + 1}EFU`] },
  { C: `BD${battlementLH + 1}F`, S: [ `BB${battlementLH + 1}SFU`, `BB${battlementLH + 1}SFD`, `BD${battlementLH + 1}EFD`, `BD${battlementLH + 1}EFU`] },
  { C: `BH${battlementLH + 1}B`, S: [ `BB${battlementLH + 1}SBU`, `BB${battlementLH + 1}SBD`, `BH${battlementLH + 1}EBD`, `BH${battlementLH + 1}EBU`] },
  { C: `BD${battlementLH + 1}B`, S: [ `BB${battlementLH + 1}SBU`, `BB${battlementLH + 1}SBD`, `BD${battlementLH + 1}EBD`, `BD${battlementLH + 1}EBU`] },
  ...Array(battlementLH).fill(null).reduce((res, _, i) => [
    ...res,
    { C: `BH${i + 1}F`, S: [`BH${i + 1}SFU`, `BH${i + 1}SFD`, `BH${i + 1}EFD`, `BH${i + 1}EFU`] },
    { C: `BH${i + 1}B`, S: [`BH${i + 1}SBU`, `BH${i + 1}SBD`, `BH${i + 1}EBD`, `BH${i + 1}EBU`] },
  ], []),
  ...Array(battlementLD).fill(null).reduce((res, _, i) => [
    ...res,
    { C: `BD${i + 1}F`, S: [`BD${i + 1}SFU`, `BD${i + 1}SFD`, `BD${i + 1}EFD`, `BD${i + 1}EFU`] },
    { C: `BD${i + 1}B`, S: [`BD${i + 1}SBU`, `BD${i + 1}SBD`, `BD${i + 1}EBD`, `BD${i + 1}EBU`] },
  ], []),
];

const coordinatesW = [
  { C: 'WUB0SU', X: towerSideX, Z: towerSideZ, Y: battlementYD },
  { C: 'WUB0SD', X: towerSideX, Z: towerSideZ, Y: wallUDY },
  { C: 'WUH0EU', X: towerSideX * -1, Z: towerSideZ, Y: battlementYD },
  { C: 'WUH0ED', X: towerSideX * -1, Z: towerSideZ, Y: wallUDY },
  { C: 'WDB0SU', X: towerSideX - wallW / Math.tan(Math.PI * 3 / 8), Z: towerSideZ - 10, Y: wallUDY },
  { C: 'WDB0SD', X: towerSideX - wallW / Math.tan(Math.PI * 3 / 8), Z: towerSideZ - 10, Y: wallDDY },
  { C: 'WDH0EU', X: towerSideX * -1 + wallW / Math.tan(Math.PI * 3 / 8), Z: towerSideZ - 10, Y: wallUDY },
  { C: 'WDH0ED', X: towerSideX * -1 + wallW / Math.tan(Math.PI * 3 / 8), Z: towerSideZ - 10, Y: wallDDY },
];

const surfacesW = [
  { C: 'WU', S: ['WUB0SU', 'WUB0SD', 'WUH0ED', 'WUH0EU'] },
  { C: 'WD', S: ['WDB0SU', 'WDB0SD', 'WDH0ED', 'WDH0EU'] },
];

const coordinatesF = [
  ...Array(battlementLH + 1).fill(null).reduce((res, _, i) => {
    const cSFU = { C: `FH${i}SFU`, X: towerSideX - battlementW / 2 - (battlementW + gapW) * i, Z: towerSideZ, Y: wallUDY };
    const cSBU = { C: `FH${i}SBU`, X: cSFU.X, Z: cSFU.Z - 10, Y: cSFU.Y };
    const cSBD = { C: `FH${i}SBD`, X: cSFU.X, Z: cSBU.Z, Y: fulcrumDY };
    const cEFU = { C: `FH${i}EFU`, X: cSFU.X - gapW, Z: cSFU.Z, Y: cSFU.Y };
    const cEBU = { C: `FH${i}EBU`, X: cEFU.X, Z: cSBU.Z, Y: cSBU.Y };
    const cEBD = { C: `FH${i}EBD`, X: cEBU.X, Z: cEBU.Z, Y: cSBD.Y };
    return [ ...res, cSFU, cSBU, cSBD, cEFU, cEBU, cEBD ];
  }, []),
  ...Array(battlementLD + 1).fill(null).reduce((res, _, i) => {
    const cSFU = { C: `FD${i}SFU`, X: towerSideX + battlementWD / 2 + (battlementWD + gapWD) * i, Z: towerSideZ - battlementWD / 2 - (battlementWD + gapWD) * i, Y: wallUDY };
    const cSBU = { C: `FD${i}SBU`, X: cSFU.X - 10 * Math.sin(Math.PI / 4), Z: cSFU.Z - 10 * Math.sin(Math.PI / 4), Y: cSFU.Y };
    const cSBD = { C: `FD${i}SBD`, X: cSBU.X, Z: cSBU.Z, Y: fulcrumDY };
    const cEFU = { C: `FD${i}EFU`, X: cSFU.X + gapW * Math.sin(Math.PI / 4), Z: cSFU.Z - gapW * Math.sin(Math.PI / 4), Y: cSFU.Y };
    const cEBU = { C: `FD${i}EBU`, X: cSBU.X + gapW * Math.sin(Math.PI / 4), Z: cSBU.Z - gapW * Math.sin(Math.PI / 4), Y: cSBU.Y };
    const cEBD = { C: `FD${i}EBD`, X: cEBU.X, Z: cEBU.Z, Y: cSBD.Y };
    return [ ...res, cSFU, cSBU, cSBD, cEFU, cEBU, cEBD ];
  }, []),
];

const surfacesF = [
  ...Array(battlementLH + 1).fill(null).reduce((res, _, i) => [
    ...res,
    { C: `FH${i}S`, S: [`FH${i}SFU`, `FH${i}SBU`, `FH${i}SBD`] },
    { C: `FH${i}E`, S: [`FH${i}EFU`, `FH${i}EBU`, `FH${i}EBD`] },
  ], []),
  ...Array(battlementLD + 1).fill(null).reduce((res, _, i) => [
    ...res,
    { C: `FD${i}S`, S: [`FD${i}SFU`, `FD${i}SBU`, `FD${i}SBD`] },
    { C: `FD${i}E`, S: [`FD${i}EFU`, `FD${i}EBU`, `FD${i}EBD`] },
  ], []),
];

const [RW, RH] = [10, 25 / 4];
const [coordinatesL, surfacesL] = [[], []];
const makeBrick = (cs, ss, sign, CX, CY, CZ, T, LV, LY, isHalfStart) => {
  const moveV = (V, Y, SorE) => {
    if (SorE === 'S' && V === 0) return { X: CX, Z: CZ };
    const baseWV = isHalfStart === !(Y % 2) ? RW / -2 : 0;
    const moveWV = (SorE === 'E' && V + 1 >= LV)
      ? RW * LV
      : baseWV + RW * V + (SorE === 'E' ? RW : 0);
    return {
      X: CX + Math.cos(T) * moveWV,
      Z: CZ + Math.sin(T) * moveWV,
    };
  };

  Array(LY).fill(null).forEach((_, y) => {
    const Y = CY - y * RH;
    let LVP = Math.ceil(LV);
    if (LVP === LV && isHalfStart === !(y % 2)) LVP += 1;
    Array(LVP).fill(null).forEach((_, x) => {
      const K = `${sign}.${x}.${y}`;
      const VS = moveV(x, y, 'S');
      const VE = moveV(x, y, 'E');
      cs.push({ C: `${K}SU`, ...VS, Y });
      cs.push({ C: `${K}EU`, ...VE, Y });
      cs.push({ C: `${K}SD`, ...VS, Y: Y - RH });
      cs.push({ C: `${K}ED`, ...VE, Y: Y - RH });
      ss.push({ C: K, S: [`${K}SD`, `${K}ED`, `${K}EU`, `${K}SU`]});
    });
  });
};

// 煉瓦描画(処理負荷注意)
// makeBrick(coordinatesL, surfacesL, 'RBT0', towerSideX, battlementYU, towerSideZ, Math.PI, 1.5, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT1', towerSideX, battlementYU, towerSideZ, Math.PI / -4, 1.5, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBT2', towerSideX + ((battlementW + gapW) * 1 - battlementW / 2) * -1, battlementYU, towerSideZ, Math.PI, 3, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBT3', towerSideX + ((battlementW + gapW) * 2 - battlementW / 2) * -1, battlementYU, towerSideZ, Math.PI, 3, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBT4', towerSideX + ((battlementW + gapW) * 3 - battlementW / 2) * -1, battlementYU, towerSideZ, Math.PI, 1.5, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBT5', towerSideX + (battlementW + gapW) * -3, battlementYU, towerSideZ, Math.PI / 4 * 5, 1.5, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RTT0', towerSideX, battlementYD, towerSideZ, Math.PI / -4, 4, 8, false);
// makeBrick(coordinatesL, surfacesL, 'RTT1', towerSideX, battlementYD, towerSideZ, Math.PI, 12, 8, true);
// makeBrick(coordinatesL, surfacesL, 'RTW0', towerSideX - wallW / Math.tan(Math.PI * 3 / 8), wallUDY, towerSideZ - 10, Math.PI / -4, 3, 38, false);
// makeBrick(coordinatesL, surfacesL, 'RTW1', towerSideX - wallW / Math.tan(Math.PI * 3 / 8), wallUDY, towerSideZ - 10, Math.PI, 11, 38, false);
// makeBrick(coordinatesL, surfacesL, 'RBB0', towerSideX - wallW / Math.tan(Math.PI * 3 / 8), battlementYU, towerSideZ - wallW, Math.PI / -4, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBB1', towerSideX - wallW / Math.tan(Math.PI * 3 / 8), battlementYU, towerSideZ - wallW, Math.PI, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBB2', towerSideX - ((battlementW + gapW) * 1 - battlementW / 2), battlementYU, towerSideZ - wallW, Math.PI, 3, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBB3', towerSideX - ((battlementW + gapW) * 2 - battlementW / 2), battlementYU, towerSideZ - wallW, Math.PI, 3, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBB4', towerSideX - ((battlementW + gapW) * 3 - battlementW / 2), battlementYU, towerSideZ - wallW, Math.PI, 1, 4, false);
// makeBrick(coordinatesL, surfacesL, 'RBB5', towerSideX - (battlementW + gapW) * 3 + wallW / Math.tan(Math.PI * 3 / 8), battlementYU, towerSideZ - wallW, Math.PI / 4 * -3, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT1', towerSideX - battlementW / 2 - (battlementW + gapW) * 0, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT2', towerSideX - battlementW / 2 - (battlementW + gapW) * 1, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT3', towerSideX - battlementW / 2 - (battlementW + gapW) * 2, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT4', towerSideX - battlementW / 2 - gapW - (battlementW + gapW) * 0, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT5', towerSideX - battlementW / 2 - gapW - (battlementW + gapW) * 1, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT6', towerSideX - battlementW / 2 - gapW - (battlementW + gapW) * 2, battlementYU, towerSideZ, Math.PI / -2, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT7', towerSideX + battlementWD / 2, battlementYU, towerSideZ - battlementWD / 2, Math.PI / 4 * -3, 1, 4, true);
// makeBrick(coordinatesL, surfacesL, 'RBT8', towerSideX + battlementWD / 2 + gapWD, battlementYU, towerSideZ - battlementWD / 2 - gapWD, Math.PI / 4 * -3, 1, 4, true);

const coordinatesBase = [ ...coordinatesB, ...coordinatesW, ...coordinatesF, ...coordinatesL ];
const surfacesBase = [ ...surfacesB, ...surfacesW, ...surfacesF, ...surfacesL ];
const coordinates = {
  ...(coordinatesBase.reduce((res, c) => ({ ...res, [`${c.C}A`]: { X: c.X, Y: c.Y, Z: c.Z } }), {})),
  ...(coordinatesBase.reduce((res, c) => ({ ...res, [`${c.C}B`]: { X: c.Z * -1, Y: c.Y, Z: c.X } }), {})),
  ...(coordinatesBase.reduce((res, c) => ({ ...res, [`${c.C}C`]: { X: c.X * -1, Y: c.Y, Z: c.Z * -1 } }), {})),
  ...(coordinatesBase.reduce((res, c) => ({ ...res, [`${c.C}D`]: { X: c.Z, Y: c.Y, Z: c.X * -1 } }), {})),
};
const surfaces = ['A', 'B', 'C', 'D'].reduce((res1, c) => surfacesBase.reduce((res2, s) => ({
  ...res2,
  [`${s.C}${c}`]: s.S.map((ss) => `${ss}${c}`),
}), res1), {});

const curtainBaseX = towerSideX + (battlementWD + gapWD) * (battlementLD + 1) - 10;
const curtainY = fulcrumDY + 5;
Array(curtainL).fill(null).reduce((res, _, i) => {
  const cLSF = { C: `K${i}SF`, X: curtainBaseX + (battlementW + gapW) * i, Z: -30, Y: curtainY };
  const cLEF = { C: `K${i}EF`, X: cLSF.X + battlementW, Z: cLSF.Z, Y: cLSF.Y };
  const cLSB = { C: `K${i}SB`, X: cLSF.X, Z: cLSF.Z + wallW, Y: cLSF.Y };
  const cLEB = { C: `K${i}EB`, X: cLEF.X, Z: cLSB.Z, Y: cLSF.Y };
  return [...res, cLSF, cLEF, cLSB, cLEB];
}, []).reduce((res, c) => [
  ...res,
  { ...c, C: `${c.C}U` },
  { ...c, C: `${c.C}D`, Y: c.Y - battlementYU + battlementYD },
], []).reduce((res, c) => [
  ...res,
  { ...c, C: `${c.C}L` },
  { ...c, C: `${c.C}R`, X: c.Z, Z: c.X },
], []).forEach((c) => {
  const { C, ...coordinate } = c;
  coordinates[c.C] = coordinate;
});

Array(curtainL).fill(null).forEach((_, i) => {
  surfaces[`K${i}LF`] = [`K${i}SFUL`, `K${i}SFDL`, `K${i}EFDL`, `K${i}EFUL`];
  surfaces[`K${i}LB`] = [`K${i}SBUL`, `K${i}SBDL`, `K${i}EBDL`, `K${i}EBUL`];
  surfaces[`K${i}RF`] = [`K${i}SFUR`, `K${i}SFDR`, `K${i}EFDR`, `K${i}EFUR`];
  surfaces[`K${i}RB`] = [`K${i}SBUR`, `K${i}SBDR`, `K${i}EBDR`, `K${i}EBUR`];
});
coordinates['KSFDL'] = { ...coordinates['K0SFDL'], Y: wallDDY };
coordinates['KEFDL'] = { ...coordinates[`K${curtainL - 1}EFDL`], Y: wallDDY };
coordinates['KSFDR'] = { ...coordinates['K0SFDR'], Y: wallDDY };
coordinates['KEFDR'] = { ...coordinates[`K${curtainL - 1}EFDR`], Y: wallDDY };
surfaces['KL'] = ['K0SFDL', 'KSFDL', 'KEFDL', `K${curtainL - 1}EFDL`];
surfaces['KR'] = ['K0SFDR', 'KSFDR', 'KEFDR', `K${curtainL - 1}EFDR`];

const [cs, ss] = [[], []];
Array(curtainL).fill(null).forEach((_, i) => {
  const Z = curtainBaseX + (battlementW + gapW) * i;
  makeBrick(cs, ss, `WBA${i}`, -30, curtainY, Z, Math.PI / 2, 3, 4, false);
  makeBrick(cs, ss, `WBB${i}`, -30, curtainY, Z + battlementW, 0, 1, 4, false);
});

// 煉瓦描画(処理負荷注意)
// makeBrick(cs, ss, 'WW', -30, fulcrumDY + 5 - battlementYU + battlementYD, curtainBaseX, Math.PI / 2, curtainL * 4, 35, false);
cs.forEach((_c) => {
  const { C, ...c } = _c;
  coordinates[C] = c;
});
ss.forEach((s) => {
  surfaces[s.C] = s.S;
});

const [bridgeL, bridgeWX, bridgeWZ] = [16, 50, 32];
const bridgeX = -32 - bridgeWX;
const bridgeZ = 258;
const bridgeYU = wallUDY - 20;
coordinates.TLD = { X: bridgeX, Y: wallDDY, Z: bridgeZ };
coordinates.TRD = { X: bridgeX, Y: wallDDY, Z: bridgeZ + bridgeWZ };
coordinates.TLU = { X: bridgeX + bridgeWX, Y: bridgeYU, Z: bridgeZ };
coordinates.TRU = { X: bridgeX + bridgeWX, Y: bridgeYU, Z: bridgeZ + bridgeWZ };
surfaces.TL = ['TLD', 'TLU'];
surfaces.TR = ['TRD', 'TRU'];
Array(bridgeL).fill(null).forEach((_, i) => {
  coordinates[`T${i}L`] = { X: bridgeX + i / bridgeL * bridgeWX, Y: i / bridgeL * (bridgeYU - wallDDY) + wallDDY, Z: bridgeZ };
  coordinates[`T${i}R`] = { X: bridgeX + i / bridgeL * bridgeWX, Y: i / bridgeL * (bridgeYU - wallDDY) + wallDDY, Z: bridgeZ + bridgeWZ };
  surfaces[`T${i}`] = [`T${i}L`, `T${i}R`];
});
