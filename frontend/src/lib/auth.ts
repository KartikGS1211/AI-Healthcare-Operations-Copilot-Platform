export const AUTH_STORAGE_KEY = "healthcare-auth";

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  department: string;
  initials: string;
}

export const DEMO_CREDENTIALS = {
  email: "priya.sharma@hospital.org",
  password: "password123",
};

export const DEMO_USER: AuthUser = {
  name: "Dr. Priya Sharma",
  email: "priya.sharma@hospital.org",
  role: "Admin",
  department: "Cardiology",
  initials: "PS",
};

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function validateCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  );
}
