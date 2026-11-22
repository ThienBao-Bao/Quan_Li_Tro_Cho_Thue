import { describe, it, expect } from 'vitest';
import { formatPrice, parsePriceToNumber } from './format';

describe('formatPrice() - thousands separator', () => {
  it('UT-FMT-01: formats millions with commas', () => {
    expect(formatPrice(3200000)).toBe('3,200,000');
  });

  it('UT-FMT-02: BVA - exactly 1000 gets one separator', () => {
    expect(formatPrice(1000)).toBe('1,000');
  });

  it('UT-FMT-03: BVA - 999 (below 1000) has no separator', () => {
    expect(formatPrice(999)).toBe('999');
  });

  it('UT-FMT-04: zero is returned unchanged', () => {
    expect(formatPrice(0)).toBe('0');
  });

  it('UT-FMT-05: a small 3-digit number has no separator', () => {
    expect(formatPrice(500)).toBe('500');
  });

  it('UT-FMT-06: accepts a numeric string input', () => {
    expect(formatPrice('2400000')).toBe('2,400,000');
  });

  it('UT-FMT-07: formats a 7-digit value (1,000,000)', () => {
    expect(formatPrice(1000000)).toBe('1,000,000');
  });
});

describe('parsePriceToNumber() - text price -> integer', () => {
  it('UT-FMT-08: strips commas from a formatted price', () => {
    expect(parsePriceToNumber('4,000,000')).toBe(4000000);
  });

  it('UT-FMT-09: strips dots (VN thousands style)', () => {
    expect(parsePriceToNumber('3.500.000')).toBe(3500000);
  });

  it('UT-FMT-10: strips currency symbol and spaces', () => {
    expect(parsePriceToNumber('2 000 000 đ')).toBe(2000000);
  });

  it('UT-FMT-11: empty string returns the default (4,000,000)', () => {
    expect(parsePriceToNumber('')).toBe(4000000);
  });

  it('UT-FMT-12: non-numeric text returns the default', () => {
    expect(parsePriceToNumber('abc')).toBe(4000000);
  });

  it('UT-FMT-13: non-numeric text returns a caller-supplied default', () => {
    expect(parsePriceToNumber('abc', 0)).toBe(0);
  });

  it('UT-FMT-14: parses a plain integer string', () => {
    expect(parsePriceToNumber('1500')).toBe(1500);
  });
});
