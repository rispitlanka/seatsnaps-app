export type AuthUser = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  logo?: { url: string } | null;
  isAdmin?: boolean;
  roles?: string[];
  organizationRoles?: unknown[];
  permissions?: string[];
  activeOrganizationId?: string | null;
  organizations?: unknown[];
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: AuthUser;
};

export type MessageResponse = {
  message: string;
};

export type SignupPayload = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
};

export type StoredSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};
