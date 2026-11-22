import { describe, it, expect } from 'vitest';
import { filterGuests, matchesGuestPrice } from './guestFilter';
import { guestsData } from '../data/guests';

describe('matchesGuestPrice() - price predicate (BVA at 2,000,000)', () => {
  it('UT-GUEST-01: empty range matches any price', () => {
    expect(matchesGuestPrice(1400000, '')).toBe(true);
  });
  it('UT-GUEST-02: under2 - 1,999,999 is inside', () => {
    expect(matchesGuestPrice(1999999, 'under2')).toBe(true);
  });
  it('UT-GUEST-03: under2 - boundary 2,000,000 is OUTSIDE', () => {
    expect(matchesGuestPrice(2000000, 'under2')).toBe(false);
  });
  it('UT-GUEST-04: above2 - boundary 2,000,000 is inside', () => {
    expect(matchesGuestPrice(2000000, 'above2')).toBe(true);
  });
});

describe('filterGuests() - list filtering', () => {
  it('UT-GUEST-05: no criteria returns all 5 guests', () => {
    expect(filterGuests(guestsData, {})).toHaveLength(5);
  });

  it('UT-GUEST-06: full July range returns all 5 guests', () => {
    const r = filterGuests(guestsData, { fromDate: '2026-07-01', toDate: '2026-07-31' });
    expect(r).toHaveLength(5);
  });

  it('UT-GUEST-07: fromDate 2026-07-15 keeps guests on/after that date (3)', () => {
    const r = filterGuests(guestsData, { fromDate: '2026-07-15' });
    expect(r.map((g) => g.id).sort()).toEqual([1, 4, 5]);
  });

  it('UT-GUEST-08: BVA - fromDate equal to a guest date is inclusive', () => {
    const r = filterGuests(guestsData, { fromDate: '2026-07-17' });
    expect(r.some((g) => g.id === 1)).toBe(true);
  });

  it('UT-GUEST-09: toDate 2026-07-14 keeps guests on/before that date (2)', () => {
    const r = filterGuests(guestsData, { toDate: '2026-07-14' });
    expect(r.map((g) => g.id).sort()).toEqual([2, 3]);
  });

  it('UT-GUEST-10: narrow window 07-14..07-17 returns 2 guests', () => {
    const r = filterGuests(guestsData, { fromDate: '2026-07-14', toDate: '2026-07-17' });
    expect(r.map((g) => g.id).sort()).toEqual([1, 2]);
  });

  it('UT-GUEST-11: search by (partial) name is case-insensitive', () => {
    const r = filterGuests(guestsData, { search: 'cường' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });

  it('UT-GUEST-12: search by phone substring', () => {
    const r = filterGuests(guestsData, { search: '0905' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(4);
  });

  it('UT-GUEST-13: search by room title keyword', () => {
    const r = filterGuests(guestsData, { search: 'lê văn sỹ' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(4);
  });

  it('UT-GUEST-14: price under2 returns 3 guests', () => {
    expect(filterGuests(guestsData, { priceFilter: 'under2' })).toHaveLength(3);
  });

  it('UT-GUEST-15: price above2 returns 2 guests', () => {
    expect(filterGuests(guestsData, { priceFilter: 'above2' })).toHaveLength(2);
  });

  it('UT-GUEST-16: result filter returns the 2 "did not answer" guests', () => {
    const r = filterGuests(guestsData, { resultFilter: 'Khách không nghe máy' });
    expect(r.map((g) => g.id).sort()).toEqual([1, 4]);
  });

  it('UT-GUEST-17: placeholder result "Chọn dữ liệu" is treated as no filter', () => {
    expect(filterGuests(guestsData, { resultFilter: 'Chọn dữ liệu' })).toHaveLength(5);
  });

  it('UT-GUEST-18: combined result + price returns 1 guest', () => {
    const r = filterGuests(guestsData, {
      resultFilter: 'Khách cọc giữ chỗ',
      priceFilter: 'above2',
    });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(5);
  });

  it('UT-GUEST-19: no match returns an empty list', () => {
    expect(filterGuests(guestsData, { search: 'zzz-not-found' })).toHaveLength(0);
  });

  it('UT-GUEST-20: source "fb" returns the 2 Facebook guests', () => {
    expect(filterGuests(guestsData, { sourceFilter: 'fb' }).map((g) => g.id).sort())
      .toEqual([1, 4]);
  });
  it('UT-GUEST-21: source "intro" returns the single referral guest', () => {
    const r = filterGuests(guestsData, { sourceFilter: 'intro' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(3);
  });
  it('UT-GUEST-22: combined source(fb) + price(under2) returns 1 guest', () => {
    const r = filterGuests(guestsData, { sourceFilter: 'fb', priceFilter: 'under2' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });
});
