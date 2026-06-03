import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false, logout: jest.fn() }),
}));

import Header from "../components/Header";
import PostCard from "../components/PostCard";

test("Header: deve exibir botões 'Entrar' e 'Criar Conta' para usuário deslogado", () => {
  render(<Header />);
  expect(screen.getByText(/entrar/i)).toBeInTheDocument();
  expect(screen.getByText(/criar conta/i)).toBeInTheDocument();
});

test("PostCard: deve exibir alert ao clicar em curtir sem estar autenticado", () => {
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  const post = { id: 1, title: "Título", body: "Corpo", liked: false };

  render(<PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />);
  fireEvent.click(screen.getByText(/curtir/i));

  expect(alertSpy).toHaveBeenCalledWith(
    "Você precisa estar autenticado para curtir posts!"
  );
  alertSpy.mockRestore();
});
