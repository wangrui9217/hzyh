const PI = 3.14159265358979324
const xPi = 3.14159265358979324 * 3000.0 / 180.0

/**
 * 地图坐标转换
 */
export class CoordinateService {
  private static delta(lat, lon) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    let a = 6378245.0
    let ee = 0.00669342162296594323
    let dLat = CoordinateService.transformLat(lon - 105.0, lat - 35.0)
    let dLon = CoordinateService.transformLon(lon - 105.0, lat - 35.0)
    let radLat = lat / 180.0 * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    let sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI)
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI)
    return {
      'lat': dLat,
      'lon': dLon
    }
  }

  // WGS-84 to GCJ-02
  private static gcjEncrypt(wgsLat, wgsLon) {
    if (CoordinateService.outOfChina(wgsLat, wgsLon)) {
      return {
        'lat': wgsLat,
        'lon': wgsLon
      }
    }

    let d = CoordinateService.delta(wgsLat, wgsLon)
    return {
      'lat': wgsLat + d.lat,
      'lon': wgsLon + d.lon
    }
  }
  // // GCJ-02 to WGS-84
  // const gcjDecrypt = function (gcjLat, gcjLon) {
  //   if (outOfChina(gcjLat, gcjLon)) {
  //     return {
  //       'lat': gcjLat,
  //       'lon': gcjLon
  //     }
  //   }

  //   let d = delta(gcjLat, gcjLon)
  //   return {
  //     'lat': gcjLat - d.lat,
  //     'lon': gcjLon - d.lon
  //   }
  // }
  // GCJ-02 to WGS-84 exactly
  private static gcjDecryptExact(gcjLat, gcjLon) {
    let initDelta = 0.01
    let threshold = 0.000000001
    let dLat = initDelta
    let dLon = initDelta
    let mLat = gcjLat - dLat
    let mLon = gcjLon - dLon
    let pLat = gcjLat + dLat
    let pLon = gcjLon + dLon
    let wgsLat = 0
    let wgsLon = 0
    let i = 0
    while (1) {
      wgsLat = (mLat + pLat) / 2
      wgsLon = (mLon + pLon) / 2
      let tmp = CoordinateService.gcjEncrypt(wgsLat, wgsLon)
      dLat = tmp.lat - gcjLat
      dLon = tmp.lon - gcjLon
      if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) {
        break
      }

      if (dLat > 0) pLat = wgsLat
      else mLat = wgsLat
      if (dLon > 0) pLon = wgsLon
      else mLon = wgsLon

      if (++i > 10000) break
    }
    return {
      'lat': wgsLat,
      'lon': wgsLon
    }
  }
  // GCJ-02 to BD-09
  private static bdEncrypt(gcjLat, gcjLon) {
    let x = gcjLon
    let y = gcjLat
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * xPi)
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * xPi)
    let bdLon = z * Math.cos(theta) + 0.0065
    let bdLat = z * Math.sin(theta) + 0.006
    return {
      'lat': bdLat,
      'lon': bdLon
    }
  }
  // BD-09 to GCJ-02
  private static bdDecrypt(bdLat, bdLon) {
    let x = bdLon - 0.0065
    let y = bdLat - 0.006
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi)
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi)
    let gcjLon = z * Math.cos(theta)
    let gcjLat = z * Math.sin(theta)
    return {
      'lat': gcjLat,
      'lon': gcjLon
    }
  }
  // const distance = function (latA, logA, latB, logB) {
  //   let earthR = 6371000
  //   let x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((logA - logB) * Math.PI / 180)
  //   let y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180)
  //   let s = x + y
  //   if (s > 1) {
  //     s = 1
  //   }
  //   if (s < -1) {
  //     s = -1
  //   }
  //   let alpha = Math.acos(s)
  //   let distan = alpha * earthR
  //   return distan
  // }
  private static outOfChina(lat, lon) {
    if (lon < 72.004 || lon > 137.8347) {
      return true
    }
    if (lat < 0.8293 || lat > 55.8271) {
      return true
    }
    return false
  }

  private static transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0
    ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0
    return ret
  }

  private static transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0
    ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0
    ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0
    return ret
  }

  // 百度坐标系转换gc坐标系
  private static bdTogcj(lat, lon) {
    return CoordinateService.bdDecrypt(lat, lon)
  }

  // 百度坐标系转换wgs坐标系
  private static bdTowgs(lat, lon) {
    let locate = CoordinateService.bdDecrypt(lat, lon)
    return CoordinateService.gcjDecryptExact(locate.lat, locate.lon)
  }

  // wgs坐标系转换百度坐标系
  private static wgsTobd(lat, lon) {
    let locate = CoordinateService.gcjEncrypt(lat, lon)
    return CoordinateService.bdEncrypt(locate.lat, locate.lon)
  }

  /**
   * 坐标系转化
   */
  public static convert({ origin, target, data }: { origin: "bd" | "wgs" | "gcj", target: "bd" | "wgs" | "gcj", data: { lat: number, lng: number } }) {
    if (!origin || !target) {
      return data
    }

    if (origin == target) {
      return data
    }

    if (origin == "wgs" && target == "bd") {
      return CoordinateService.wgsTobd(data.lat, data.lng)
    }

    if (origin == "bd" && target == "wgs") {
      return CoordinateService.bdTowgs(data.lat, data.lng)
    }

    if (origin == "bd" && target == "gcj") {
      return CoordinateService.bdTogcj(data.lat, data.lng)
    }

    if (origin == "wgs" && target == "bd") {
      return CoordinateService.bdTowgs(data.lat, data.lng)
    }
  }
}