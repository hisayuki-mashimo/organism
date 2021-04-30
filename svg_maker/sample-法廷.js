const coordinates = {};
const surfaces = {};

const makeChair = (baseX, baseZ, baseY, vector) => {
    const SW =  10;
    const SH = 12;

    const coordinatesBase = [
        { C: '椅子_SLFD', X: SW /  2, Y: 10,        Z: SW / -2 },
        { C: '椅子_SRFD', X: SW / -2, Y: 10,        Z: SW / -2 },
        { C: '椅子_SLFU', X: SW /  2, Y: 10   + SH, Z: SW / -2 - 1 },
        { C: '椅子_SRFU', X: SW / -2, Y: 10   + SH, Z: SW / -2 - 1 },
        { C: '椅子_SLBD', X: SW /  2, Y:  9.5,      Z: SW / -2 - 1 },
        { C: '椅子_SRBD', X: SW / -2, Y:  9.5,      Z: SW / -2 - 1 },
        { C: '椅子_SLBU', X: SW /  2, Y:  9.5 + SH, Z: SW / -2 - 2 },
        { C: '椅子_SRBU', X: SW / -2, Y:  9.5 + SH, Z: SW / -2 - 2 },
        { C: '椅子_ZLFU', X: SW /  2, Y: 10,        Z: SW /  2 },
        { C: '椅子_ZRFU', X: SW / -2, Y: 10,        Z: SW /  2 },
        { C: '椅子_ZLBU', X: SW /  2, Y: 10,        Z: SW / -2 },
        { C: '椅子_ZRBU', X: SW / -2, Y: 10,        Z: SW / -2 },
        { C: '椅子_ZLFD', X: SW /  2, Y:  7,        Z: SW /  2 },
        { C: '椅子_ZRFD', X: SW / -2, Y:  7,        Z: SW /  2 },
        { C: '椅子_ZLBD', X: SW /  2, Y:  7,        Z: SW / -2 },
        { C: '椅子_ZRBD', X: SW / -2, Y:  7,        Z: SW / -2 },
    ];
    const surfacesBase = [
        { C: `椅子.SF`, S: ['椅子_SLFD', '椅子_SRFD', '椅子_SRFU', '椅子_SLFU'] },
        { C: `椅子.SB`, S: ['椅子_SLBD', '椅子_SRBD', '椅子_SRBU', '椅子_SLBU'] },
        { C: `椅子.ZU`, S: ['椅子_ZLFU', '椅子_ZRFU', '椅子_ZRBU', '椅子_ZLBU'] },
        { C: `椅子.ZD`, S: ['椅子_ZLFD', '椅子_ZRFD', '椅子_ZRBD', '椅子_ZLBD'] },
    ];

    const sinT =  Math.sin(vector);
    const cosT =  Math.cos(vector);

    coordinatesBase.forEach((c) => {
        coordinates[`${c.C}_${baseX}.${baseZ}`] = {
            X: baseX + c.X * cosT + c.Z * sinT,
            Z: baseZ + c.Z * cosT - c.X * sinT,
            Y: baseY + c.Y,
        };
    });
    surfacesBase.forEach((s) => {
        surfaces[`${s.C}_${baseX}.${baseZ}`] = s.S.map((sc) => `${sc}_${baseX}.${baseZ}`);
    });
};

[
    // { C: '法壇',       X: 225, Z: 160, Y:  0, W:  96, O: 47, H:  8 },
    // { C: '法卓',       X: 225, Z: 193, Y:  8, W:  96, O: 14, H: 20 },
    // { C: '書記官卓子', X: 245, Z: 232, Y:  0, W:  56, O: 15, H: 20 },
    // { C: '弁護人卓子', X: 200, Z: 251, Y:  0, W:  14, O: 49, H: 20 },
    // { C: '検察官卓子', X: 332, Z: 251, Y:  0, W:  14, O: 49, H: 20 },
    // { C: '廷吏卓子',   X: 332, Z: 222, Y:  0, W:  14, O: 17, H: 20 },
    // { C: '発言台.L',   X: 265, Z: 289, Y:  0, W:   1, O: 11, H: 20 },
    // { C: '発言台.R',   X: 281, Z: 289, Y:  0, W:  -1, O: 11, H: 20 },
    // { C: '発言台.F',   X: 266, Z: 289, Y:  0, W:  14, O:  1, H: 20 },
    // { C: '発言台.D',   X: 266, Z: 290, Y: 17, W:  14, O: 10, H: -1 },
    // { C: '柵',         X: 183, Z: 355, Y:  0, W: 180, O:  3, H: 20 },
    { C: '法壇',       X: 225, Z: 180, Y:  0, W:  96, O: 47, H:  8 },
    { C: '法卓',       X: 225, Z: 213, Y:  8, W:  96, O: 14, H: 20 },
    { C: '書記官卓子', X: 245, Z: 252, Y:  0, W:  56, O: 15, H: 20 },
    { C: '弁護人卓子', X: 200, Z: 267, Y:  0, W:  14, O: 49, H: 20 },
    { C: '検察官卓子', X: 332, Z: 267, Y:  0, W:  14, O: 49, H: 20 },
    { C: '廷吏卓子',   X: 332, Z: 241, Y:  0, W:  14, O: 17, H: 20 },
    { C: '発言台.L',   X: 265, Z: 291, Y:  0, W:   1, O: 11, H: 20 },
    { C: '発言台.R',   X: 281, Z: 291, Y:  0, W:  -1, O: 11, H: 20 },
    { C: '発言台.F',   X: 266, Z: 291, Y:  0, W:  14, O:  1, H: 20 },
    { C: '発言台.D',   X: 266, Z: 292, Y: 17, W:  14, O: 10, H: -1 },
    { C: '柵.U',       X: 182.5, Z: 325, Y: 20, W: 181, O:  2, H: -1.5 },
    { C: '柵.D',       X: 182.5, Z: 325, Y:  0, W: 181, O:  2, H:  1.5 },
].forEach(({ C, X, Z, Y, W, O, H}) => {
    coordinates[`${C}_FLD`] = { X,        Z,        Y };
    coordinates[`${C}_FRD`] = { X: X + W, Z,        Y };
    coordinates[`${C}_BLD`] = { X,        Z: Z + O, Y };
    coordinates[`${C}_BRD`] = { X: X + W, Z: Z + O, Y };
    coordinates[`${C}_FLU`] = { X,        Z,        Y: Y + H };
    coordinates[`${C}_FRU`] = { X: X + W, Z,        Y: Y + H };
    coordinates[`${C}_BLU`] = { X,        Z: Z + O, Y: Y + H };
    coordinates[`${C}_BRU`] = { X: X + W, Z: Z + O, Y: Y + H };
    surfaces[`${C}F`] = [`${C}_FLD`, `${C}_FRD`, `${C}_FRU`, `${C}_FLU`];
    surfaces[`${C}B`] = [`${C}_BLD`, `${C}_BRD`, `${C}_BRU`, `${C}_BLU`];
    surfaces[`${C}L`] = [`${C}_FLD`, `${C}_BLD`, `${C}_BLU`, `${C}_FLU`];
    surfaces[`${C}R`] = [`${C}_FRD`, `${C}_BRD`, `${C}_BRU`, `${C}_FRU`];
});
Array(31).fill(null).forEach((_, i) => {
    coordinates[`柵.${i}.FLU`] = { X: coordinates['柵.U_FLD'].X + i * 6,     Z: coordinates['柵.U_FLU'].Z, Y: coordinates['柵.U_FLU'].Y };
    coordinates[`柵.${i}.FRU`] = { X: coordinates['柵.U_FLD'].X + i * 6 + 1, Z: coordinates['柵.U_FRU'].Z, Y: coordinates['柵.U_FRU'].Y };
    coordinates[`柵.${i}.BLU`] = { X: coordinates['柵.U_BLD'].X + i * 6,     Z: coordinates['柵.U_BLU'].Z, Y: coordinates['柵.U_BLU'].Y };
    coordinates[`柵.${i}.BRU`] = { X: coordinates['柵.U_FLD'].X + i * 6 + 1, Z: coordinates['柵.U_BRU'].Z, Y: coordinates['柵.U_BRU'].Y };
    coordinates[`柵.${i}.FLD`] = { X: coordinates['柵.U_FLD'].X + i * 6,     Z: coordinates['柵.U_FLD'].Z, Y: coordinates['柵.D_FLU'].Y };
    coordinates[`柵.${i}.FRD`] = { X: coordinates['柵.U_FLD'].X + i * 6 + 1, Z: coordinates['柵.U_FRD'].Z, Y: coordinates['柵.D_FRU'].Y };
    coordinates[`柵.${i}.BLD`] = { X: coordinates['柵.U_BLD'].X + i * 6,     Z: coordinates['柵.U_BLD'].Z, Y: coordinates['柵.D_BLU'].Y };
    coordinates[`柵.${i}.BRD`] = { X: coordinates['柵.U_FLD'].X + i * 6 + 1, Z: coordinates['柵.U_BRD'].Z, Y: coordinates['柵.D_BRU'].Y };
    surfaces[`柵.${i}.F`] = [`柵.${i}.FLU`, `柵.${i}.FRU`, `柵.${i}.FRD`, `柵.${i}.FLD`];
    surfaces[`柵.${i}.B`] = [`柵.${i}.BLU`, `柵.${i}.BRU`, `柵.${i}.BRD`, `柵.${i}.BLD`];
});
// [
//     { X: 192, Z: 378 },
//     { X: 251, Z: 378 },
//     { X: 310, Z: 378 },
//     { X: 192, Z: 399 },
//     { X: 251, Z: 399 },
//     { X: 310, Z: 399 },
//     { X: 192, Z: 420 },
//     { X: 251, Z: 420 },
//     { X: 310, Z: 420 },
//     { X: 192, Z: 441 },
//     { X: 251, Z: 441 },
//     { X: 310, Z: 441 },
// ].forEach((c, i) => {
//     coordinates[`傍聴席_${i}FLD`] = { X: c.X,      Z: c.Z + 10, Y: 0 };
//     coordinates[`傍聴席_${i}BLD`] = { X: c.X,      Z: c.Z,      Y: 0 };
//     coordinates[`傍聴席_${i}FRD`] = { X: c.X + 44, Z: c.Z + 10, Y: 0 };
//     coordinates[`傍聴席_${i}BRD`] = { X: c.X + 44, Z: c.Z,      Y: 0 };
//     surfaces[`傍聴席${i}`] = [`傍聴席_${i}FLD`, `傍聴席_${i}BLD`, `傍聴席_${i}BRD`, `傍聴席_${i}FRD`];
// });
makeChair(251, 209, 8, 0);
makeChair(273, 209, 8, 0);
makeChair(295, 209, 8, 0);
makeChair(262, 248, 0, 0);
makeChair(284, 248, 0, 0);
makeChair(196, 280.5, 0, Math.PI / 2);
makeChair(196, 302.5, 0, Math.PI / 2);
makeChair(350, 280.5, 0, Math.PI / 2 * 3);
makeChair(350, 302.5, 0, Math.PI / 2 * 3);
makeChair(350, 249.5, 0, Math.PI / 2 * 3);
Array(3).fill(null).forEach((_, i) => {
    const baseX = 273 - 159 / 2 + (43 + 15) * i;
    Array(4).fill(null).forEach((_, j) => {
        const baseZ = 345 + j * 20;
        Array(4).fill(null).forEach((_, k) => {
            makeChair(baseX + 11 * k + 5, baseZ, 0, Math.PI);
        });
    });
});

const scale = 2.5;

Object.keys(coordinates).forEach((c) => {
    coordinates[c].X = (coordinates[c].X - 273) * scale;
    coordinates[c].Z = (coordinates[c].Z - 300) * scale;
    coordinates[c].Y = (coordinates[c].Y -  10) * scale;
});

// console.log(surfaces);
Object.keys(surfaces).forEach((s) => {
    surfaces[s].forEach((c) => {
      if (!coordinates[c]) {
        console.log(c);
      }
    });
  });
  