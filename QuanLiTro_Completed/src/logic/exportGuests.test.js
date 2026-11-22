import { describe, it, expect } from 'vitest';
import { csvEscape, guestsToCsv, CSV_COLUMNS } from './exportGuests';

const sample = [
  { title: 'A - P1', name: 'NGUYEN VAN A', phone: '0901234567', consultPrice: 4000000,
    rentPrice: 4000000, date: '2026-07-21', time: '09:30', source: 'fb',
    result: 'Mới xem phòng', updatedAt: '22/07/2026 10:00', note: 'hello' },
  { title: 'B - P2', name: 'TRAN "TI" B', phone: '0912345678', consultPrice: 3500000,
    rentPrice: 3500000, date: '2026-07-22', time: '10:00', source: 'web',
    result: 'Khách cọc giữ chỗ', updatedAt: '22/07/2026 11:00', note: '' },
];

describe('csvEscape()', () => {
  it('UT-CSV-01: wraps a value in double quotes', () => {
    expect(csvEscape('hello')).toBe('"hello"');
  });
  it('UT-CSV-02: doubles embedded double-quotes', () => {
    expect(csvEscape('TRAN "TI" B')).toBe('"TRAN ""TI"" B"');
  });
  it('UT-CSV-03: null/undefined becomes an empty quoted field', () => {
    expect(csvEscape(undefined)).toBe('""');
    expect(csvEscape(null)).toBe('""');
  });
});

describe('guestsToCsv()', () => {
  it('UT-CSV-04: first line is the Vietnamese header row', () => {
    const csv = guestsToCsv(sample);
    const header = csv.split('\r\n')[0];
    expect(header).toBe(CSV_COLUMNS.map(([, l]) => `"${l}"`).join(','));
  });
  it('UT-CSV-05: produces header + one line per guest', () => {
    const lines = guestsToCsv(sample).split('\r\n');
    expect(lines).toHaveLength(sample.length + 1);
  });
  it('UT-CSV-06: includes guest name and phone in the output', () => {
    const csv = guestsToCsv(sample);
    expect(csv).toContain('NGUYEN VAN A');
    expect(csv).toContain('0901234567');
  });
  it('UT-CSV-07: an empty guest list yields only the header row', () => {
    expect(guestsToCsv([]).split('\r\n')).toHaveLength(1);
  });
});
