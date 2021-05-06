const stepL = 16;
const orbitL = 3;
const stepWRO = 100;
const stepWRI = 20;
const stepH = 15;
const startH = -350;

const [coordinates, surfaces] = [{}, {}];

Array(stepL * orbitL + 1).fill(null).forEach((_, i) => {
  const T = Math.PI * 2 / stepL * (i % stepL);
  const XO = Math.sin(T) * stepWRO;
  const ZO = Math.cos(T) * stepWRO;
  const XI = Math.sin(T) * stepWRI;
  const ZI = Math.cos(T) * stepWRI;
  const Y = i * stepH + startH;
  coordinates[`${i}OD`] = { X: XO, Y, Z: ZO };
  coordinates[`${i}ID`] = { X: XI, Y, Z: ZI };
  if (i < stepL * orbitL) {
    coordinates[`${i}OU`] = { X: XO, Y: Y + stepH, Z: ZO };
    coordinates[`${i}IU`] = { X: XI, Y: Y + stepH, Z: ZI };
    surfaces[`${i}V`] = [`${i}OD`, `${i}ID`, `${i}IU`, `${i}OU`];
  }
  if (i > 0) {
    surfaces[`${i}H`] = [`${i - 1}OU`, `${i - 1}IU`, `${i}ID`, `${i}OD`];
  }
});

Array(stepL).fill(null).forEach((_, i) => {
  const T1 = Math.PI * 2 / stepL * (i % stepL);
  const T2 = Math.PI * 2 / stepL * ((i + 1) % stepL);
  coordinates[`F${i}D1`] = { X: Math.sin(T1) * stepWRI, Z: Math.cos(T1) * stepWRI, Y: startH };
  coordinates[`F${i}D2`] = { X: Math.sin(T2) * stepWRI, Z: Math.cos(T2) * stepWRI, Y: startH };
  coordinates[`F${i}U1`] = { X: Math.sin(T1) * stepWRI, Z: Math.cos(T1) * stepWRI, Y: startH + stepH * stepL * orbitL };
  coordinates[`F${i}U2`] = { X: Math.sin(T2) * stepWRI, Z: Math.cos(T2) * stepWRI, Y: startH + stepH * stepL * orbitL };
  surfaces[`F${i}`] = [`F${i}D1`, `F${i}D2`, `F${i}U2`, `F${i}U1`];
  const baseX = Math.sin(T1) * (stepWRO + 2);
  const baseZ = Math.cos(T1) * (stepWRO + 2);
  Array(8).fill(null).forEach((_, j) => {
    const TS1 = Math.PI * 2 / 8 * (j % 8);
    const TS2 = Math.PI * 2 / 8 * ((j + 1) % 8);
    coordinates[`S${i}.${j}D1`] = { X: baseX + Math.sin(TS1) * 2, Z: baseZ + Math.cos(TS1) * 2, Y: startH };
    coordinates[`S${i}.${j}D2`] = { X: baseX + Math.sin(TS2) * 2, Z: baseZ + Math.cos(TS2) * 2, Y: startH };
    coordinates[`S${i}.${j}U1`] = { X: baseX + Math.sin(TS1) * 2, Z: baseZ + Math.cos(TS1) * 2, Y: startH + stepH * stepL * orbitL };
    coordinates[`S${i}.${j}U2`] = { X: baseX + Math.sin(TS2) * 2, Z: baseZ + Math.cos(TS2) * 2, Y: startH + stepH * stepL * orbitL };
    surfaces[`S${i}.${j}`] = [`S${i}.${j}D1`, `S${i}.${j}D2`, `S${i}.${j}U2`, `S${i}.${j}U1`];
  });
});
