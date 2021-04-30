const boxW = 100;
const gapW = 20;
const boxH = 120;
const boxT = 60;
const startX = -350;
const startY = -50;
const startZ = 50;
const [coordinates, surfaces] = Array(3).fill(null).reduce((res, _, i) => {
  const baseX = startX + (boxW + gapW) * i;

  // 席
  res[0][`${i}.S.LFD`] = { X: baseX, Y: startY, Z: startZ };
  res[0][`${i}.S.RFD`] = { X: baseX + boxW, Y: startY, Z: startZ };
  res[0][`${i}.S.LBD`] = { X: baseX, Y: startY, Z: startZ - boxT };
  res[0][`${i}.S.RBD`] = { X: baseX + boxW , Y: startY, Z: startZ - boxT };
  res[0][`${i}.S.LFU`] = { X: baseX, Y: startY + boxH, Z: startZ };
  res[0][`${i}.S.RFU`] = { X: baseX + boxW , Y: startY + boxH, Z: startZ };
  res[0][`${i}.S.LBU`] = { X: baseX, Y: startY + boxH, Z: startZ - boxT };
  res[0][`${i}.S.RBU`] = { X: baseX + boxW , Y: startY + boxH, Z: startZ - boxT };
  res[1][`${i}.S.F`] = [`${i}.S.LFD`, `${i}.S.RFD`, `${i}.S.RFU`, `${i}.S.LFU`];
  res[1][`${i}.S.B`] = [`${i}.S.LBD`, `${i}.S.RBD`, `${i}.S.RBU`, `${i}.S.LBU`];

  // ボタン
  res[0][`${i}.B.LFD`] = { X: baseX +  5, Y: startY + boxH, Z: startZ - 25 };
  res[0][`${i}.B.RFD`] = { X: baseX + 25, Y: startY + boxH, Z: startZ - 25 };
  res[0][`${i}.B.LBD`] = { X: baseX +  5, Y: startY + boxH, Z: startZ - 45 };
  res[0][`${i}.B.RBD`] = { X: baseX + 25, Y: startY + boxH, Z: startZ - 45 };
  res[0][`${i}.B.LFU`] = { X: baseX +  5, Y: startY + boxH + 5, Z: startZ - 25 };
  res[0][`${i}.B.RFU`] = { X: baseX + 25, Y: startY + boxH + 5, Z: startZ - 25 };
  res[0][`${i}.B.LBU`] = { X: baseX +  5, Y: startY + boxH + 5, Z: startZ - 45 };
  res[0][`${i}.B.RBU`] = { X: baseX + 25, Y: startY + boxH + 5, Z: startZ - 45 };
  res[1][`${i}.B.F`] = [`${i}.B.LFD`, `${i}.B.RFD`, `${i}.B.RFU`, `${i}.B.LFU`];
  res[1][`${i}.B.B`] = [`${i}.B.LBD`, `${i}.B.RBD`, `${i}.B.RBU`, `${i}.B.LBU`];

  // 背後
  res[0][`${i}.L.LBD`] = { X: baseX, Y: startY, Z: startZ - boxT - 70 };
  res[0][`${i}.L.RBD`] = { X: baseX + boxW , Y: startY, Z: startZ - boxT - 70 };
  res[0][`${i}.L.LFM`] = { X: baseX, Y: startY + boxH + 120, Z: startZ - boxT - 60 };
  res[0][`${i}.L.RFM`] = { X: baseX + boxW , Y: startY + boxH + 120, Z: startZ - boxT - 60 };
  res[0][`${i}.L.LBM`] = { X: baseX, Y: startY + boxH + 120, Z: startZ - boxT - 70 };
  res[0][`${i}.L.RBM`] = { X: baseX + boxW , Y: startY + boxH + 120, Z: startZ - boxT - 70 };
  res[0][`${i}.L.LFU`] = { X: baseX, Y: startY + boxH + 140, Z: startZ - boxT - 60 };
  res[0][`${i}.L.RFU`] = { X: baseX + boxW , Y: startY + boxH + 140, Z: startZ - boxT - 60 };
  res[0][`${i}.L.LBU`] = { X: baseX, Y: startY + boxH + 140, Z: startZ - boxT - 70 };
  res[0][`${i}.L.RBU`] = { X: baseX + boxW , Y: startY + boxH + 140, Z: startZ - boxT - 70 };
  res[1][`${i}.L.BD`] = [`${i}.L.LBD`, `${i}.L.RBD`, `${i}.L.RBM`, `${i}.L.LBM`];
  res[1][`${i}.L.FU`] = [`${i}.L.LFM`, `${i}.L.RFM`, `${i}.L.RFU`, `${i}.L.LFU`];
  res[1][`${i}.L.BU`] = [`${i}.L.LBM`, `${i}.L.RBM`, `${i}.L.RBU`, `${i}.L.LBU`];

  // 装飾
  Array(8).fill(null).forEach((_, j) => {
    const WD = 90 * j / 8;
    const WU = 90 * (j + 1) / 8;
    const HD = 180 * j / 8;
    const HU = 180 * (j + 1) / 8;
    res[0][`${i}.${j}.LD`] = { X: baseX + boxW / 2 - WD / 2, Y: startY + 50 + HD, Z: startZ - boxT - 70 };
    res[0][`${i}.${j}.RD`] = { X: baseX + boxW / 2 + WD / 2, Y: startY + 50 + HD, Z: startZ - boxT - 70 };
    res[0][`${i}.${j}.LU`] = { X: baseX + boxW / 2 - WU / 2, Y: startY + 50 + HU, Z: startZ - boxT - 70 };
    res[0][`${i}.${j}.RU`] = { X: baseX + boxW / 2 + WU / 2, Y: startY + 50 + HU, Z: startZ - boxT - 70 };
    res[1][`${i}.${j}`] = [`${i}.${j}.LD`, `${i}.${j}.RD`, `${i}.${j}.RU`, `${i}.${j}.LU`];
  });

  return res;
}, [{}, {}]);
