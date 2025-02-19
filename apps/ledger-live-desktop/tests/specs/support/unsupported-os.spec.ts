import test from "../../fixtures/common";
import { expect } from "@playwright/test";
import { Layout } from "../../models/Layout";

test.use({ userdata: "skip-onboarding" });

test.use({
  env: {
    MOCK_OS_VERSION: "Windows_NT@6.1.7601",
  },
});

test("Unsupported OS", async ({ page }) => {
  const layout = new Layout(page);
  await test.step("displays the error page", async () => {
    await layout.renderError.waitFor({ state: "visible" });
    await expect(layout.renderError).toBeVisible();
    await expect(await layout.page.screenshot()).toMatchSnapshot("error-os-unsupported.png");
  });
});
