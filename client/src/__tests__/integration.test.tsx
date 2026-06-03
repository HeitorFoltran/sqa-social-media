/**
 * TESTES DE INTEGRAÇÃO - Fluxos de tela (Jest + Testing Library)
 *
 * Cobre:
 *  1. Fluxo da tela de Login (SignIn) — validação de formulário + mensagem de erro da API
 *  2. Persistência de sessão — o bug de chave inconsistente no localStorage
 *
 * BUGS ENCONTRADOS:
 *  - localStorage.ts: saveUser() grava com a chave literal "user", mas
 *    getUser() lê com a constante USER_KEY = "sqa_social_user".
 *    Resultado: após fazer login, ao recarregar a página o usuário perde
 *    a sessão (sempre aparece como deslogado).
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mocks ───────────────────────────────────────────────────────────────────
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

// Mock do serviço de autenticação para simular a API
jest.mock("../service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

import SignIn from "../app/signin/page";
import { authService } from "../service/auth/auth";
import { saveUser, getUser } from "../lib/localStorage";
import type { AxiosResponse } from "axios";

const mockAuthService = authService as jest.Mocked<typeof authService>;

// Helper: encontra o botão de submit dentro do formulário
function getSubmitButton() {
  return screen
    .getAllByRole("button")
    .find((btn) => btn.getAttribute("type") === "submit")!;
}

// ============================================================================
// Integração 1: Fluxo de Login
// ============================================================================
describe("Integração - Tela de Login", () => {

  test("deve exibir erro de campo obrigatório se submeter sem preencher", async () => {
    render(<SignIn />);
    fireEvent.click(getSubmitButton());
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

  test("deve exibir mensagem 'Credenciais inválidas' quando a API retornar 401", async () => {
    const { AxiosError } = jest.requireActual("axios");
    const error = new AxiosError(
      "Unauthorized",
      "401",
      undefined,
      undefined,
      { data: { message: "Credenciais inválidas" }, status: 401 } as AxiosResponse
    );
    mockAuthService.signIn.mockRejectedValueOnce(error);

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText(/seu@email\.com/i), {
      target: { value: "usuario@teste.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "qualquersenha" },
    });
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Integração 2: Persistência de sessão — BUG do localStorage
// ============================================================================
describe("Integração - Persistência de sessão no localStorage (BUG)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * Testa o comportamento CORRETO esperado: salvar e recuperar o usuário
   * devem usar a mesma chave.
   *
   * BUG: saveUser() usa a chave "user" mas getUser() lê "sqa_social_user".
   * Portanto, getUser() sempre retorna null após saveUser(), quebrando
   * a persistência de sessão entre recarregamentos de página.
   *
   * Este teste FALHA para provar o bug.
   */
  test("usuário salvo deve ser recuperado pelo getUser (BUG)", () => {
    const usuario = { id: 1, email: "heitor@teste.com" };

    saveUser(usuario);

    // Após salvar, deve conseguir recuperar — mas o bug impede isso
    const recuperado = getUser();

    expect(recuperado).not.toBeNull();
    expect(recuperado?.email).toBe("heitor@teste.com");
  });

  test("getUser deve retornar null quando localStorage está vazio", () => {
    expect(getUser()).toBeNull();
  });
});