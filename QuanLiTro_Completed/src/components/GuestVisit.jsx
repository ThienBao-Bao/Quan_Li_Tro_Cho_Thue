import { useState } from 'react';
import { CalendarIcon, ExcelIcon, ListIcon, UserPlusIcon } from './Icons';

import { filterGuests } from '../logic/guestFilter';
import { formatPrice } from '../logic/format';
import { guestsToCsv, downloadCsv } from '../logic/exportGuests';

function GuestVisit({ guests, onOpenAddGuest }) {
  const [guestSearch, setGuestSearch] = useState('');
  const [guestPriceFilter, setGuestPriceFilter] = useState('');
  const [guestResultFilter, setGuestResultFilter] = useState('');
  const [guestSourceFilter, setGuestSourceFilter] = useState('');
  const [guestFromDate, setGuestFromDate] = useState('2026-07-01');
  const [guestToDate, setGuestToDate] = useState('2026-07-31');

  const filteredGuests = filterGuests(guests, {
    fromDate: guestFromDate,
    toDate: guestToDate,
    search: guestSearch,
    priceFilter: guestPriceFilter,
    resultFilter: guestResultFilter,
    sourceFilter: guestSourceFilter,
  });

  const handleExportExcel = () => {
    const csv = guestsToCsv(filteredGuests);
    downloadCsv('khach-xem-phong.csv', csv);
  };

  return (
    <main>
      <div className="page-title-container">
        <h1 className="page-title-text">DANH SÁCH KHÁCH XEM PHÒNG</h1>
        <div className="page-title-line"></div>
      </div>

      <section className="filter-section-card">
        <div className="filter-grid-layout">
          <div className="filter-form-group">
            <span className="filter-badge-label">Nội dung tìm kiếm</span>
            <input
              type="text"
              className="filter-input-control"
              placeholder="Họ tên, SĐT, mã phòng..."
              value={guestSearch}
              onChange={(e) => setGuestSearch(e.target.value)}
            />
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Kết quả</span>
            <select
              className="filter-input-control"
              value={guestResultFilter}
              onChange={(e) => setGuestResultFilter(e.target.value)}
            >
              <option value="">Chọn dữ liệu</option>
              <option value="Khách không nghe máy">Khách không nghe máy</option>
              <option value="Khách cọc giữ chỗ">Khách cọc giữ chỗ</option>
              <option value="Cọc lên hợp đồng">Cọc lên hợp đồng</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Từ ngày</span>
            <input
              type="date"
              className="filter-input-control"
              value={guestFromDate}
              onChange={(e) => setGuestFromDate(e.target.value)}
            />
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Đến ngày</span>
            <input
              type="date"
              className="filter-input-control"
              value={guestToDate}
              onChange={(e) => setGuestToDate(e.target.value)}
            />
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Giá</span>
            <select
              className="filter-input-control"
              value={guestPriceFilter}
              onChange={(e) => setGuestPriceFilter(e.target.value)}
            >
              <option value="">Không</option>
              <option value="under2">&lt; 2 triệu</option>
              <option value="above2">&gt;= 2 triệu</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Nguồn khách hàng</span>
            <select
              className="filter-input-control"
              value={guestSourceFilter}
              onChange={(e) => setGuestSourceFilter(e.target.value)}
            >
              <option value="">Chọn tất cả</option>
              <option value="fb">Facebook</option>
              <option value="web">Website</option>
              <option value="intro">Giới thiệu</option>
            </select>
          </div>

          <div className="filter-bottom-controls">
            <div style={{ visibility: 'hidden' }}>Spacer</div>

            <div className="filter-action-buttons" style={{ alignItems: 'center' }}>
              <button
                className="btn-action-add-guest"
                onClick={() => onOpenAddGuest && onOpenAddGuest()}
              >
                <UserPlusIcon />
                Thêm khách xem phòng
              </button>
              <button className="btn-action-search">Tìm kiếm</button>
              <button className="btn-action-excel" type="button" onClick={handleExportExcel}>
                <ExcelIcon />
                Xuất Excel
              </button>
              <button className="btn-action-list-icon">
                <ListIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="guest-list-grid">
        {filteredGuests.map(g => (
          <div className="guest-card-wrapper" key={g.id}>
            <h3 className="guest-card-title">{g.title}</h3>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Họ tên khách:</span>
              <span className="guest-detail-val bold">{g.name}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- SĐT:</span>
              <span className="guest-detail-val phone-num">{g.phone}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Giá tư vấn:</span>
              <span className="guest-detail-val price">{formatPrice(g.consultPrice)}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Giá cho thuê:</span>
              <span className="guest-detail-val price">{formatPrice(g.rentPrice)}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Ngày giờ xem:</span>
              <span className="guest-detail-val">
                <CalendarIcon /> {g.date.split('-').reverse().join('/')} {g.time}
              </span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Người nhận tin:</span>
              <span className="guest-detail-val">{g.recipient}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- NV dẫn khách:</span>
              <span className="guest-detail-val">{g.staff}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Kết quả:</span>
              <span className="guest-detail-val result">{g.result}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Ngày cập nhật:</span>
              <span className="guest-detail-val">{g.updatedAt}</span>
            </div>

            <div className="guest-detail-row">
              <span className="guest-detail-lbl">- Ghi chú nhập:</span>
              <span className="guest-detail-val">{g.note || 'N/A'}</span>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default GuestVisit;
