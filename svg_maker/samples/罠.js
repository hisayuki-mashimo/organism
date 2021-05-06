
const L = 100;
const R = 45 / 180 * Math.PI;
const DX = (1 - Math.cos(R)) *  L;
const DY = Math.sin(R) * -L;
const coordinates = {
  LFU: { X: L,       Y: 0,  Z: L},
  LBU: { X: L,       Y: 0,  Z: L * -1 },
  RFU: { X: L * -1,  Y: 0,  Z: L},
  RBU: { X: L * -1,  Y: 0,  Z: L * -1 },
  LFD: { X: DX,      Y: DY, Z: L},
  LBD: { X: DX,      Y: DY, Z: L * -1 },
  RFD: { X: DX * -1, Y: DY, Z: L},
  RBD: { X: DX * -1, Y: DY, Z: L * -1 },
};
const surfaces = {
  CU: ['LFU', 'LBU', 'RBU', 'RFU'],
  LD: ['LFU', 'LBU', 'LBD', 'LFD'],
  RD: ['RFU', 'RBU', 'RBD', 'RFD'],
};
