/** Password strength rules shared by sign-up and password screens (0–4). */
export function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export const strengthWords = ['Too short', 'Weak', 'Okay', 'Strong', 'Very strong'];
