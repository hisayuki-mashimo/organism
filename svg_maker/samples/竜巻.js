const R  = 200;
const stageL = 40;
const stageW = 8;
const angle = 8 / 180 * Math.PI;
const attenuationRate = 29 / 30;
const windL = 8;

const [coordinates, surfaces] = [{}, {}];

Array(windL).fill(null).forEach((_, i) => {
  const angleBase = Math.PI * 2 / windL * i;
  surfaces[`I${i}`] = [];
  Array(stageL).fill(null).forEach((_, j) => {
    const RI = R * Math.pow(attenuationRate, j);
    const angleJ = (angleBase + angle * j) % (Math.PI * 2);
    const Y = stageW * j * -1;
    const X = RI * Math.sin(angleJ);
    const Z = RI * Math.cos(angleJ);
    coordinates[`I${i}J${j}`] = { X, Z, Y };
    surfaces[`I${i}`].push(`I${i}J${j}`);
  });
});
