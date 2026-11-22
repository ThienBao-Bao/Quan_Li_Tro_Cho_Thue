function Login({ username, password, loginError, setUsername, setPassword, onSubmit }) {
  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <h2 className="login-title">ĐĂNG NHẬP</h2>
        <form onSubmit={onSubmit}>
          <div className="login-form-group">
            <input
              type="text"
              className="login-input"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              className="login-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {loginError && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0' }}>
              {loginError}
            </p>
          )}
          <button type="submit" className="login-submit-btn">Đăng nhập</button>
        </form>
        <a href="tel:0372177238" className="login-support-link">Hỗ trợ: 0372177238 - Zalo: Bảo Bảo</a>
      </div>
    </div>
  );
}

export default Login;
