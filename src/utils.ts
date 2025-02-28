import { StdAnzeigeConfig, StdErfassungConfig } from "./configurations";
import type { Color } from "./models";
import { Route } from "./models";

export function getConfigByPage(route: Route) {
  if (route === Route.stundenanzeige) {
    return StdAnzeigeConfig;
  }

  return StdErfassungConfig;
}

export function generateRandomColorHex(): Color {
  return `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0")}`;
}

export function isNumeric(str: string) {
  if (typeof str !== "string") return false; // only process strings!

  /**
   * use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)
   * and ensure strings of whitespace fail
   */
  return !Number.isNaN(str) && !Number.isNaN(Number.parseFloat(str));
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

export function getRoute() {
  const urlRoute = window.location.pathname.substring(1).replace(".php", "");

  if (urlRoute === "" || urlRoute === "stundenanzeige") {
    return Route.stundenanzeige;
  }

  if (urlRoute === "stundenerfassung") {
    return Route.stundenerfassung;
  }

  return undefined;
}
