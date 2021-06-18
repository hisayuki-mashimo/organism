const TXW = 400;
const TYP = 100;
const TYW =  10;
const MXW = 200;
const MYW = 100;
const KZW =  12;
const SAW =   5;
const ERW =  16;
const EYP = 135;
const ERL =   8;
const coordinates = {
  TLFU: { X: TXW /  2, Y: TYP,       Z:  40 },
  TRFU: { X: TXW / -2, Y: TYP,       Z:  40 },
  TLBU: { X: TXW /  2, Y: TYP,       Z: -40 },
  TRBU: { X: TXW / -2, Y: TYP,       Z: -40 },
  TLFD: { X: TXW /  2, Y: TYP - TYW, Z:  40 },
  TRFD: { X: TXW / -2, Y: TYP - TYW, Z:  40 },
  TLBD: { X: TXW /  2, Y: TYP - TYW, Z: -40 },
  TRBD: { X: TXW / -2, Y: TYP - TYW, Z: -40 },
  KLLFU: { X: TXW          /  2,       Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  KLRFU: { X: (TXW - MXW)  /  2 + SAW, Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  KLLFD: { X: TXW          /  2,       Y: TYP,                 Z: KZW /  2 },
  KLRFD: { X: (TXW - MXW)  /  2 + SAW, Y: TYP,                 Z: KZW /  2 },
  KLLBU: { X: TXW          /  2,       Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  KLRBU: { X: (TXW - MXW)  /  2 + SAW, Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  KLLBD: { X: TXW          /  2,       Y: TYP,                 Z: KZW / -2 },
  KLRBD: { X: (TXW - MXW)  /  2 + SAW, Y: TYP,                 Z: KZW / -2 },
  KRLFU: { X: TXW          / -2,       Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  KRRFU: { X: (TXW - MXW)  / -2 - SAW, Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  KRLFD: { X: TXW          / -2,       Y: TYP,                 Z: KZW /  2 },
  KRRFD: { X: (TXW - MXW)  / -2 - SAW, Y: TYP,                 Z: KZW /  2 },
  KRLBU: { X: TXW          / -2,       Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  KRRBU: { X: (TXW - MXW)  / -2 - SAW, Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  KRLBD: { X: TXW          / -2,       Y: TYP,                 Z: KZW / -2 },
  KRRBD: { X: (TXW - MXW)  / -2 - SAW, Y: TYP,                 Z: KZW / -2 },
  SLLFU: { X: (TXW - MXW)  /  2 + SAW, Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  SLRFU: { X: (TXW - MXW)  /  2,       Y: TYP + MYW + SAW,     Z: KZW /  2 },
  SLLFD: { X: (TXW - MXW)  /  2 + SAW, Y: TYP,                 Z: KZW /  2 },
  SLRFD: { X: (TXW - MXW)  /  2,       Y: TYP + SAW,           Z: KZW /  2 },
  SLLBU: { X: (TXW - MXW)  /  2 + SAW, Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  SLRBU: { X: (TXW - MXW)  /  2,       Y: TYP + MYW + SAW,     Z: KZW / -2 },
  SLLBD: { X: (TXW - MXW)  /  2 + SAW, Y: TYP,                 Z: KZW / -2 },
  SLRBD: { X: (TXW - MXW)  /  2,       Y: TYP + SAW,           Z: KZW / -2 },
  SRRFU: { X: (TXW - MXW)  / -2 - SAW, Y: TYP + MYW + SAW * 2, Z: KZW /  2 },
  SRLFU: { X: (TXW - MXW)  / -2,       Y: TYP + MYW + SAW,     Z: KZW /  2 },
  SRRFD: { X: (TXW - MXW)  / -2 - SAW, Y: TYP,                 Z: KZW /  2 },
  SRLFD: { X: (TXW - MXW)  / -2,       Y: TYP + SAW,           Z: KZW /  2 },
  SRRBU: { X: (TXW - MXW)  / -2 - SAW, Y: TYP + MYW + SAW * 2, Z: KZW / -2 },
  SRLBU: { X: (TXW - MXW)  / -2,       Y: TYP + MYW + SAW,     Z: KZW / -2 },
  SRRBD: { X: (TXW - MXW)  / -2 - SAW, Y: TYP,                 Z: KZW / -2 },
  SRLBD: { X: (TXW - MXW)  / -2,       Y: TYP + SAW,           Z: KZW / -2 },
  MLU: { X: MXW /  2, Y: TYP + MYW + SAW, Z: 0 },
  MRU: { X: MXW / -2, Y: TYP + MYW + SAW, Z: 0 },
  MLD: { X: MXW /  2, Y: TYP       + SAW, Z: 0 },
  MRD: { X: MXW / -2, Y: TYP       + SAW, Z: 0 },
};
const surfaces = {
  TU: ['TLFU', 'TLBU', 'TRBU', 'TRFU'],
  TD: ['TLFD', 'TLBD', 'TRBD', 'TRFD'],
  KLF: ['KLLFU', 'KLRFU', 'KLRFD', 'KLLFD'],
  KLB: ['KLLBU', 'KLRBU', 'KLRBD', 'KLLBD'],
  KRF: ['KRLFU', 'KRRFU', 'KRRFD', 'KRLFD'],
  KRB: ['KRLBU', 'KRRBU', 'KRRBD', 'KRLBD'],
  SLF: ['SLLFU', 'SLRFU', 'SLRFD', 'SLLFD'],
  SLB: ['SLLBU', 'SLRBU', 'SLRBD', 'SLLBD'],
  SRF: ['SRRFU', 'SRLFU', 'SRLFD', 'SRRFD'],
  SRB: ['SRRBU', 'SRLBU', 'SRLBD', 'SRRBD'],
  SUF: ['SLLFU', 'SRRFU', 'SRLFU', 'SLRFU'],
  SUB: ['SLLBU', 'SRRBU', 'SRLBU', 'SLRBU'],
  SDF: ['SLLFD', 'SRRFD', 'SRLFD', 'SLRFD'],
  SDB: ['SLLBD', 'SRRBD', 'SRLBD', 'SLRBD'],
  M: ['MLU', 'MRU', 'MRD', 'MLD'],
  E: [],
};
Array(ERL).fill(null).forEach((_, i) => {
  const T = Math.PI * 2 / ERL * i;
  coordinates[`E${i}`] = { X: Math.sin(T) * ERW, Y: Math.cos(T) * ERW + EYP, Z: 0 };
  surfaces.E.push([`E${i}`]);
});
