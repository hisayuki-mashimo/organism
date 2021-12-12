const coordinates = {};
const surfaces = {};

let xx = 0;
['L', 'R'].forEach((D, d) => {
  ['F', 'B'].forEach((M, m) => {
    Array(27).fill(null).forEach((_1, i) => {
      const YB =
        i <=  4 ? (Math.cos(Math.PI / 8 * (i -  0))) * -10 + 15 :
        i <=  5 ? 100 :
        i <=  9 ? (Math.sin(Math.PI / 8 * (i -  5))) *  15 + 100 :
        i <= 13 ? (Math.cos(Math.PI / 8 * (i -  9))) *   8 + 107 :
        i <= 17 ? (Math.sin(Math.PI / 8 * (i - 13))) * -12 + 107 :
        i <= 21 ? (Math.cos(Math.PI / 8 * (i - 17))) *  12 +  83 :
        i <= 22 ? 20 :
        i <= 26 ? (Math.sin(Math.PI / 8 * (i - 22))) * -20 +  20 : 0;
      const R = (
        i <=  4 ? (Math.sin(Math.PI / 8 * (i -  0))) *  10 +  30 :
        i <=  5 ? 40 :
        i <=  9 ? (Math.cos(Math.PI / 8 * (i -  5))) * -15 +  55 :
        i <= 13 ? (Math.sin(Math.PI / 8 * (i -  9))) *   6 +  55 :
        i <= 17 ? (Math.cos(Math.PI / 8 * (i - 13))) *   6 +  55 :
        i <= 21 ? (Math.sin(Math.PI / 8 * (i - 17))) *  -8 +  55 :
        i <= 22 ? 47 :
        i <= 26 ? (Math.cos(Math.PI / 8 * (i - 22))) * 20 + 27 : 0
      ) * (1 + YB / 200);
      Array(9).fill(null).forEach((_2, j) => {
        const T = Math.PI / 16 * j;
        const X = (Math.cos(T) * R + 60) * (d === 0 ? 1 : -1);
        const Z = (Math.sin(T) * R + 15) * (m === 0 ? 1 : -1);
        const Y = YB * (3 / 4 + Math.pow(Math.abs(X) / 150, 2) / 4);
        coordinates[`E${i}.${j}${D}${M}`] = { X, Y, Z };
        if (i > 0 && j > 0) {
          surfaces[`E${i}.${j}${D}${M}`] = [`E${i - 1}.${j - 1}${D}${M}`, `E${i - 1}.${j}${D}${M}`, `E${i}.${j}${D}${M}`, `E${i}.${j - 1}${D}${M}`]
        }
      });
      if (m === 1 && i > 0) {
        surfaces[`H${i}${D}`] = [`E${i - 1}.0${D}F`, `E${i - 1}.0${D}B`, `E${i}.0${D}B`, `E${i}.0${D}F`]
      }
      Array(5).fill(null).forEach((_3, k) => {
        const X = 60 / 4 * k * (d === 0 ? 1 : -1);
        const Z = (R + 15) * (m === 0 ? 1 : -1);
        const Y = YB * (3 / 4 + Math.pow(Math.abs(X) / 150, 2) / 4);
        coordinates[`K${i}.${k}${D}${M}`] = { X, Y, Z };
        if (i > 0 && k > 0) {
          surfaces[`K${i}.${k}${D}${M}`] = [`K${i - 1}.${k - 1}${D}${M}`, `K${i - 1}.${k}${D}${M}`, `K${i}.${k}${D}${M}`, `K${i}.${k - 1}${D}${M}`];
        }
      });
    });
  });
});