import { useState } from 'react';
import {
  UserPlusIcon,
  MapMarkerIcon,
  FilterIcon,
  LoftRoomSVG,
  LoftRoomSVG2
} from './Icons';

import { getVisibleRooms } from '../logic/roomFilter';
import { formatPrice } from '../logic/format';

function RoomSale({ rooms, onOpenAddGuest }) {
  const [cityFilter, setCityFilter] = useState('Thành Phố Hồ Chí Minh');
  const [districtFilter, setDistrictFilter] = useState('');
  const [wardFilter, setWardFilter] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [photoFilter, setPhotoFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [hotOnly, setHotOnly] = useState(false);
  const [addressSearch, setAddressSearch] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  const [searchContent, setSearchContent] = useState('');
  const [mapCheckbox, setMapCheckbox] = useState(false);

  const filteredRooms = getVisibleRooms(rooms, {
    searchContent,
    addressSearch,
    priceRangeFilter,
    districtFilter,
    wardFilter,
    cityFilter,
    houseFilter,
    photoFilter,
    hotOnly,
    sortBy,
  });

  return (
    <main>
      <div className="page-title-container">
        <h1 className="page-title-text">BÁN PHÒNG</h1>
        <div className="page-title-line"></div>
        <p className="page-subtitle-text">
          Số phòng đang xem: <span className="text-accent-red">{filteredRooms.length} phòng</span>
        </p>
      </div>

      <section className="filter-section-card">
        <div className="filter-grid-layout">
          <div className="filter-form-group">
            <span className="filter-badge-label">Tỉnh / thành phố</span>
            <select
              className="filter-input-control"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="Thành Phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Bình Dương">Bình Dương</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Quận/Huyện</span>
            <select
              className="filter-input-control"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="">Chọn dữ liệu</option>
              <option value="Bình Tân">Quận Bình Tân</option>
              <option value="Quận 8">Quận 8</option>
              <option value="Phú Nhuận">Quận Phú Nhuận</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 10">Quận 10</option>
              <option value="Bình Thạnh">Quận Bình Thạnh</option>
              <option value="Quận 5">Quận 5</option>
              <option value="Gò Vấp">Quận Gò Vấp</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Ảnh phòng</span>
            <select
              className="filter-input-control"
              value={photoFilter}
              onChange={(e) => setPhotoFilter(e.target.value)}
            >
              <option value="">Chọn tất cả</option>
              <option value="has">Đã có ảnh</option>
              <option value="none">Chưa có ảnh</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Nhập nội dung</span>
            <div className="search-textarea-container">
              <input
                type="text"
                className="filter-input-control"
                placeholder="Mã phòng, địa chỉ..."
                value={searchContent}
                onChange={(e) => setSearchContent(e.target.value)}
              />
              <button className="filter-icon-btn" title="Tìm kiếm nâng cao">
                <FilterIcon />
              </button>
            </div>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Phường/Xã</span>
            <select
              className="filter-input-control"
              value={wardFilter}
              onChange={(e) => setWardFilter(e.target.value)}
            >
              <option value="">Chọn dữ liệu</option>
              <option value="Bình Trị Đông">Bình Trị Đông</option>
              <option value="Phường 07">Phường 07</option>
              <option value="Phường 13">Phường 13</option>
              <option value="Nguyễn Cư Trinh">Nguyễn Cư Trinh</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Nhà</span>
            <select
              className="filter-input-control"
              value={houseFilter}
              onChange={(e) => setHouseFilter(e.target.value)}
            >
              <option value="">Chọn tất cả</option>
              <option value="NhaTroVN">NhaTroVN</option>
              <option value="Chính chủ">Nhà riêng</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Giá phòng</span>
            <select
              className="filter-input-control"
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
            >
              <option value="">Chọn khoảng giá</option>
              <option value="under3">Dưới 3 triệu</option>
              <option value="3to5">Từ 3 triệu - 5 triệu</option>
              <option value="above5">Trên 5 triệu</option>
            </select>
          </div>

          <div className="filter-form-group">
            <span className="filter-badge-label">Sắp xếp theo</span>
            <select
              className="filter-input-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
            </select>
          </div>

          <div className="filter-form-group" style={{ gridColumn: 'span 2' }}>
            <span className="filter-badge-label">Địa chỉ nhà</span>
            <input
              type="text"
              className="filter-input-control"
              placeholder="Số nhà, tên đường..."
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
            />
          </div>

          <div className="filter-bottom-controls">
            <label className="checkbox-label-wrapper">
              <input
                type="checkbox"
                className="checkbox-control"
                checked={mapCheckbox}
                onChange={(e) => setMapCheckbox(e.target.checked)}
              />
              Xem dạng bản đồ
            </label>

            <div className="filter-action-buttons">
              <button
                type="button"
                className="btn-action-hot"
                style={hotOnly ? { outline: '2px solid #dc3545' } : undefined}
                aria-pressed={hotOnly}
                onClick={() => setHotOnly((v) => !v)}
              >
                🔥 HOT
              </button>
              <button type="button" className="btn-action-search">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </section>

      <section className="room-list-grid">
        {filteredRooms.map((room, idx) => (
          <div className="room-card-wrapper" key={room.id}>
            <div className="room-card-header">
              <h3 className="room-card-title">
                {room.title} <span>[Ẩn/hiển]</span>
              </h3>
              <button
                className="btn-add-client"
                title="Thêm khách xem phòng"
                onClick={() => onOpenAddGuest && onOpenAddGuest(room)}
              >
                <UserPlusIcon />
              </button>
            </div>

            <div className="room-card-body-content">
              <div className="room-image-frame">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.title}
                    className="room-card-img"
                    loading="lazy"
                  />
                ) : (
                  idx % 2 === 0 ? <LoftRoomSVG /> : <LoftRoomSVG2 />
                )}
              </div>

              <div className="room-info-column">
                <span className="info-row-datetime">{room.time}</span>
                <p className="info-row-address">
                  <MapMarkerIcon />
                  {room.address} <span>[Ẩn/hiển]</span>
                </p>
                <p className="info-row-price">
                  ★ Giá cho thuê: {formatPrice(room.price)}
                </p>
                <p className="info-row-price deposit">
                  ✦ Cọc thuê: {room.deposit}
                </p>

                <div className="utility-table-grid">
                  <div className="utility-item">
                    <span className="utility-lbl">Điện:</span>
                    <span className="utility-val">{room.electricity}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Wifi:</span>
                    <span className="utility-val">{room.wifi}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Nước:</span>
                    <span className="utility-val">{room.water}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">M.giặt:</span>
                    <span className="utility-val">{room.washing}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Xe:</span>
                    <span className="utility-val">{room.bike}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Thẻ:</span>
                    <span className="utility-val">{room.card}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Quản lý:</span>
                    <span className="utility-val">{room.management}</span>
                  </div>
                  <div className="utility-item">
                    <span className="utility-lbl">Phí DV:</span>
                    <span className="utility-val">{room.otherFee}</span>
                  </div>
                </div>

                <div className="map-furniture-links">
                  <span>Link GoogleMap</span> [Ẩn/hiển nội thất]
                </div>

                <table className="amenities-indicator-table">
                  <tbody>
                    <tr>
                      <td>Phòng: <strong>{room.amenities.phong}</strong></td>
                      <td>Vị trí: <strong>{room.amenities.viTri}</strong></td>
                      <td>Diện tích: <strong>{room.amenities.dienTich}</strong></td>
                    </tr>
                    <tr>
                      <td>Toilet: <strong>{room.amenities.toilet}</strong></td>
                      <td>Để xe: <strong>{room.amenities.deXe}</strong></td>
                      <td>Sân phơi: <strong>{room.amenities.sanPhoi}</strong></td>
                    </tr>
                    <tr>
                      <td>Khóa cổng: <strong>{room.amenities.khoaCong}</strong></td>
                      <td>Giờ giấc: <strong>{room.amenities.gioGiac}</strong></td>
                      <td>Hẹn dọn vào: <strong>{room.amenities.henDonVao}</strong></td>
                    </tr>
                    <tr>
                      <td>SL xe: <strong>{room.amenities.slXe}</strong></td>
                      <td>SL người: <strong>{room.amenities.slNguoi}</strong></td>
                      <td>Hẹn bổ sung cọc: <strong>{room.amenities.henBoSungCoc}</strong></td>
                    </tr>
                    <tr>
                      <td>Cọc giữ chỗ: <strong>{room.amenities.cocGiuCho}</strong></td>
                      <td colSpan="2"></td>
                    </tr>
                    <tr>
                      <td>Gác: {room.amenities.gac ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Cửa sổ: {room.amenities.cuaSo ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Ban công: {room.amenities.banCong ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                    </tr>
                    <tr>
                      <td>Tủ lạnh: {room.amenities.tuLanh ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Tivi: {room.amenities.tivi ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Máy giặt: <strong>{room.amenities.mayGiat}</strong></td>
                    </tr>
                    <tr>
                      <td>Kệ bếp: {room.amenities.keBep ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Bồn rửa chén: {room.amenities.bonRuaChen ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Nước nóng: {room.amenities.nuocNong ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                    </tr>
                    <tr>
                      <td>Giường: {room.amenities.giuong ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Nệm: {room.amenities.nem ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Tủ quần áo: {room.amenities.tuQuanAo ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                    </tr>
                    <tr>
                      <td>Chung chủ: {room.amenities.chungChu ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Thang máy: {room.amenities.thangMay ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Bảo vệ: {room.amenities.baoVe ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                    </tr>
                    <tr>
                      <td>Máy lạnh: {room.amenities.mayLanh ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td>Giếng trời: {room.amenities.giengTroi ? <span className="amenity-check">✓</span> : <span className="amenity-cross">✗</span>}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default RoomSale;
