import { isPasswordValid } from "../utils/password";

// SUCESSO: senha que atende todos os critérios deve ser aceita
test("isPasswordValid: senha forte deve retornar true", () => {
  expect(isPasswordValid("Senha@123")).toBe(true);
});

test("isPasswordValid: senha com exatamente 8 caracteres deve ser aceita (BUG)", () => {
  expect(isPasswordValid("Senha@12")).toBe(true);
});
