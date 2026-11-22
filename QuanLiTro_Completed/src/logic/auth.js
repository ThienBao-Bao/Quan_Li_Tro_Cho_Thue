export const LOGIN_MESSAGES = {
  EMPTY: 'Vui lòng nhập tên đăng nhập và mật khẩu!',
  WRONG: 'Số điện thoại hoặc mật khẩu không chính xác!',
  LOCKED: 'Tài khoản bị khóa tạm thời do nhập sai quá 5 lần. Vui lòng thử lại sau 15 phút!',
};

export const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store: key = username (phone/admin), value = { count, lockedUntil }
const failedAttempts = new Map();

/** Reset store — dùng trong test để cô lập các test case */
export function resetFailedAttempts() {
  failedAttempts.clear();
}

export function authenticate(username, password, users = [], now = Date.now()) {
  const cleanUsername = (username ?? '').trim();
  const cleanPassword = (password ?? '').trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, role: null, page: null, error: LOGIN_MESSAGES.EMPTY };
  }

  // Check lockout
  const record = failedAttempts.get(cleanUsername);
  if (record && record.lockedUntil && now < record.lockedUntil) {
    return { success: false, role: null, page: null, error: LOGIN_MESSAGES.LOCKED };
  }

  // Validate credentials
  const isAdmin =
    cleanUsername === ADMIN_CREDENTIALS.username &&
    cleanPassword === ADMIN_CREDENTIALS.password;

  const userFound =
    !isAdmin &&
    users.find(
      (user) => user.phone === cleanUsername && user.password === cleanPassword
    );

  if (isAdmin || userFound) {
    // Reset failed attempts on successful login
    failedAttempts.delete(cleanUsername);
    const role = isAdmin ? 'admin' : 'staff';
    return { success: true, role, page: 'room-sale', error: null };
  }

  // Increment failed attempts
  const current = failedAttempts.get(cleanUsername) ?? { count: 0, lockedUntil: null };
  current.count += 1;
  if (current.count >= MAX_FAILED_ATTEMPTS) {
    current.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  failedAttempts.set(cleanUsername, current);

  return { success: false, role: null, page: null, error: LOGIN_MESSAGES.WRONG };
}
