export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

export function messageFromStatus(
  status: number,
  fallback: string,
  context?: "login" | "signup" | "forgot" | "reset" | "profile" | "password" | "event",
): string {
  if (context === "login" && status === 401) {
    return "Email or password is incorrect.";
  }
  if (context === "login" && status === 403) {
    return "This account has been deactivated.";
  }
  if ((context === "signup" || context === "profile") && status === 409) {
    return "That email, username, or phone is already in use.";
  }
  if ((context === "forgot" || context === "reset") && status === 404) {
    return "No account found for that email.";
  }
  if (context === "reset" && status === 400) {
    return "That code is invalid or has expired.";
  }
  if (context === "password" && status === 400) {
    return "Current password is incorrect.";
  }
  if (context === "event" && status === 404) {
    return "This show could not be found.";
  }
  if (context === "event" && status === 403) {
    return "This show is not open to the public yet.";
  }
  if (status === 0) {
    return "Check your connection and try again.";
  }
  return fallback;
}

export function parseApiError(
  status: number,
  body: unknown,
  context?: "login" | "signup" | "forgot" | "reset" | "profile" | "password" | "event",
): ApiError {
  const payload = body as ApiErrorBody | undefined;
  const raw = payload?.message;
  const serverMessage = Array.isArray(raw) ? raw[0] : raw;
  const fallback = serverMessage || payload?.error || "Something went wrong. Try again.";
  return new ApiError(messageFromStatus(status, fallback, context), status);
}

export function toErrorMessage(error: unknown, fallback = "Something went wrong. Try again.") {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
