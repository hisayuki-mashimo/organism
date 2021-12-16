const coordinates = {};
const surfaces = {};
const params = [
  { X:   0, Z: 20 },
  { X:   5, Z: 20 },
  { X:  10, Z: 20 },
  { X:  15, Z: 20 },
  { X:  20, Z: 20 },
  { X:  25, Z: 20 },
  { X:  30, Z: 20 },
  { X:  35, Z: 20 },
  { X:  40, Z: 20 },
  { X:  45, Z: 20 },
  { X:  50, Z: 20 },
  { X:  55, Z: 20 },
  { X:  60, Z: 20 },
  { X:  65, Z: 20 },
  { X:  70, Z: 20 },
  { X:  75, Z: 20 },
  { X:  80, Z: 20 },
  { X:  85, Z: 20 },
  { X:  90, Z: 20 },
  { X:  95, Z: 20 },
  { X: 100, Z: 20 },
];
const 傾斜設定 = { X: 50, Y: 20 };

const shapeCoordinate = (EX, EY, ER) => {
  // [0, 傾斜設定.Y] [傾斜設定.X, 0]
  // Y - Q = A * (X - P) ^ 2
  // Y - 0 = A * (X - 傾斜設定.X) ^ 2
  // Y / ((X - 傾斜設定.X) ^ 2) = A
  // 傾斜設定.Y / ((0 - 傾斜設定.X) ^ 2) = A
  // 傾斜設定.Y / 傾斜設定.X / 傾斜設定.X = A
  // Y = 傾斜設定.Y / 傾斜設定.X / 傾斜設定.X * (X - 傾斜設定.X)
  const HA = 傾斜設定.Y / 傾斜設定.X / 傾斜設定.X;
  const HP = 傾斜設定.X;
  // ┌ (X - EX) ^ 2 + (Y - EY) ^ 2 = ER ^ 2
  // └ Y = HA * (X - HP) ^ 2
  // ┌ X * X + Y * Y = ER * ER
  // └ Y + EY = HA * (X - HP + EX) * (X - HP + EX)
  // ┌ X * X = ER * ER - Y * Y
  // └ Y = HA * (X - HP + EX) * (X - HP + EX) - EY
  // X * X = ER * ER - Math.pow(HA * (X - HP + EX) * (X - HP + EX) - EY, 2)
};

params.reduce(([_C, _X, _Y], param, i) => {
  if (i === 0) {
    _C.push({ X: _X, Y: _Y, Z: params.Z });
  } else if (_Y > 0) {
    const W = param.X - params[i - 1].X;
  }

  return [_C, _X, _Y];
}, [[], 傾斜設定.X, 傾斜設定.Y]);
