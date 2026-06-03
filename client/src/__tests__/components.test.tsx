/**
 * TESTES UNITÁRIOS - Componentes React (Jest + Testing Library)
 *
 * Cobre: Header (usuário logado e deslogado) e PostCard (curtir).
 *
 * BUGS ENCONTRADOS:
 *  - localStorage.ts: saveUser() salva com a chave "user" mas getUser() lê
 *    com a chave "sqa_social_user" → usuário nunca é encontrado após salvar.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ── Mocks globais necessários para componentes Next.js ──────────────────────
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// ── Importações dos componentes ─────────────────────────────────────────────
import Header from "../components/Header";
import PostCard from "../components/PostCard";

// ── Helper: mock do AuthContext ──────────────────────────────────────────────
const mockUseAuth = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// ============================================================================
// Header
// ============================================================================
describe("Header - usuário deslogado", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn() });
  });

  test("deve exibir botões 'Entrar' e 'Criar Conta'", () => {
    render(<Header />);
    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
  });

  test("deve exibir o título 'SQA Social Media'", () => {
    render(<Header />);
    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
  });
});

describe("Header - usuário logado", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });
  });

  test("deve exibir botões 'Posts Curtidos' e 'Sair'", () => {
    render(<Header />);
    expect(screen.getByText(/posts curtidos/i)).toBeInTheDocument();
    expect(screen.getByText(/sair/i)).toBeInTheDocument();
  });
});

// ============================================================================
// PostCard
// ============================================================================
describe("PostCard - usuário deslogado", () => {
  const mockPost = { id: 1, title: "Post Teste", body: "Corpo do post", liked: false };

  test("deve exibir título e corpo do post", () => {
    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={jest.fn()} />
    );
    expect(screen.getByText("Post Teste")).toBeInTheDocument();
    expect(screen.getByText("Corpo do post")).toBeInTheDocument();
  });

  test("ao clicar em curtir sem autenticação deve exibir alert", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <PostCard post={mockPost} isAuthenticated={false} onLike={jest.fn()} />
    );
    fireEvent.click(screen.getByText(/curtir/i));
    expect(alertSpy).toHaveBeenCalledWith(
      "Você precisa estar autenticado para curtir posts!"
    );
    alertSpy.mockRestore();
  });
});