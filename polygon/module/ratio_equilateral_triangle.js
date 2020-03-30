/**
 * 正三角形比率係数
 *
 * 正三角形ABC
 * BCの中点D
 * (01) AB = AC
 * (02) BD = CD
 * (03) (01)(02)より △ABD ≡ △ACD
 * (04) (03)より ∠ADB = ∠ADC = 90°
 * (05) (04)より AB * AB = AD * AD + BD * BD
 * (06) BD = BC / 2 = AB / 2
 * (07) (05)(06)より 2BD * 2BD = AD * AD + BD * BD ∴ AD = BD * √3
 */
/* export default */const Ratio_EquilateralTriangle = Math.sqrt(3);
