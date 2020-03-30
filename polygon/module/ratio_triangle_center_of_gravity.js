/**
 * 三角形重心比率係数
 *
 * 三角形ABC
 * ABの中点D
 * ACの中点E
 * ABの中点F
 * AD・BEの交点G
 * (01) AE : CE = BD : CD
 * (02) (01)より △ABC ∽ △EDC
 * (03) (02)より ∠CAB = ∠CED
 * (04) (03)より AB // ED
 * (05) (04)より △ABG ∽ △DEG
 * (06) (02)より ED = AB * (CE / AC) = AB / 2
 * (07) (05)(06)より GD = AG / 2
 * (08) (05)(06)より GE = BG / 2
 */
/* export default */const Ratio_TriangleCenterOfGravity = 1 / 3;
