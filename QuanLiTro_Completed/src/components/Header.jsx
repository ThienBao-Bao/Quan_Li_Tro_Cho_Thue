function Header({ isAuthenticated, isLoginPage, onLogin, onLogout, onBrowse }) {
  let label = 'Đăng nhập';
  let action = onLogin;
  if (isLoginPage) {
    label = '← Danh sách phòng';
    action = onBrowse;
  } else if (isAuthenticated) {
    label = 'Đăng xuất';
    action = onLogout;
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        nhatrovn<span>®</span>
      </div>
      <div className="navbar-logo-circle">
        NHATRO
        <span>VN</span>
      </div>
      <button type="button" className="navbar-auth-btn" onClick={action}>
        {label}
      </button>
    </header>
  );
}

export default Header;
