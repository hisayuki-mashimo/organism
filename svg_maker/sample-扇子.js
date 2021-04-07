const WI = 30;
const WO = 10;
const H = 500;
const WD = 15;
const WU = 20;
const coordinates = {
  LF1D: { X: WI /  2 + WO, Y: H / -2, Z: WD },
  RF1D: { X: WI / -2 - WO, Y: H / -2, Z: WD },
  LB1D: { X: WI /  2 + WO, Y: H / -2, Z: WD * -1 },
  RB1D: { X: WI / -2 - WO, Y: H / -2, Z: WD * -1 },
  LF2D: { X: WI /  2,      Y: H / -2, Z: WD },
  RF2D: { X: WI / -2,      Y: H / -2, Z: WD },
  LB2D: { X: WI /  2,      Y: H / -2, Z: WD * -1 },
  RB2D: { X: WI / -2,      Y: H / -2, Z: WD * -1 },
  LF1U: { X: WI /  2 + WO, Y: H /  2, Z: WU },
  RF1U: { X: WI / -2 - WO, Y: H /  2, Z: WU },
  LB1U: { X: WI /  2 + WO, Y: H /  2, Z: WU * -1 },
  RB1U: { X: WI / -2 - WO, Y: H /  2, Z: WU * -1 },
  LF2U: { X: WI /  2,      Y: H /  2, Z: WU },
  RF2U: { X: WI / -2,      Y: H /  2, Z: WU },
  LB2U: { X: WI /  2,      Y: H /  2, Z: WU * -1 },
  RB2U: { X: WI / -2,      Y: H /  2, Z: WU * -1 },
  LF2M: { X: WI /  2,      Y: 0,      Z: WU },
  LB2M: { X: WI /  2,      Y: 0,      Z: WU * -1 },
  RF2M: { X: WI / -2,      Y: 0,      Z: WU },
  RB2M: { X: WI / -2,      Y: 0,      Z: WU * -1 },
};
const surfaces = {
  L1: ['LF1D', 'LB1D', 'LB1U', 'LF1U'],
  L2: ['LF2D', 'LB2D', 'LB2U', 'LF2U'],
  R1: ['RF1D', 'RB1D', 'RB1U', 'RF1U'],
  R2: ['RF2D', 'RB2D', 'RB2U', 'RF2U'],
  M2: ['LF2M', 'LB2M', 'RB2M', 'RF2M'],
};