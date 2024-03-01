import { StdAnzeigeConfig, StdErfassungConfig } from "./configurations";
import { Route } from "./models";

export function getConfigByPage(route: Route) {
  if (route === Route.stundenanzeige) {
    return StdAnzeigeConfig;
  } else {
    return StdErfassungConfig;
  }
}

export function generateRandomColorHex(): any {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}

export function isNumeric(str: string) {
  if (typeof str != "string") return false; // only process strings!

  /**
   * use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)
   * and ensure strings of whitespace fail
   */
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
