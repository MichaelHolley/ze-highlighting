type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export interface Highlighting {
  key: string;
  color: Color;
}

export enum Route {
  stundenanzeige = 0,
  stundenerfassung = 1
}
