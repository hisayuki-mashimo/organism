
const WX = 910 / 4;
const WZ = 1820 / 4;
const WA = 60 / 4;
const WH = 28 / 4;
const LM = 64;
const coordinates = {
  TLFU: { X: WX /  2, Z: WZ /  2, Y: WA /  2 },
  TLBU: { X: WX /  2, Z: WZ / -2, Y: WA /  2 },
  TRFU: { X: WX / -2, Z: WZ /  2, Y: WA /  2 },
  TRBU: { X: WX / -2, Z: WZ / -2, Y: WA /  2 },
  TLFD: { X: WX /  2, Z: WZ /  2, Y: WA / -2 },
  TLBD: { X: WX /  2, Z: WZ / -2, Y: WA / -2 },
  TRFD: { X: WX / -2, Z: WZ /  2, Y: WA / -2 },
  TRBD: { X: WX / -2, Z: WZ / -2, Y: WA / -2 },
  HLFUO: { X: WX /  2,      Z: WZ /  2, Y: WA /  2 },
  HLBUO: { X: WX /  2,      Z: WZ / -2, Y: WA /  2 },
  HLFUI: { X: WX /  2 - WH, Z: WZ /  2, Y: WA /  2 },
  HLBUI: { X: WX /  2 - WH, Z: WZ / -2, Y: WA /  2 },
  HRFUO: { X: WX / -2,      Z: WZ /  2, Y: WA /  2 },
  HRBUO: { X: WX / -2,      Z: WZ / -2, Y: WA /  2 },
  HRFUI: { X: WX / -2 - WH, Z: WZ /  2, Y: WA /  2 },
  HRBUI: { X: WX / -2 - WH, Z: WZ / -2, Y: WA /  2 },
  HLFDO: { X: WX /  2,      Z: WZ /  2, Y: WA / -2 },
  HLBDO: { X: WX /  2,      Z: WZ / -2, Y: WA / -2 },
  HLFDI: { X: WX /  2 - WH, Z: WZ /  2, Y: WA / -2 },
  HLBDI: { X: WX /  2 - WH, Z: WZ / -2, Y: WA / -2 },
  HRFDO: { X: WX / -2,      Z: WZ /  2, Y: WA / -2 },
  HRBDO: { X: WX / -2,      Z: WZ / -2, Y: WA / -2 },
  HRFDI: { X: WX / -2 - WH, Z: WZ /  2, Y: WA / -2 },
  HRBDI: { X: WX / -2 - WH, Z: WZ / -2, Y: WA / -2 },
  ...Array(LM - 1).fill(null).reduce((res, _, i) => ({
    ...res,
    [`M${i}F`]: { X: WX * (-1 / 2 + 1 / LM * (i + 1)), Z: WZ /  2, Y: WA / 2 },
    [`M${i}B`]: { X: WX * (-1 / 2 + 1 / LM * (i + 1)), Z: WZ / -2, Y: WA / 2 },
  }), {}),
};
const surfaces = {
  TU: ['TLFU', 'TRFU', 'TRBU', 'TLBU'],
  TD: ['TLFD', 'TRFD', 'TRBD', 'TLBD'],
  HLU: ['HLFUO', 'HLFUI', 'HLBUI', 'HLBUO'],
  HLD: ['HLFDO', 'HLFDI', 'HLBDI', 'HLBDO'],
  HRU: ['HRFUO', 'HRFUI', 'HRBUI', 'HRBUO'],
  HRD: ['HRFDO', 'HRFDI', 'HRBDI', 'HRBDO'],
  ...Array(LM - 1).fill(null).reduce((res, _, i) => ({
    ...res, [`M${i}`]: [`M${i}F`, `M${i}B`],
  }), {}),
};
