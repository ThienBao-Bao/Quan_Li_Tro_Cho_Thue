import { useState } from 'react';

import { validateGuestForm, buildGuestRecord } from '../logic/guestFactory';

const DEFAULT_HOUSE = '7 LÝ CHIÊU HOÀNG';
const DEFAULT_ROOM = 'P1201';
const DEFAULT_ADDRESS = 'Lý Chiêu Hoàng, Phường 10, Quận 6, Thành phố Hồ Chí Minh';
const DEFAULT_PRICE = '4,000,000';

function AddGuestModal({ isOpen, onClose, onSubmit, initialRoomData }) {
  const [house, setHouse] = useState(
    initialRoomData?.houseTitle || initialRoomData?.title || DEFAULT_HOUSE
  );
  const [room, setRoom] = useState(
    initialRoomData?.code ? `P${initialRoomData.code}` : DEFAULT_ROOM
  );
  const [address, setAddress] = useState(initialRoomData?.address || DEFAULT_ADDRESS);
  const [consultPrice, setConsultPrice] = useState(
    initialRoomData?.price ? initialRoomData.price.toLocaleString('en-US') : DEFAULT_PRICE
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [viewDateTime, setViewDateTime] = useState('21/07/2026 00:00');
  const [customerSource, setCustomerSource] = useState('');
  const [residentCount, setResidentCount] = useState('');
  const [vehicleCount, setVehicleCount] = useState('');
  const [expectedMoveIn, setExpectedMoveIn] = useState('');
  const [pets, setPets] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const { valid, error } = validateGuestForm(name, phone, viewDateTime);
    if (!valid) {
      alert(error);
      return;
    }

    const newGuest = buildGuestRecord(
      { house, room, name, phone, consultPrice, viewDateTime, source: customerSource, note },
      {
        id: Date.now(),
        updatedAt: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      }
    );

    onSubmit(newGuest);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">THÊM KHÁCH XEM PHÒNG</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form-grid">

              <div className="modal-form-group">
                <span className="modal-badge-label">Nhà</span>
                <input
                  type="text"
                  className="modal-input-control readonly-input"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Phòng</span>
                <input
                  type="text"
                  className="modal-input-control readonly-input"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>

              <div className="modal-form-group full-width">
                <span className="modal-badge-label">Địa chỉ nhà gửi khách hàng</span>
                <input
                  type="text"
                  className="modal-input-control readonly-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Họ tên khách hàng</span>
                <input
                  type="text"
                  className="modal-input-control"
                  placeholder="Nhập họ tên khách..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Số điện thoại</span>
                <input
                  type="text"
                  className="modal-input-control"
                  placeholder="Nhập số điện thoại..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Ngày giờ xem</span>
                <div className="input-with-clear">
                  <input
                    type="text"
                    className="modal-input-control"
                    value={viewDateTime}
                    onChange={(e) => setViewDateTime(e.target.value)}
                  />
                  {viewDateTime && (
                    <button
                      type="button"
                      className="btn-clear-date"
                      onClick={() => setViewDateTime('')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Giá tư vấn</span>
                <input
                  type="text"
                  className="modal-input-control price-input"
                  value={consultPrice}
                  onChange={(e) => setConsultPrice(e.target.value)}
                />
              </div>

              <div className="modal-form-group full-width">
                <span className="modal-badge-label">Nguồn khách hàng</span>
                <select
                  className="modal-input-control modal-select"
                  value={customerSource}
                  onChange={(e) => setCustomerSource(e.target.value)}
                >
                  <option value="">Chọn nguồn khách hàng</option>
                  <option value="fb">Facebook</option>
                  <option value="web">Website</option>
                  <option value="intro">Giới thiệu</option>
                  <option value="zalo">Zalo</option>
                  <option value="direct">Đến trực tiếp</option>
                </select>
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Số người ở</span>
                <input
                  type="text"
                  className="modal-input-control"
                  value={residentCount}
                  onChange={(e) => setResidentCount(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Số lượng xe</span>
                <input
                  type="text"
                  className="modal-input-control"
                  value={vehicleCount}
                  onChange={(e) => setVehicleCount(e.target.value)}
                />
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Thời gian dự kiến dọn vào</span>
                <select
                  className="modal-input-control modal-select"
                  value={expectedMoveIn}
                  onChange={(e) => setExpectedMoveIn(e.target.value)}
                >
                  <option value="">Chọn thời gian</option>
                  <option value="ngay">Dọn vào ngay</option>
                  <option value="7ngay">Trong 7 ngày</option>
                  <option value="15ngay">Trong 15 ngày</option>
                  <option value="1thang">Trong 1 tháng</option>
                </select>
              </div>

              <div className="modal-form-group">
                <span className="modal-badge-label">Nuôi thú cưng</span>
                <select
                  className="modal-input-control modal-select"
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                >
                  <option value="">Chọn dữ liệu</option>
                  <option value="khong">Không nuôi</option>
                  <option value="meo">Có (Mèo)</option>
                  <option value="cho">Có (Chó)</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              <div className="modal-form-group full-width">
                <span className="modal-badge-label">Ghi chú</span>
                <textarea
                  className="modal-textarea-control"
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-modal-submit">
              Chấp nhận
            </button>
            <button type="button" className="btn-modal-close" onClick={onClose}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddGuestModal;
