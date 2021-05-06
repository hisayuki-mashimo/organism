const [WX, WY, WZ, G] = [21, 6, 10, 2];
const [baseAX, baseAZ, ALX, ALZ] = [40, 100, 8, 5];
const [baseBX, baseBZ, BLX] = [-40, 100, 8];
const sideAZ = baseAZ - (WX + G) * ALZ + G;
const [LL, LW, GW] = [12, 3, 15];

const [coordinates, surfaces] = [{}, {}];

const makeWall = (sign, coordinateX, coordinateZ, vectorXorZ, vector, lengthV, lengthY, isHalfStart) => {
  const moveV = (XorZ, VL, YL, SorE) => {
    let baseCoordinate = XorZ === 'X' ? coordinateX : coordinateZ;
    if (XorZ !== vectorXorZ) return baseCoordinate;
    if (SorE === 'S' && VL === 0) return baseCoordinate;
    if (SorE === 'E' && VL >= lengthV) return baseCoordinate + ((WX + G) * lengthV - G) * vector;
    if (isHalfStart === !(YL % 2)) baseCoordinate -= (WX - WZ) * vector;
    const movedCoordinate = (WX + G) * VL + (SorE === 'E' ? WX : 0);
    return baseCoordinate + movedCoordinate * vector;
  };
  const moveY = (L, SorE) => (WY + G) * L + (SorE === 'E' ? WY : 0);
  const moveYS = (L) => moveY(L, 'S');
  const moveYE = (L) => moveY(L, 'E');

  Array(lengthY).fill(null).forEach((_, y) => {
    const moveXS = (L) => moveV('X', L, y, 'S');
    const moveXE = (L) => moveV('X', L, y, 'E');
    const moveZS = (L) => moveV('Z', L, y, 'S');
    const moveZE = (L) => moveV('Z', L, y, 'E');
    const lengthVPlus = lengthV + (isHalfStart === !(y % 2) ? 1 : 0);
    Array(lengthVPlus).fill(null).forEach((_, x) => {
      const K = `${sign}.${x}.${y}`;
      coordinates[`${K}SD`] = { X: moveXS(x), Z: moveZS(x), Y: moveYS(y) };
      coordinates[`${K}ED`] = { X: moveXE(x), Z: moveZE(x), Y: moveYS(y) };
      coordinates[`${K}SU`] = { X: moveXS(x), Z: moveZS(x), Y: moveYE(y) };
      coordinates[`${K}EU`] = { X: moveXE(x), Z: moveZE(x), Y: moveYE(y) };
      surfaces[K] = [`${K}SD`, `${K}ED`, `${K}EU`, `${K}SU`];
    });
  });
};

makeWall('AX', baseAX, baseAZ, 'X',  1, ALX, 20, false);
makeWall('AZ', baseAX, baseAZ, 'Z', -1, ALZ, 20, true);
makeWall('BX', baseBX, baseBZ, 'X', -1, BLX, 20, false);
makeWall('CX', baseAX, sideAZ - (LL + 1) * GW, 'X',  1, 5, 20, false);
makeWall('CZ', baseAX, sideAZ - (LL + 1) * GW, 'Z', -1, 5, 20, true);

Array(LL).fill(null).forEach((_, i) => {
  coordinates[`L${i}LD`] = { X: baseAX,      Y:   0, Z: sideAZ - GW * (i + 1) };
  coordinates[`L${i}LU`] = { X: baseAX,      Y: 200, Z: sideAZ - GW * (i + 1) };
  coordinates[`L${i}RD`] = { X: baseAX + LW, Y:   0, Z: sideAZ - GW * (i + 1) };
  coordinates[`L${i}RU`] = { X: baseAX + LW, Y: 200, Z: sideAZ - GW * (i + 1) };
  surfaces[`LV${i}`] = [`L${i}LD`, `L${i}LU`, `L${i}RU`, `L${i}RD`];
});
Array(3).fill(null).forEach((_, i) => {
  coordinates[`L${i}SD`] = { X: baseAX, Y: 30 * (i + 1),      Z: sideAZ };
  coordinates[`L${i}SU`] = { X: baseAX, Y: 30 * (i + 1) + LW, Z: sideAZ };
  coordinates[`L${i}ED`] = { X: baseAX, Y: 30 * (i + 1),      Z: sideAZ - (LL + 1) * GW };
  coordinates[`L${i}EU`] = { X: baseAX, Y: 30 * (i + 1) + LW, Z: sideAZ - (LL + 1) * GW };
  surfaces[`LF${i}`] = [`L${i}SD`, `L${i}SU`, `L${i}EU`, `L${i}ED`];
});
