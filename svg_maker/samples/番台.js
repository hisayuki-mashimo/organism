const XWO = 200;
const XWI = 180;
const ZWO = 100;
const ZWI = 90;
const coordinatesBase = {
  D1: { X: 112, Y:   0, Z:  62 },
  D2: { X: 112, Y:  16, Z:  62 },
  D3: { X: 100, Y:  16, Z:  50 },
  D4: { X: 100, Y: 112, Z:  50 },
  D5: { X: 123, Y: 112, Z:  73 },
  D6: { X: 123, Y: 128, Z:  73 },
};

const [coordinates, surfaces] = [{}, {}];
Object.keys(coordinatesBase).forEach((key) => {
  coordinates[`${key}.LF`] = { ...coordinatesBase[key] };
  coordinates[`${key}.LB`] = { ...coordinatesBase[key], Z: coordinatesBase[key].Z * -1 };
  coordinates[`${key}.RF`] = { ...coordinatesBase[key], X: coordinatesBase[key].X * -1 };
  coordinates[`${key}.RB`] = { ...coordinatesBase[key], X: coordinatesBase[key].X * -1, Z: coordinatesBase[key].Z * -1 };
  surfaces[key] = [`${key}.LF`, `${key}.LB`, `${key}.RB`, `${key}.RF`];
});
surfaces.F = ['D3.LF', 'D3.RF', 'D4.RF', 'D4.LF'];
surfaces.B = ['D3.LB', 'D3.RB', 'D4.RB', 'D4.LB'];
coordinates.K1LD = { X:  90, Y:  26, Z: 50 };
coordinates.K1RD = { X: -90, Y:  26, Z: 50 };
coordinates.K1LU = { X:  90, Y: 102, Z: 50 };
coordinates.K1RU = { X: -90, Y: 102, Z: 50 };
surfaces.K1 = ['K1LD', 'K1RD', 'K1RU', 'K1LU'];
coordinates.K2LD = { X:  90, Y:  26, Z: 40 };
coordinates.K2RD = { X: -90, Y:  26, Z: 40 };
coordinates.K2LU = { X:  90, Y: 102, Z: 40 };
coordinates.K2RU = { X: -90, Y: 102, Z: 40 };
surfaces.K2 = ['K2LD', 'K2RD', 'K2RU', 'K2LU'];
