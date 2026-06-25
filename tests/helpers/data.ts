export function emailUnq(prefix = "qa"): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}@example.com`;
}

export const SENHA_VLD = "Senha@123";
