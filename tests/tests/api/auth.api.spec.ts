import { test, expect } from "@playwright/test";
import { emailUnq, SENHA_VLD } from "../../helpers/data";

test.describe("API /auth", () => {
  test("POST /auth/signup com dados válidos retorna 200 e o usuário criado", async ({
    request,
  }) => {
    const email = emailUnq("signup_ok");

    const response = await request.post("/auth/signup", {
      data: { email, password: SENHA_VLD },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.email).toBe(email);
    expect(body.id).toBeTruthy();
  });

  test("POST /auth/signup com e-mail duplicado retorna 409", async ({
    request,
  }) => {
    const email = emailUnq("signup_dup");

    const first = await request.post("/auth/signup", {
      data: { email, password: SENHA_VLD },
    });
    expect(first.status()).toBe(200);

    const second = await request.post("/auth/signup", {
      data: { email, password: SENHA_VLD },
    });

    expect(second.status()).toBe(409);

    const body = await second.json();
    expect(body.message).toBe("E-mail já está em uso");
    expect(body.status).toBe(409);
  });

  test("POST /auth/signin com credenciais inválidas retorna 401", async ({
    request,
  }) => {
    const response = await request.post("/auth/signin", {
      data: { email: emailUnq("nao_existe"), password: SENHA_VLD },
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe("Credenciais inválidas");
  });

  test("POST /auth/signup com e-mail inválido retorna 422", async ({
    request,
  }) => {
    const response = await request.post("/auth/signup", {
      data: { email: "abubububuubububu", password: SENHA_VLD },
    });

    expect(response.status()).toBe(422);

    const body = await response.json();
    expect(body.message).toBe("E-mail inválido");
  });
});
