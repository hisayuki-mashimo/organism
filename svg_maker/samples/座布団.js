const [WO, WI,HO, HI,TH] = [126, 110, 136, 120, 6];
const gapW = 20;
const startX = -280;
const ZO = 0;
const ZI = (HO - HI) / -2;
const [coordinates, surfaces] = [5, 3, 4, 2].reduce((res, C, i) => {
  const XO = i * (WO + gapW) + startX;
  const XI = XO + (WO - WI) / 2;
  Array(C).fill(null).forEach((_, y) => {
    const YI = y * TH * 2;
    const YO = YI + TH;
    res[0][`${i}.${y}.FLD`] = { X: XI,      Y: YI, Z: ZI };
    res[0][`${i}.${y}.FRD`] = { X: XI + WI, Y: YI, Z: ZI };
    res[0][`${i}.${y}.BLD`] = { X: XI,      Y: YI, Z: ZI - HI };
    res[0][`${i}.${y}.BRD`] = { X: XI + WI, Y: YI, Z: ZI - HI };
    res[0][`${i}.${y}.FLM`] = { X: XO,      Y: YO, Z: ZO };
    res[0][`${i}.${y}.FRM`] = { X: XO + WO, Y: YO, Z: ZO };
    res[0][`${i}.${y}.BLM`] = { X: XO,      Y: YO, Z: ZO - HO };
    res[0][`${i}.${y}.BRM`] = { X: XO + WO, Y: YO, Z: ZO - HO };
    res[1][`${i}.${y}.D`] = [`${i}.${y}.FLD`, `${i}.${y}.FRD`, `${i}.${y}.BRD`, `${i}.${y}.BLD`];
    res[1][`${i}.${y}.M`] = [`${i}.${y}.FLM`, `${i}.${y}.FRM`, `${i}.${y}.BRM`, `${i}.${y}.BLM`];
    if (y + 1 === C) {
      res[0][`${i}.${y}.FLU`] = { X: XI,      Y: YO + TH, Z: ZI };
      res[0][`${i}.${y}.FRU`] = { X: XI + WI, Y: YO + TH, Z: ZI };
      res[0][`${i}.${y}.BLU`] = { X: XI,      Y: YO + TH, Z: ZI - HI };
      res[0][`${i}.${y}.BRU`] = { X: XI + WI, Y: YO + TH, Z: ZI - HI };
      res[1][`${i}.${y}.U`] = [`${i}.${y}.FLU`, `${i}.${y}.FRU`, `${i}.${y}.BRU`, `${i}.${y}.BLU`];
    }
  });
  return res;
}, [{}, {}]);
