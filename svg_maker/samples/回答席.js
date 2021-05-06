const boxW = 100;
const gapW = 20;
const boxH = 120;
const boxT = 60;
const startX = -350;
const startY = -50;
const startZ = 50;

const [coordinates, surfaces] = [{}, {}];

Array(3).fill(null).forEach((_, i) => {
  const baseX = startX + (boxW + gapW) * i;

  // 席
  coordinates[`${i}.S.LFD`] = { X: baseX, Y: startY, Z: startZ };
  coordinates[`${i}.S.RFD`] = { X: baseX + boxW, Y: startY, Z: startZ };
  coordinates[`${i}.S.LBD`] = { X: baseX, Y: startY, Z: startZ - boxT };
  coordinates[`${i}.S.RBD`] = { X: baseX + boxW , Y: startY, Z: startZ - boxT };
  coordinates[`${i}.S.LFU`] = { X: baseX, Y: startY + boxH, Z: startZ };
  coordinates[`${i}.S.RFU`] = { X: baseX + boxW , Y: startY + boxH, Z: startZ };
  coordinates[`${i}.S.LBU`] = { X: baseX, Y: startY + boxH, Z: startZ - boxT };
  coordinates[`${i}.S.RBU`] = { X: baseX + boxW , Y: startY + boxH, Z: startZ - boxT };
  surfaces[`${i}.S.F`] = [`${i}.S.LFD`, `${i}.S.RFD`, `${i}.S.RFU`, `${i}.S.LFU`];
  surfaces[`${i}.S.B`] = [`${i}.S.LBD`, `${i}.S.RBD`, `${i}.S.RBU`, `${i}.S.LBU`];

  // ボタン
  coordinates[`${i}.B.LFD`] = { X: baseX +  5, Y: startY + boxH, Z: startZ - 25 };
  coordinates[`${i}.B.RFD`] = { X: baseX + 25, Y: startY + boxH, Z: startZ - 25 };
  coordinates[`${i}.B.LBD`] = { X: baseX +  5, Y: startY + boxH, Z: startZ - 45 };
  coordinates[`${i}.B.RBD`] = { X: baseX + 25, Y: startY + boxH, Z: startZ - 45 };
  coordinates[`${i}.B.LFU`] = { X: baseX +  5, Y: startY + boxH + 5, Z: startZ - 25 };
  coordinates[`${i}.B.RFU`] = { X: baseX + 25, Y: startY + boxH + 5, Z: startZ - 25 };
  coordinates[`${i}.B.LBU`] = { X: baseX +  5, Y: startY + boxH + 5, Z: startZ - 45 };
  coordinates[`${i}.B.RBU`] = { X: baseX + 25, Y: startY + boxH + 5, Z: startZ - 45 };
  surfaces[`${i}.B.F`] = [`${i}.B.LFD`, `${i}.B.RFD`, `${i}.B.RFU`, `${i}.B.LFU`];
  surfaces[`${i}.B.B`] = [`${i}.B.LBD`, `${i}.B.RBD`, `${i}.B.RBU`, `${i}.B.LBU`];

  // 背後
  coordinates[`${i}.L.LBD`] = { X: baseX, Y: startY, Z: startZ - boxT - 70 };
  coordinates[`${i}.L.RBD`] = { X: baseX + boxW , Y: startY, Z: startZ - boxT - 70 };
  coordinates[`${i}.L.LFM`] = { X: baseX, Y: startY + boxH + 120, Z: startZ - boxT - 60 };
  coordinates[`${i}.L.RFM`] = { X: baseX + boxW , Y: startY + boxH + 120, Z: startZ - boxT - 60 };
  coordinates[`${i}.L.LBM`] = { X: baseX, Y: startY + boxH + 120, Z: startZ - boxT - 70 };
  coordinates[`${i}.L.RBM`] = { X: baseX + boxW , Y: startY + boxH + 120, Z: startZ - boxT - 70 };
  coordinates[`${i}.L.LFU`] = { X: baseX, Y: startY + boxH + 140, Z: startZ - boxT - 60 };
  coordinates[`${i}.L.RFU`] = { X: baseX + boxW , Y: startY + boxH + 140, Z: startZ - boxT - 60 };
  coordinates[`${i}.L.LBU`] = { X: baseX, Y: startY + boxH + 140, Z: startZ - boxT - 70 };
  coordinates[`${i}.L.RBU`] = { X: baseX + boxW , Y: startY + boxH + 140, Z: startZ - boxT - 70 };
  surfaces[`${i}.L.BD`] = [`${i}.L.LBD`, `${i}.L.RBD`, `${i}.L.RBM`, `${i}.L.LBM`];
  surfaces[`${i}.L.FU`] = [`${i}.L.LFM`, `${i}.L.RFM`, `${i}.L.RFU`, `${i}.L.LFU`];
  surfaces[`${i}.L.BU`] = [`${i}.L.LBM`, `${i}.L.RBM`, `${i}.L.RBU`, `${i}.L.LBU`];

  // 装飾
  Array(8).fill(null).forEach((_, j) => {
    const WD = 90 * j / 8;
    const WU = 90 * (j + 1) / 8;
    const HD = 180 * j / 8;
    const HU = 180 * (j + 1) / 8;
    coordinates[`${i}.${j}.LD`] = { X: baseX + boxW / 2 - WD / 2, Y: startY + 50 + HD, Z: startZ - boxT - 70 };
    coordinates[`${i}.${j}.RD`] = { X: baseX + boxW / 2 + WD / 2, Y: startY + 50 + HD, Z: startZ - boxT - 70 };
    coordinates[`${i}.${j}.LU`] = { X: baseX + boxW / 2 - WU / 2, Y: startY + 50 + HU, Z: startZ - boxT - 70 };
    coordinates[`${i}.${j}.RU`] = { X: baseX + boxW / 2 + WU / 2, Y: startY + 50 + HU, Z: startZ - boxT - 70 };
    surfaces[`${i}.${j}`] = [`${i}.${j}.LD`, `${i}.${j}.RD`, `${i}.${j}.RU`, `${i}.${j}.LU`];
  });
});
