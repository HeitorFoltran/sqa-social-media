import { isPasswordValid } from "../utils/password";

test("isPasswordValid: senha forte deve retornar true", () => {
  expect(isPasswordValid("Senha@123")).toBe(true);
});

test("isPasswordValid: senha com exatamente 8 caracteres deve ser aceita (BUG)", () => {
  expect(isPasswordValid("Senha@12")).toBe(true);
});
