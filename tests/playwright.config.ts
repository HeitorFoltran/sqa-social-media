import { defineConfig, devices } from "@playwright/test";

/**
 * Configuração do Playwright para a Atividade 5.
 *
 * O sistema sob teste (SUT) precisa estar em execução ANTES de rodar os testes:
 *   - API     (Spring Boot)  -> http://localhost:8080
 *   - Cliente (Next.js)      -> http://localhost:3000
 *
 * As URLs podem ser sobrescritas por variáveis de ambiente (ver .env.example),
 * o que é útil para rodar contra outro host/porta ou em uma pipeline de CI.
 *
 * Dividimos a suíte em DOIS "projects" do Playwright:
 *   - "api": testes de caixa-preta que batem direto nos endpoints HTTP.
 *            Usam apenas a fixture `request` (APIRequestContext), portanto NÃO
 *            precisam de navegador instalado.
 *   - "e2e": testes ponta a ponta que sobem um Chromium real e simulam o
 *            usuário navegando pela interface.
 */

const API_URL = process.env.API_URL ?? "http://localhost:8080";
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  // Falha o build se alguém esquecer um test.only em commit
  forbidOnly: !!process.env.CI,
  // Sem retentativas locais: queremos enxergar a flakiness; 2 retries em CI.
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    // Coleta trace/screenshot apenas quando algo falha (facilita a análise).
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "api",
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL: API_URL,
      },
    },
    {
      name: "e2e",
      testMatch: /.*\.e2e\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: CLIENT_URL,
      },
    },
  ],

  /**
   * (Opcional) Em vez de subir api/client manualmente, é possível deixar o
   * próprio Playwright iniciar o cliente. Deixei comentado de propósito porque
   * a API depende de banco (MySQL/H2) e da DummyJSON, então prefiro subir o
   * ambiente à mão e manter o controle. Para habilitar, descomente:
   *
   * webServer: {
   *   command: "npm --prefix ../client run dev",
   *   url: CLIENT_URL,
   *   reuseExistingServer: !process.env.CI,
   *   timeout: 120_000,
   * },
   */
});
