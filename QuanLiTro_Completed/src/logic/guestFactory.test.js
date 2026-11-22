import { describe, it, expect } from 'vitest';
import {
  todayIso,
  validateGuestForm,
  parseViewDateTime,
  buildGuestTitle,
  buildGuestRecord,
  GUEST_FORM_MESSAGES,
  DEFAULT_RECIPIENT,
  DEFAULT_RESULT,
} from './guestFactory';

describe('validateGuestForm() - required field validation', () => {
  it('UT-FACT-01: name + valid phone present -> valid', () => {
    expect(validateGuestForm('Nguyen Van A', '0901234567')).toEqual({
      valid: true,
      error: null,
    });
  });
  it('UT-FACT-02: empty name -> "missing name" error', () => {
    const r = validateGuestForm('', '0901234567');
    expect(r).toEqual({ valid: false, error: GUEST_FORM_MESSAGES.MISSING_NAME });
  });
  it('UT-FACT-03: whitespace-only name -> "missing name" error', () => {
    expect(validateGuestForm('   ', '0901234567').error).toBe(GUEST_FORM_MESSAGES.MISSING_NAME);
  });
  it('UT-FACT-04: empty phone -> "missing phone" error', () => {
    const r = validateGuestForm('Nguyen Van A', '');
    expect(r).toEqual({ valid: false, error: GUEST_FORM_MESSAGES.MISSING_PHONE });
  });
  it('UT-FACT-05: whitespace-only phone -> "missing phone" error', () => {
    expect(validateGuestForm('Nguyen Van A', '   ').error).toBe(GUEST_FORM_MESSAGES.MISSING_PHONE);
  });
  it('UT-FACT-06: null inputs -> "missing name" (no crash)', () => {
    expect(validateGuestForm(null, null).error).toBe(GUEST_FORM_MESSAGES.MISSING_NAME);
  });
  it('UT-FACT-20: non-numeric phone -> "invalid phone" error [BUG-008]', () => {
    const r = validateGuestForm('Nguyen Van A', 'abcxyz');
    expect(r).toEqual({ valid: false, error: GUEST_FORM_MESSAGES.INVALID_PHONE });
  });
  it('UT-FACT-21: too-short phone (<9 digits) -> "invalid phone" error [BUG-008]', () => {
    expect(validateGuestForm('Nguyen Van A', '12345').error).toBe(GUEST_FORM_MESSAGES.INVALID_PHONE);
  });
  it('UT-FACT-23: a past viewing date is rejected [SRS v1.1 UCS-01 Alt-1]', () => {
    const r = validateGuestForm('Nguyen Van A', '0901234567', '01/01/2020 09:00', '2026-07-23');
    expect(r).toEqual({ valid: false, error: GUEST_FORM_MESSAGES.PAST_DATE });
  });
  it('UT-FACT-24: BVA - a viewing date equal to today is accepted', () => {
    const r = validateGuestForm('Nguyen Van A', '0901234567', '23/07/2026 09:00', '2026-07-23');
    expect(r).toEqual({ valid: true, error: null });
  });
  it('UT-FACT-25: a future viewing date is accepted', () => {
    const r = validateGuestForm('Nguyen Van A', '0901234567', '31/12/2026 09:00', '2026-07-23');
    expect(r.valid).toBe(true);
  });
  it('UT-FACT-26: date is not checked when no viewing date is supplied', () => {
    expect(validateGuestForm('Nguyen Van A', '0901234567').valid).toBe(true);
  });
  it('UT-FACT-27: todayIso() formats a date as YYYY-MM-DD with zero padding', () => {
    expect(todayIso(new Date(2026, 6, 5))).toBe('2026-07-05');
    expect(todayIso(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
  it('UT-FACT-28: todayIso() defaults to the current date', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('parseViewDateTime() - "DD/MM/YYYY HH:MM" -> ISO', () => {
  it('UT-FACT-07: parses a full date-time', () => {
    expect(parseViewDateTime('21/07/2026 09:30')).toEqual({ date: '2026-07-21', time: '09:30' });
  });
  it('UT-FACT-08: pads single-digit day and month', () => {
    expect(parseViewDateTime('5/7/2026 8:00')).toEqual({ date: '2026-07-05', time: '8:00' });
  });
  it('UT-FACT-09: date without time defaults time to 00:00', () => {
    expect(parseViewDateTime('21/07/2026')).toEqual({ date: '2026-07-21', time: '00:00' });
  });
  it('UT-FACT-10: empty string falls back to defaults', () => {
    expect(parseViewDateTime('')).toEqual({ date: '2026-07-21', time: '00:00' });
  });
  it('UT-FACT-11: malformed input falls back to default date', () => {
    expect(parseViewDateTime('invalid').date).toBe('2026-07-21');
  });
});

describe('buildGuestTitle() - room title construction', () => {
  it('UT-FACT-12: house without a numeric prefix is kept as-is', () => {
    expect(buildGuestTitle('7 LÝ CHIÊU HOÀNG', 'P1201')).toBe('7 LÝ CHIÊU HOÀNG - P1201');
  });
  it('UT-FACT-13: leading "code - " prefix is stripped from the house', () => {
    expect(buildGuestTitle('306 - 589 HƯƠNG LỘ 2', 'P306')).toBe('589 HƯƠNG LỘ 2 - P306');
  });
  it('UT-FACT-14: leading "P1201 - " prefix is stripped', () => {
    expect(buildGuestTitle('P1201 - Test House', 'R1')).toBe('Test House - R1');
  });
});

describe('buildGuestRecord() - full record construction', () => {
  const input = {
    house: '7 LÝ CHIÊU HOÀNG',
    room: 'P1201',
    name: '  nguyen van a ',
    phone: ' 0901234567 ',
    consultPrice: '4,000,000',
    viewDateTime: '21/07/2026 09:30',
    source: 'fb',
    note: '  hello world ',
  };

  it('UT-FACT-15: builds a fully-populated, normalised record', () => {
    const g = buildGuestRecord(input, { id: 12345, updatedAt: '22/07/2026 10:00' });
    expect(g).toEqual({
      id: 12345,
      title: '7 LÝ CHIÊU HOÀNG - P1201',
      name: 'NGUYEN VAN A',
      phone: '0901234567',
      consultPrice: 4000000,
      rentPrice: 4000000,
      date: '2026-07-21',
      time: '09:30',
      source: 'fb',
      recipient: DEFAULT_RECIPIENT,
      staff: DEFAULT_RECIPIENT,
      result: DEFAULT_RESULT,
      updatedAt: '22/07/2026 10:00',
      note: 'hello world',
    });
  });

  it('UT-FACT-22: customer source defaults to "" when not supplied [BUG-006]', () => {
    const withoutSource = { ...input };
    delete withoutSource.source;
    const g = buildGuestRecord(withoutSource, { id: 1 });
    expect(g.source).toBe('');
  });

  it('UT-FACT-16: blank consultation price falls back to 4,000,000', () => {
    const g = buildGuestRecord({ ...input, consultPrice: '' }, { id: 1 });
    expect(g.consultPrice).toBe(4000000);
    expect(g.rentPrice).toBe(4000000);
  });

  it('UT-FACT-17: empty note becomes an empty string', () => {
    const g = buildGuestRecord({ ...input, note: '' }, { id: 1 });
    expect(g.note).toBe('');
  });

  it('UT-FACT-18: result status defaults to "Mới xem phòng"', () => {
    const g = buildGuestRecord(input, { id: 1 });
    expect(g.result).toBe('Mới xem phòng');
  });

  it('UT-FACT-19: id defaults to a positive timestamp when not supplied', () => {
    const g = buildGuestRecord(input);
    expect(typeof g.id).toBe('number');
    expect(g.id).toBeGreaterThan(0);
  });
});
