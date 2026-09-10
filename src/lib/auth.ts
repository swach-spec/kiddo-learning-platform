export type KiddoAccount = {
  id: string;
  familyName: string;
  email: string;
  pin: string;
  createdAt: string;
};

const ACCOUNT_KEY = "kiddo-account";
const SESSION_KEY = "kiddo-session";

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string): T | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function write<T>(key: string, value: T) {
  if (isBrowser()) window.localStorage.setItem(key, JSON.stringify(value));
}

export function getAccount(): KiddoAccount | null {
  return read<KiddoAccount>(ACCOUNT_KEY);
}

export function createAccount(familyName: string, email: string, pin: string): KiddoAccount {
  const account: KiddoAccount = {
    id: `account-${Date.now()}`,
    familyName: familyName.trim(),
    email: email.trim().toLowerCase(),
    pin,
    createdAt: new Date().toISOString(),
  };

  write(ACCOUNT_KEY, account);
  write(SESSION_KEY, { accountId: account.id });
  return account;
}

export function login(email: string, pin: string): boolean {
  const account = getAccount();
  if (!account) return false;

  const valid = account.email === email.trim().toLowerCase() && account.pin === pin;
  if (valid) write(SESSION_KEY, { accountId: account.id });
  return valid;
}

export function isLoggedIn(): boolean {
  const account = getAccount();
  const session = read<{ accountId: string }>(SESSION_KEY);
  return Boolean(account && session?.accountId === account.id);
}

export function logout() {
  if (isBrowser()) {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem("kiddo-current-player");
  }
}
