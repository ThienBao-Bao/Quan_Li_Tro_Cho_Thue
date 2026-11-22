import { describe, it, expect, beforeEach } from 'vitest';
import { authenticate, LOGIN_MESSAGES, resetFailedAttempts } from './auth';
import { mockUsers } from '../data/users';

// Reset lockout state before every test so tests are isolated
beforeEach(() => {
  resetFailedAttempts();
});

describe('authenticate() - login credential validation', () => {
  it('UT-AUTH-01: valid staff account (first user) logs in', () => {
    const r = authenticate('0987555001', 'matkhau1', mockUsers);
    expect(r).toEqual({ success: true, role: 'staff', page: 'room-sale', error: null });
  });

  it('UT-AUTH-02: BVA - valid staff account (last user #100) logs in', () => {
    const r = authenticate('0987555100', 'matkhau100', mockUsers);
    expect(r.success).toBe(true);
    expect(r.role).toBe('staff');
  });

  it('UT-AUTH-03: admin wildcard account logs in as admin', () => {
    const r = authenticate('admin', 'admin123', mockUsers);
    expect(r).toEqual({ success: true, role: 'admin', page: 'room-sale', error: null });
  });

  it('UT-AUTH-04: correct phone but wrong password is rejected', () => {
    const r = authenticate('0987555001', 'wrongpass', mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.WRONG);
  });

  it('UT-AUTH-05: unknown phone number is rejected', () => {
    const r = authenticate('0000000000', 'matkhau1', mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.WRONG);
  });

  it('UT-AUTH-06: empty username is rejected with the "empty" message', () => {
    const r = authenticate('', 'matkhau1', mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.EMPTY);
  });

  it('UT-AUTH-07: empty password is rejected with the "empty" message', () => {
    const r = authenticate('0987555001', '', mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.EMPTY);
  });

  it('UT-AUTH-08: both fields empty is rejected with the "empty" message', () => {
    const r = authenticate('', '', mockUsers);
    expect(r.error).toBe(LOGIN_MESSAGES.EMPTY);
  });

  it('UT-AUTH-09: whitespace around valid credentials is trimmed then accepted', () => {
    const r = authenticate('  0987555001  ', '  matkhau1  ', mockUsers);
    expect(r.success).toBe(true);
  });

  it('UT-AUTH-10: whitespace-only username counts as empty', () => {
    const r = authenticate('    ', 'matkhau1', mockUsers);
    expect(r.error).toBe(LOGIN_MESSAGES.EMPTY);
  });

  it('UT-AUTH-11: admin with wrong password is rejected', () => {
    const r = authenticate('admin', 'admin', mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.WRONG);
  });

  it('UT-AUTH-12: password check is case-sensitive', () => {
    const r = authenticate('0987555001', 'MATKHAU1', mockUsers);
    expect(r.success).toBe(false);
  });

  it('UT-AUTH-13: null inputs are treated as empty (no crash)', () => {
    const r = authenticate(null, null, mockUsers);
    expect(r.error).toBe(LOGIN_MESSAGES.EMPTY);
  });
});

// ---------------------------------------------------------------------------
// TC-AUTH-03 & TC-AUTH-04 – từ test plan (FR-02 Authentication)
// ---------------------------------------------------------------------------

describe('TC-AUTH-03: Login with correct credentials', () => {
  it('TC-AUTH-03-A: staff logs in with correct phone & password → success + staff role', () => {
    // Số điện thoại: 0987555001, mật khẩu: matkhau1 (theo test plan)
    const r = authenticate('0987555001', 'matkhau1', mockUsers);
    expect(r.success).toBe(true);
    expect(r.role).toBe('staff');
    expect(r.page).toBe('room-sale');
    expect(r.error).toBeNull();
  });

  it('TC-AUTH-03-B: admin logs in with correct credentials → success + admin role', () => {
    const r = authenticate('admin', 'admin123', mockUsers);
    expect(r.success).toBe(true);
    expect(r.role).toBe('admin');
    expect(r.page).toBe('room-sale');
    expect(r.error).toBeNull();
  });
});

describe('TC-AUTH-04: Account lockout after 5 failed attempts', () => {
  const PHONE = '0987555001';
  const WRONG_PASS = 'wrongpassword';
  const RIGHT_PASS = 'matkhau1';

  it('TC-AUTH-04-A: first 4 wrong attempts → still rejected with WRONG (not yet locked)', () => {
    for (let i = 1; i <= 4; i++) {
      const r = authenticate(PHONE, WRONG_PASS, mockUsers);
      expect(r.success).toBe(false);
      expect(r.error).toBe(LOGIN_MESSAGES.WRONG);
    }
  });

  it('TC-AUTH-04-B: 5th wrong attempt triggers lockout, 6th attempt → LOCKED message', () => {
    // Attempt 1–5: wrong password
    for (let i = 1; i <= 5; i++) {
      authenticate(PHONE, WRONG_PASS, mockUsers);
    }
    // 6th attempt: account is now locked
    const r = authenticate(PHONE, RIGHT_PASS, mockUsers);
    expect(r.success).toBe(false);
    expect(r.error).toBe(LOGIN_MESSAGES.LOCKED);
  });

  it('TC-AUTH-04-C: after lockout expires (15 min), correct credentials succeed again', () => {
    const t0 = Date.now();

    // Trigger lockout (5 failed attempts) at time t0
    for (let i = 1; i <= 5; i++) {
      authenticate(PHONE, WRONG_PASS, mockUsers, t0);
    }

    // Immediately after lockout → still locked
    const locked = authenticate(PHONE, RIGHT_PASS, mockUsers, t0 + 1000);
    expect(locked.error).toBe(LOGIN_MESSAGES.LOCKED);

    // 15 minutes + 1 second later → lockout expired → login succeeds
    const afterExpiry = authenticate(PHONE, RIGHT_PASS, mockUsers, t0 + 15 * 60 * 1000 + 1000);
    expect(afterExpiry.success).toBe(true);
    expect(afterExpiry.role).toBe('staff');
  });

  it('TC-AUTH-04-D: failed attempts counter resets after successful login', () => {
    const t0 = Date.now();

    // 4 failed attempts
    for (let i = 1; i <= 4; i++) {
      authenticate(PHONE, WRONG_PASS, mockUsers, t0);
    }
    // Successful login → counter resets
    const ok = authenticate(PHONE, RIGHT_PASS, mockUsers, t0);
    expect(ok.success).toBe(true);

    // 5 more wrong attempts should re-lock (not carry over the previous 4)
    for (let i = 1; i <= 5; i++) {
      authenticate(PHONE, WRONG_PASS, mockUsers, t0);
    }
    const locked = authenticate(PHONE, RIGHT_PASS, mockUsers, t0);
    expect(locked.error).toBe(LOGIN_MESSAGES.LOCKED);
  });
});
