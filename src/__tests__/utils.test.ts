import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StdAnzeigeConfig, StdErfassungConfig } from '../configurations';
import { Route } from '../models';
import {
  generateRandomColorHex,
  getConfigByPage,
  getRoute,
  hexToRgb,
  isNumeric
} from '../utils';

describe('utils', () => {
  describe('getConfigByPage', () => {
    it('returns StdAnzeigeConfig for stundenanzeige route', () => {
      expect(getConfigByPage(Route.stundenanzeige)).toBe(StdAnzeigeConfig);
    });

    it('returns StdErfassungConfig for other routes', () => {
      expect(getConfigByPage(Route.stundenerfassung)).toBe(StdErfassungConfig);
    });
  });

  describe('generateRandomColorHex', () => {
    it('generates valid hex color', () => {
      const color = generateRandomColorHex();
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe('isNumeric', () => {
    it('returns true for numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('returns false for non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('12.3')).toBe(false);
      expect(isNumeric('')).toBe(false);
      expect(isNumeric('123a')).toBe(false);
    });

    it('returns false for non-string inputs', () => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      expect(isNumeric(123 as any)).toBe(false);
    });
  });

  describe('hexToRgb', () => {
    it('converts valid hex colors to RGB', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('returns null for invalid hex colors', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#12345')).toBeNull();
      expect(hexToRgb('#GGGGGG')).toBeNull();
    });
  });

  describe('getRoute', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      // biome-ignore lint/performance/noDelete: <explanation>
      delete (window as any).location;
      window.location = { ...originalLocation, pathname: '' };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('returns stundenanzeige for empty path', () => {
      window.location.pathname = '/';
      expect(getRoute()).toBe(Route.stundenanzeige);
    });

    it('returns stundenanzeige for /stundenanzeige.php', () => {
      window.location.pathname = '/stundenanzeige.php';
      expect(getRoute()).toBe(Route.stundenanzeige);
    });

    it('returns stundenerfassung for /stundenerfassung.php', () => {
      window.location.pathname = '/stundenerfassung.php';
      expect(getRoute()).toBe(Route.stundenerfassung);
    });

    it('returns undefined for unknown routes', () => {
      window.location.pathname = '/unknown.php';
      expect(getRoute()).toBeUndefined();
    });
  });
});
