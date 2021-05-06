const [WX, WY, WZ] = [10.5, 6, -10];
const BL = 10;
const PX = WX * BL * 5 / -2 + 1;

const [coordinates, surfaces] = [{}, {}];

Array(BL).fill(null).forEach((_, i) => {
  Array(5).fill(null).forEach((_, j) => {
    const coordinatesA = [{ X: PX + WX * i * 5, Y: WY * j, Z: 0 }];
    const coordinatesB = [{ X: PX + WX * i * 5, Y: WY * j, Z: WZ * 2 }];
    if ((i % 2 + j % 2) % 2) {
      coordinatesA.push({ X: PX + WX * (i * 5 + 2), Y: WY * j, Z: 0 });
      coordinatesB.push({ X: PX + WX * i * 5, Y: WY * j, Z: WZ });
    } else {
      coordinatesA.push({ X: PX + WX * (i * 5 + 1), Y: WY * j, Z: 0 });
      coordinatesA.push({ X: PX + WX * (i * 5 + 3), Y: WY * j, Z: 0 });
    }
    coordinatesA.push({ X: PX + WX * (i * 5 + 4), Y: WY * j, Z: 0 });
    coordinatesA.forEach((c, k) => {
      coordinates[`${i}.${k}.${j}FD`] = { ...c };
      coordinates[`${i}.${k}.${j}FU`] = { ...c, Y: c.Y + WY };
      if (k > 0) {
        surfaces[`${i}.${k}.${j}F`] = [`${i}.${k - 1}.${j}FD`, `${i}.${k - 1}.${j}FU`, `${i}.${k}.${j}FU`, `${i}.${k}.${j}FD`];
      }
    });
    coordinatesB.forEach((c, k) => {
      coordinates[`${i}.${k}.${j}BD`] = { ...c };
      coordinates[`${i}.${k}.${j}BU`] = { ...c, Y: c.Y + WY };
      if (k + 1 < coordinatesB.length) {
        surfaces[`${i}.${k}.${j}B`] = [`${i}.${k}.${j}BD`, `${i}.${k}.${j}BU`, `${i}.${k + 1}.${j}BU`, `${i}.${k + 1}.${j}BD`];
      } else {
        surfaces[`${i}.${k}.${j}B`] = [`${i}.0.${j}FD`, `${i}.0.${j}FU`, `${i}.${k}.${j}BU`, `${i}.${k}.${j}BD`];
      }
    });
  });
});

Array(5).fill(null).forEach((_, j) => {
  coordinates[`0.${j}WU`] = { X: PX, Y: WY * j * -1,      Z: 0 };
  coordinates[`0.${j}WD`] = { X: PX, Y: WY * j * -1 - WY, Z: 0 };
  Array(Math.ceil(BL * 5 / 2)).fill(null).forEach((_, i) => {
    if (j % 2) {
      coordinates[`${i + 1}.${j}WU`] = { X: PX + WX * (i * 2 + 1), Y: WY * j * -1,      Z: 0 };
      coordinates[`${i + 1}.${j}WD`] = { X: PX + WX * (i * 2 + 1), Y: WY * j * -1 - WY, Z: 0 };
    } else {
      coordinates[`${i + 1}.${j}WU`] = { X: PX + WX * i * 2, Y: WY * j * -1,      Z: 0 };
      coordinates[`${i + 1}.${j}WD`] = { X: PX + WX * i * 2, Y: WY * j * -1 - WY, Z: 0 };
    }
    surfaces[`${i}.${j}W`] = [`${i}.${j}WD`, `${i}.${j}WU`, `${i + 1}.${j}WU`, `${i + 1}.${j}WD`];
  });
});
