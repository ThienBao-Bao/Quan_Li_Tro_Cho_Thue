export function matchesPriceRange(price, range) {
  if (!range) return true;
  if (range === 'under3') return price < 3000000;
  if (range === '3to5') return price >= 3000000 && price <= 5000000;
  if (range === 'above5') return price > 5000000;
  return true;
}

export function parseRoomTime(timeStr) {
  const s = String(timeStr || '');
  const [datePart, timePart = '00:00:00'] = s.split(' ');
  const dp = datePart.split('/');
  if (dp.length !== 3) return 0;
  const [dd, mm, yyyy] = dp;
  const [hh = '0', mi = '0', ss = '0'] = timePart.split(':');
  const t = new Date(+yyyy, +mm - 1, +dd, +hh, +mi, +ss).getTime();
  return Number.isNaN(t) ? 0 : t;
}

const PLACEHOLDERS = ['', 'Chọn dữ liệu', 'Chọn tất cả'];

export function filterRooms(rooms = [], criteria = {}) {
  const {
    searchContent = '',
    addressSearch = '',
    priceRangeFilter = '',
    districtFilter = '',
    wardFilter = '',
    cityFilter = '',
    houseFilter = '',
    photoFilter = '',
    hotOnly = false,
  } = criteria;

  const includesCI = (haystack, needle) =>
    String(haystack).toLowerCase().includes(String(needle).toLowerCase());

  return rooms.filter((room) => {
    if (searchContent.trim()) {
      if (!includesCI(room.title, searchContent) && !includesCI(room.address, searchContent)) {
        return false;
      }
    }

    if (addressSearch.trim() && !includesCI(room.address, addressSearch)) return false;

    if (!matchesPriceRange(room.price, priceRangeFilter)) return false;

    if (!PLACEHOLDERS.includes(districtFilter) && !includesCI(room.address, districtFilter)) return false;
    if (!PLACEHOLDERS.includes(wardFilter) && !includesCI(room.address, wardFilter)) return false;
    if (!PLACEHOLDERS.includes(cityFilter) && !includesCI(room.address, cityFilter)) return false;

    if (!PLACEHOLDERS.includes(houseFilter)) {
      const isOwnerOccupied = !!room.amenities?.chungChu;
      if (houseFilter === 'Chính chủ' && !isOwnerOccupied) return false;
      if (houseFilter === 'NhaTroVN' && isOwnerOccupied) return false;
    }

    if (photoFilter === 'has' && !room.image) return false;
    if (photoFilter === 'none' && room.image) return false;

    if (hotOnly && !room.isHot) return false;

    return true;
  });
}

export function sortRooms(rooms = [], sortBy = '') {
  const out = [...rooms];
  if (sortBy === 'priceAsc') out.sort((a, b) => a.price - b.price);
  else if (sortBy === 'priceDesc') out.sort((a, b) => b.price - a.price);
  else if (sortBy === 'newest') out.sort((a, b) => parseRoomTime(b.time) - parseRoomTime(a.time));
  return out;
}

export function getVisibleRooms(rooms = [], criteria = {}) {
  return sortRooms(filterRooms(rooms, criteria), criteria.sortBy || '');
}
