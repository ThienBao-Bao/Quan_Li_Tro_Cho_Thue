export const CSV_COLUMNS = [
  ['title', 'Nhà - Phòng'],
  ['name', 'Họ tên khách'],
  ['phone', 'Số điện thoại'],
  ['consultPrice', 'Giá tư vấn'],
  ['rentPrice', 'Giá cho thuê'],
  ['date', 'Ngày xem'],
  ['time', 'Giờ xem'],
  ['source', 'Nguồn khách'],
  ['result', 'Kết quả'],
  ['updatedAt', 'Cập nhật'],
  ['note', 'Ghi chú'],
];

export function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export function guestsToCsv(guests = [], columns = CSV_COLUMNS) {
  const header = columns.map(([, label]) => csvEscape(label)).join(',');
  const lines = guests.map((g) =>
    columns.map(([key]) => csvEscape(g[key])).join(',')
  );
  return [header, ...lines].join('\r\n');
}

export function downloadCsv(filename, csv) {
  if (typeof document === 'undefined') return;
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
