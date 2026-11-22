export function matchesGuestPrice(rentPrice, range) {
  if (!range) return true;
  if (range === 'under2') return rentPrice < 2000000;
  if (range === 'above2') return rentPrice >= 2000000;
  return true;
}

export function filterGuests(guests = [], criteria = {}) {
  const {
    fromDate = '',
    toDate = '',
    search = '',
    priceFilter = '',
    resultFilter = '',
    sourceFilter = '',
  } = criteria;

  return guests.filter((g) => {
    if (fromDate && g.date < fromDate) return false;
    if (toDate && g.date > toDate) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        g.name.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.title.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (!matchesGuestPrice(g.rentPrice, priceFilter)) return false;

    if (resultFilter && resultFilter !== 'Chọn dữ liệu') {
      if (g.result !== resultFilter) return false;
    }

    if (sourceFilter && sourceFilter !== 'Chọn tất cả') {
      if (g.source !== sourceFilter) return false;
    }

    return true;
  });
}
