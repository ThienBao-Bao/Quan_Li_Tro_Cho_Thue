import { describe, it, expect } from 'vitest';
import { filterRooms, matchesPriceRange, sortRooms, getVisibleRooms } from './roomFilter';
import { roomsData } from '../data/rooms';

describe('matchesPriceRange() - price range predicate (BVA)', () => {
  it('UT-ROOM-01: empty range matches any price', () => {
    expect(matchesPriceRange(3200000, '')).toBe(true);
  });
  it('UT-ROOM-02: under3 - 2,999,999 is inside', () => {
    expect(matchesPriceRange(2999999, 'under3')).toBe(true);
  });
  it('UT-ROOM-03: under3 - boundary 3,000,000 is OUTSIDE', () => {
    expect(matchesPriceRange(3000000, 'under3')).toBe(false);
  });
  it('UT-ROOM-04: 3to5 - lower boundary 3,000,000 is inside', () => {
    expect(matchesPriceRange(3000000, '3to5')).toBe(true);
  });
  it('UT-ROOM-05: 3to5 - upper boundary 5,000,000 is inside', () => {
    expect(matchesPriceRange(5000000, '3to5')).toBe(true);
  });
  it('UT-ROOM-06: above5 - boundary 5,000,000 is OUTSIDE', () => {
    expect(matchesPriceRange(5000000, 'above5')).toBe(false);
  });
  it('UT-ROOM-07: above5 - 5,000,001 is inside', () => {
    expect(matchesPriceRange(5000001, 'above5')).toBe(true);
  });
});

describe('filterRooms() - list filtering', () => {
  it('UT-ROOM-08: no criteria returns all 10 rooms', () => {
    expect(filterRooms(roomsData, {})).toHaveLength(10);
  });

  it('UT-ROOM-09: price under3 returns 3 rooms (2.4M, 2.8M, 2.2M)', () => {
    const r = filterRooms(roomsData, { priceRangeFilter: 'under3' });
    expect(r).toHaveLength(3);
    expect(r.every((x) => x.price < 3000000)).toBe(true);
  });

  it('UT-ROOM-10: price 3to5 returns 6 rooms (boundaries 3.0M & 5.0M included)', () => {
    const r = filterRooms(roomsData, { priceRangeFilter: '3to5' });
    expect(r).toHaveLength(6);
  });

  it('UT-ROOM-11: price above5 returns only room #9 (6.0M)', () => {
    const r = filterRooms(roomsData, { priceRangeFilter: 'above5' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(9);
  });

  it('UT-ROOM-12: content search matches a unique address keyword', () => {
    const r = filterRooms(roomsData, { searchContent: 'điện biên phủ' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(5);
  });

  it('UT-ROOM-13: content search is case-insensitive on the title', () => {
    const r = filterRooms(roomsData, { searchContent: 'hương lộ' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  it('UT-ROOM-14: address search narrows by district name', () => {
    const r = filterRooms(roomsData, { addressSearch: 'gò vấp' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(10);
  });

  it('UT-ROOM-15: district filter returns the 2 Phú Nhuận rooms', () => {
    const r = filterRooms(roomsData, { districtFilter: 'Phú Nhuận' });
    expect(r).toHaveLength(2);
  });

  it('UT-ROOM-16: placeholder district "Chọn dữ liệu" is treated as no filter', () => {
    expect(filterRooms(roomsData, { districtFilter: 'Chọn dữ liệu' })).toHaveLength(10);
  });

  it('UT-ROOM-17: combined price(3to5) + district(Phú Nhuận) returns 2 rooms', () => {
    const r = filterRooms(roomsData, { priceRangeFilter: '3to5', districtFilter: 'Phú Nhuận' });
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.id).sort()).toEqual([3, 8]);
  });

  it('UT-ROOM-18: whitespace-only search is ignored (returns all)', () => {
    expect(filterRooms(roomsData, { searchContent: '   ' })).toHaveLength(10);
  });

  it('UT-ROOM-19: no match returns an empty list', () => {
    expect(filterRooms(roomsData, { searchContent: 'zzz-not-found' })).toHaveLength(0);
  });
});

describe('filterRooms() - filters fixed in this release', () => {
  it('UT-ROOM-20: ward filter keeps only "Bình Trị Đông" rooms [BUG-001]', () => {
    const r = filterRooms(roomsData, { wardFilter: 'Bình Trị Đông' });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });
  it('UT-ROOM-21: city filter "Hà Nội" matches no HCMC room [BUG-002]', () => {
    expect(filterRooms(roomsData, { cityFilter: 'Hà Nội' })).toHaveLength(0);
  });
  it('UT-ROOM-22: city filter "Hồ Chí Minh" matches all rooms [BUG-002]', () => {
    expect(filterRooms(roomsData, { cityFilter: 'Hồ Chí Minh' })).toHaveLength(10);
  });
  it('UT-ROOM-23: house filter "Chính chủ" keeps owner-occupied rooms [BUG-003]', () => {
    const r = filterRooms(roomsData, { houseFilter: 'Chính chủ' });
    expect(r.map((x) => x.id).sort((a, b) => a - b)).toEqual([4, 10]);
  });
  it('UT-ROOM-24: house filter "NhaTroVN" keeps the other 8 rooms [BUG-003]', () => {
    expect(filterRooms(roomsData, { houseFilter: 'NhaTroVN' })).toHaveLength(8);
  });
  it('UT-ROOM-25: photo filter "has" keeps rooms with an image [BUG-004]', () => {
    expect(filterRooms(roomsData, { photoFilter: 'has' })).toHaveLength(10);
  });
  it('UT-ROOM-26: photo filter "none" keeps rooms without an image [BUG-004]', () => {
    expect(filterRooms(roomsData, { photoFilter: 'none' })).toHaveLength(0);
  });
  it('UT-ROOM-27: hotOnly keeps only the 2 featured rooms [BUG-010]', () => {
    const r = filterRooms(roomsData, { hotOnly: true });
    expect(r.map((x) => x.id).sort((a, b) => a - b)).toEqual([1, 2]);
  });
});

describe('sortRooms() / getVisibleRooms() - sorting fixed in this release [BUG-005]', () => {
  it('UT-ROOM-28: priceAsc puts the cheapest room (2.2M, id 10) first', () => {
    const r = sortRooms(roomsData, 'priceAsc');
    expect(r[0].id).toBe(10);
    expect(r[r.length - 1].price).toBe(6000000);
  });
  it('UT-ROOM-29: priceDesc puts the most expensive room (6.0M, id 9) first', () => {
    expect(sortRooms(roomsData, 'priceDesc')[0].id).toBe(9);
  });
  it('UT-ROOM-30: newest sorts by timestamp (id 1 is newest)', () => {
    expect(sortRooms(roomsData, 'newest')[0].id).toBe(1);
  });
  it('UT-ROOM-31: sortRooms does not mutate the input array', () => {
    const before = roomsData.map((r) => r.id);
    sortRooms(roomsData, 'priceAsc');
    expect(roomsData.map((r) => r.id)).toEqual(before);
  });
  it('UT-ROOM-32: getVisibleRooms filters (under3) then sorts (priceAsc)', () => {
    const r = getVisibleRooms(roomsData, { priceRangeFilter: 'under3', sortBy: 'priceAsc' });
    expect(r.map((x) => x.id)).toEqual([10, 2, 5]);
  });
});
