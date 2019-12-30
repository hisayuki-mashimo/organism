/**
 * 五芒星比率係数
 *
 * 五角形ABCDE
 * BD・CEの交点F
 * AD・CEの交点G
 * AD・BEの交点H
 * AC・BEの交点I
 * AC・BDの交点J
 * (01) 五芒星定義 AB // EC
 * (02) 五芒星定義 AD // BC
 * (03) 五芒星定義 BE // CD
 * (04) 五芒星定義 AC // ED
 * (05) (02)(03)より BCDHは平行四辺形
 * (06) (03)(04)より CDEIは平行四辺形
 * (07) (05)より BH = CD
 * (08) (06)より CD = EI
 * (09) (07)(08)より BH = EI
 * (10) (09)より BI = EH
 * (11) (02)より △AHI ∽ △CBI
 * (12) (11)より HI : BI = AI : CI
 * (13) (01)より △ABI ∽ △CEI
 * (14) (13)より AI : CI = BI : EI
 * (15) (12)(14)より HI : BI = BI : EI
 * (16) (13)より EI : BE = CI : AC
 * (17) (11)より CI : AC = BI : BH
 * (18) (16)(17)より EI : BE = BI : BH
 * (19) (03)より △ACD ∽ △AIH
 * (20) (19)より HI : CD = AI : AC
 * (21) (13)より AI : AC = BI : BE
 * (22) (20)(21)より HI : CD = BI : BE
 * (23) (08)(22)より HI : EI = BI : BE
 * (24) (10)(15)(18)(23)より BI / HI = (HI + BI) / BI = (HI + 2BI) / (HI + BI)
 * (25) (23)より (HI + BI) / HI = (HI + 2BI) / BI
 * (26) (24)より
 *   HI: 1
 *   BI: X
 *   1/X = X/(1 + X)
 *   (1 + X)/X = X
 *   1 + X = XX
 *   XX - X - 1 = 0
 *   (X - 1/2)(X - 1/2) - 1/4 - 1 = 0
 *   (X - 1/2)(X - 1/2) = 5/4
 *   X - 1/2 = +- √(5/4)
 *   X = 1/2 +- √(5/4)
 *   1/2 - √(5/4) < 0 であるため
 *   X = 1/2 + √(5/4)
 *   X = 1/2 + √(5)/2
 *   X = (1 + √(5))/2
 */
/* export default */const Ratio_FivePointedStar = (1 + Math.sqrt(5)) / 2;
