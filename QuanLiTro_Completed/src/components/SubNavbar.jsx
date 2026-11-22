import { GearIcon } from './Icons';

function SubNavbar({ onNavigate }) {
  return (
    <nav className="subnavbar">
      <div className="chuc-nang-dropdown">
        <button className="chuc-nang-btn">
          <GearIcon />
          Chức năng
        </button>
        <ul className="dropdown-menu-list">
          <li
            className="dropdown-menu-item"
            onClick={() => onNavigate('room-sale')}
          >
            Bán phòng
          </li>
          <li
            className="dropdown-menu-item"
            onClick={() => onNavigate('guest-visit')}
          >
            Khách xem phòng
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default SubNavbar;
