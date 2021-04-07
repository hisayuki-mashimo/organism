const R  = 200;
const stageL = 40;
const stageW = 8;
const angle = 8 / 180 * Math.PI;
const attenuationRate = 29 / 30;
const windL = 8;

const [coordinates, surfaces] = Array(windL).fill(null).reduce((res, _, i) => {
  const angleBase = Math.PI * 2 / windL * i;
  res[1][`I${i}`] = [];
  Array(stageL).fill(null).forEach((_, j) => {
    const RI = R * Math.pow(attenuationRate, j);
    const angleJ = (angleBase + angle * j) % (Math.PI * 2);
    const Y = stageW * j * -1;
    console.log(`${j} - ${stageW * (1 / 2 - j / stageL)}`);
    const X = RI * Math.sin(angleJ);
    const Z = RI * Math.cos(angleJ);
    res[0][`I${i}J${j}`] = { X, Z, Y };
    res[1][`I${i}`].push(`I${i}J${j}`);
  });
  return res;
}, [{}, []]);
