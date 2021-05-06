const [W, R, Z, L, V] = [40, 20, 200, 400, 16];
const codes = ['A', 'B', 'C', 'D', 'E', 'F'];
const X0 = (W * (codes.length - 1)) / -2;
const [coordinates, surfaces] = codes.reduce((res, code, index) => {
  Array(V).fill(0).forEach((_, n) => {
    const X = X0 + W * index + R * Math.cos(Math.PI * 2 / V * n);
    const Y = R * Math.sin(Math.PI * 2 / V * n);
    const CCode = `${code}${index}_${n}`;
    const CCodeNext = `${code}${index}_${n + 1 < V ? n + 1 : 0}`;
    res[0][`${CCode}F`] = { X, Y, Z };
    res[0][`${CCode}B`] = { X, Y, Z: Z - L };
    res[1][CCode] = [ `${CCode}F`, `${CCode}B`, `${CCodeNext}B`, `${CCodeNext}F` ];
  });
  return res;
}, [{}, {}]);
coordinates.T1 = { X:  7, Y: 300, Z:  -90 };
coordinates.T2 = { X: -7, Y: 300, Z:  -90 };
coordinates.T3 = { X: -7, Y: 300, Z: -104 };
coordinates.T4 = { X:  7, Y: 300, Z: -104 };
coordinates.t1 = { X:  7, Y:   0, Z:  -90 };
coordinates.t2 = { X: -7, Y:   0, Z:  -90 };
coordinates.t3 = { X: -7, Y:   0, Z: -104 };
coordinates.t4 = { X:  7, Y:   0, Z: -104 };
surfaces.T1 = ['T1', 'T2', 't2', 't1'];
surfaces.T2 = ['T2', 'T3', 't3', 't2'];
surfaces.T3 = ['T3', 'T4', 't4', 't3'];
surfaces.T4 = ['T4', 'T1', 't1', 't4'];
coordinates.H1 = { X:  120, Y: 280, Z:  -80 };
coordinates.H2 = { X:  120, Y: 270, Z:  -80 };
coordinates.H3 = { X:  120, Y: 270, Z:  -90 };
coordinates.H4 = { X:  120, Y: 280, Z:  -90 };
coordinates.h1 = { X: -120, Y: 280, Z:  -80 };
coordinates.h2 = { X: -120, Y: 270, Z:  -80 };
coordinates.h3 = { X: -120, Y: 270, Z:  -90 };
coordinates.h4 = { X: -120, Y: 280, Z:  -90 };
surfaces.H1 = ['H1', 'H2', 'h2', 'h1'];
surfaces.H2 = ['H2', 'H3', 'h3', 'h2'];
surfaces.H3 = ['H3', 'H4', 'h4', 'h3'];
surfaces.H4 = ['H4', 'H1', 'h1', 'h4'];
coordinates.H5 = { X:  140, Y: 130, Z:  -80 };
coordinates.H6 = { X:  140, Y: 120, Z:  -80 };
coordinates.H7 = { X:  140, Y: 120, Z:  -90 };
coordinates.H8 = { X:  140, Y: 130, Z:  -90 };
coordinates.h5 = { X: -140, Y: 130, Z:  -80 };
coordinates.h6 = { X: -140, Y: 120, Z:  -80 };
coordinates.h7 = { X: -140, Y: 120, Z:  -90 };
coordinates.h8 = { X: -140, Y: 130, Z:  -90 };
surfaces.H5 = ['H5', 'H6', 'h6', 'h5'];
surfaces.H6 = ['H6', 'H7', 'h7', 'h6'];
surfaces.H7 = ['H7', 'H8', 'h8', 'h7'];
surfaces.H8 = ['H8', 'H5', 'h5', 'h8'];

const colors = {
  default: '#886644',
  H: '#aa8866',
  T: '#aa8866',
};
const strokeColors = {
  default: '#000000',
};
