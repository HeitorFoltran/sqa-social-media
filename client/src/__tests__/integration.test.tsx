import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ isAuthenticated: false, login: jest.fn(), logout: jest.fn() }),
}));

jest.mock("../service/auth/auth", () => ({
  authService: { signIn: jest.fn() },
}));

import SignIn from "../app/signin/page";
import { saveUser, getUser } from "../lib/localStorage";

function getSubmitButton() {
  return screen
    .getAllByRole("button")
    .find((btn) => btn.getAttribute("type") === "submit")!;
}

test("SignIn: deve exibir erro ao submeter formulário vazio", async () => {
  render(<SignIn />);
  fireEvent.click(getSubmitButton());
  await waitFor(() => {
    expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
  });
});

test("localStorage: usuário salvo deve poder ser recuperado", () => {
  localStorage.clear();
  saveUser({ id: 1, email: "heitor@teste.com" });
  const recuperado = getUser();
  expect(recuperado).not.toBeNull();
  expect(recuperado?.email).toBe("heitor@teste.com");
});
