const pillarA = { X: -80, Y: 0, WX: 8, WY: 400, WZ: 28 };
const pillarB = { X: pillarA.X + 130, Y: 0, WX: 30, WY: 400, WZ: 12 };
const pillarC = { X: pillarA.X + 196, Y: 0, WX: 32, WY: 400, WZ: 3 };
const pillarD = { X: pillarB.X + pillarB.WX, Y: 145, WX: 200, WY: 22, WZ: 8 };
const pillarE = { X: pillarD.X, Y: pillarD.Y, WX: pillarC.X - pillarD.X, WY: pillarD.WY, WZ: pillarC.WZ };
const pillarF = { X: pillarC.X + pillarC.WX, Y: pillarD.Y, WX: pillarD.X + pillarD.WX - pillarC.X - pillarC.WX, WY: pillarD.WY, WZ: pillarC.WZ };
const [coordinates, surfaces] = [pillarA, pillarB, pillarC, pillarD, pillarE, pillarF].reduce((res, o, i) => [{
  ...res[0],
  [`H${i}FLD`]: { X: o.X,        Y: o.Y,        Z: o.WZ },
  [`H${i}FRD`]: { X: o.X + o.WX, Y: o.Y,        Z: o.WZ },
  [`H${i}FLU`]: { X: o.X,        Y: o.Y + o.WY, Z: o.WZ },
  [`H${i}FRU`]: { X: o.X + o.WX, Y: o.Y + o.WY, Z: o.WZ },
  [`H${i}BLD`]: { X: o.X,        Y: o.Y,        Z: 0 },
  [`H${i}BRD`]: { X: o.X + o.WX, Y: o.Y,        Z: 0 },
  [`H${i}BLU`]: { X: o.X,        Y: o.Y + o.WY, Z: 0 },
  [`H${i}BRU`]: { X: o.X + o.WX, Y: o.Y + o.WY, Z: 0 },
}, {
  ...res[1],
  [`H${i}F`]: [`H${i}FLD`, `H${i}FRD`, `H${i}FRU`, `H${i}FLU`],
  [`H${i}L`]: [`H${i}FLD`, `H${i}BLD`, `H${i}BLU`, `H${i}FLU`],
  [`H${i}R`]: [`H${i}FRD`, `H${i}BRD`, `H${i}BRU`, `H${i}FRU`],
}], [{}, {}]);
