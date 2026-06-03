/**
 * TESTES UNITÁRIOS - Funções Puras (Jest puro, sem renderização)
 *
 * Cobre: isEmailValid(), isPasswordValid(), getPasswordValidationMessage()
 *
 * BUGS ENCONTRADOS:
 *  - isPasswordValid() usa "password.length <= 8" em vez de "< 8",
 *    ou seja, uma senha com exatamente 8 caracteres é REJEITADA,
 *    mas o requisito diz "mínimo 8 caracteres" (8 deve ser aceito).
 */
 
import { isEmailValid, getEmailValidationMessage } from "../utils/email";
import { isPasswordValid, getPasswordValidationMessage } from "../utils/password";
 
// ---------------------------------------------------------------
// TESTES DE SUCESSO (devem PASSAR)
// ---------------------------------------------------------------
 
describe("isEmailValid", () => {
  test("e-mail válido deve retornar true", () => {
    expect(isEmailValid("usuario@email.com")).toBe(true);
  });
 
  test("e-mail sem @ deve retornar false", () => {
    expect(isEmailValid("usuarioemail.com")).toBe(false);
  });
 
  test("string vazia deve retornar false", () => {
    expect(isEmailValid("")).toBe(false);
  });
 
  test("getEmailValidationMessage com e-mail válido deve retornar string vazia", () => {
    expect(getEmailValidationMessage("valido@teste.com")).toBe("");
  });
});
 
describe("isPasswordValid", () => {
  test("senha forte válida deve retornar true", () => {
    // 9 caracteres, maiúscula, minúscula, número, especial
    expect(isPasswordValid("Senha@123")).toBe(true);
  });
 
  test("senha sem maiúscula deve retornar false", () => {
    expect(isPasswordValid("senha@123")).toBe(false);
  });
 
  test("getPasswordValidationMessage com senha válida deve retornar string vazia", () => {
    expect(getPasswordValidationMessage("Senha@123")).toBe("");
  });
});
 
// ---------------------------------------------------------------
// TESTE DE BUG (deve FALHAR — provando o bug)
// ---------------------------------------------------------------
 
describe("isPasswordValid - BUG: mínimo de 8 caracteres", () => {
  /**
   * BUG: O requisito diz "mínimo 8 caracteres", então uma senha com
   * exatamente 8 caracteres deve ser ACEITA. Porém a implementação usa
   * "password.length <= 8" (deveria ser "< 8"), rejeitando senhas de
   * exatamente 8 caracteres.
   *
   * Este teste FALHA para provar o bug.
   */
  test("senha com exatamente 8 caracteres válidos deve ser aceita (BUG)", () => {
    // 8 chars: 'S','e','n','h','a','@','1','2'
    expect(isPasswordValid("Senha@12")).toBe(true);
  });
});
