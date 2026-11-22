import { parsePriceToNumber } from './format';

export const GUEST_FORM_MESSAGES = {
  MISSING_NAME: 'Vui lòng nhập họ tên khách hàng!',
  MISSING_PHONE: 'Vui lòng nhập số điện thoại!',
  INVALID_PHONE: 'Số điện thoại không hợp lệ (chỉ gồm 9-11 chữ số)!',
  PAST_DATE: 'Ngày xem phòng không được ở quá khứ!',
};

export const PHONE_REGEX = /^\d{9,11}$/;

export const DEFAULT_RECIPIENT = '0915350145 - NGUYỄN VIỆT ANH THỊNH';
export const DEFAULT_RESULT = 'Mới xem phòng';
export const DEFAULT_VIEW_DATE = '2026-07-21';

export function todayIso(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

export function validateGuestForm(name, phone, viewDateTime = null, today = null) {
  if (!String(name ?? '').trim()) {
    return { valid: false, error: GUEST_FORM_MESSAGES.MISSING_NAME };
  }
  const cleanPhone = String(phone ?? '').trim();
  if (!cleanPhone) {
    return { valid: false, error: GUEST_FORM_MESSAGES.MISSING_PHONE };
  }

  if (!PHONE_REGEX.test(cleanPhone)) {
    return { valid: false, error: GUEST_FORM_MESSAGES.INVALID_PHONE };
  }

  if (viewDateTime) {
    const { date } = parseViewDateTime(viewDateTime);
    if (date < (today || todayIso())) {
      return { valid: false, error: GUEST_FORM_MESSAGES.PAST_DATE };
    }
  }
  return { valid: true, error: null };
}

export function parseViewDateTime(viewDateTime) {
  const raw = String(viewDateTime ?? '');
  const dateParts = raw.split(' ')[0].split('/');
  let date = DEFAULT_VIEW_DATE;
  if (dateParts.length === 3) {
    date = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
  }
  const time = raw.split(' ')[1] || '00:00';
  return { date, time };
}

export function buildGuestTitle(house, room) {
  const cleanedHouse = String(house ?? '').replace(/^P?\d+\s*-\s*/, '');
  return `${cleanedHouse} - ${room}`;
}

export function buildGuestRecord(input, options = {}) {
  const {
    house = '',
    room = '',
    name = '',
    phone = '',
    consultPrice = '',
    viewDateTime = '',
    source = '',
    note = '',
  } = input || {};

  const numericPrice = parsePriceToNumber(consultPrice, 4000000);
  const { date, time } = parseViewDateTime(viewDateTime);

  return {
    id: options.id ?? Date.now(),
    title: buildGuestTitle(house, room),
    name: name.trim().toUpperCase(),
    phone: phone.trim(),
    consultPrice: numericPrice,
    rentPrice: numericPrice,
    date,
    time,
    source,
    recipient: DEFAULT_RECIPIENT,
    staff: DEFAULT_RECIPIENT,
    result: DEFAULT_RESULT,
    updatedAt: options.updatedAt ?? '',
    note: note.trim(),
  };
}
