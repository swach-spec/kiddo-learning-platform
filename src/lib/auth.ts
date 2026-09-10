export type KiddoAccount = {
  id: string;
  familyName: string;
  email: string;
  pin: string;
  createdAt: string;
};

const ACCOUNTS_KEY = "kiddo-accounts";
const LEGACY_ACCOUNT_KEY = "kiddo-account";
const SESSION_KEY = "kiddo-session";

export const DEMO_ACCOUNT_ID = "account-kiddo-demo";
export const DEMO_ACCOUNT: KiddoAccount = {
  id: DEMO_ACCOUNT_ID,
  familyName: "KIDDO Demo Family",
  email: "demo@kiddo.local",
  pin: "1234",
  createdAt: "2026-01-01T00:00:00.000Z",
};

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

function getAccounts(): KiddoAccount[] {
  const stored = read<KiddoAccount[]>(ACCOUNTS_KEY);
  if (stored?.length) return stored;

  const legacy = read<KiddoAccount>(LEGACY_ACCOUNT_KEY);
  const accounts = legacy ? [legacy, DEMO_ACCOUNT] : [DEMO_ACCOUNT];
  write(ACCOUNTS_KEY, accounts);
  return accounts;
}

export function getAccount(): KiddoAccount | null {
  const session = read<{ accountId: string }>(SESSION_KEY);
  if (!session?.accountId) return null;
  return getAccounts().find((account) => account.id === session.accountId) ?? null;
}

export function createAccount(familyName: string, email: string, pin: string): KiddoAccount | null {
  const accounts = getAccounts();
  const normalizedEmail = email.trim().toLowerCase();

  if (accounts.some((account) => account.email === normalizedEmail)) return null;

  const account: KiddoAccount = {
    id: `account-${Date.now()}`,
    familyName: familyName.trim(),
    email: normalizedEmail,
    pin,
    createdAt: new Date().toISOString(),
  };

  write(ACCOUNTS_KEY, [...accounts, account]);
  write(SESSION_KEY, { accountId: account.id });
  return account;
}

export function login(email: string, pin: string): boolean {
  const account = getAccounts().find(
    (candidate) =>
      candidate.email === email.trim().toLowerCase() && candidate.pin === pin,
  );

  if (!account) return false;
  write(SESSION_KEY, { accountId: account.id });
  return true;
}

export function isLoggedIn(): boolean {
  return Boolean(getAccount());
}

export function logout() {
  if (isBrowser()) {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem("kiddo-current-player");
  }
}
