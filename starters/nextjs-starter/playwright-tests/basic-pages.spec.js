import { expect, test } from "@playwright/test";

// This assumes that the first article to appear in the list will have an author.
test("basic navigation", async ({ page }) => {
  await page.goto("http://localhost:3000");

  (await page.$("section .group button")).click();
  await page.waitForURL("**/articles/**", {
    waitUntil: "networkidle",
  });
  await page.getByTestId("author").click();
  await page.waitForURL("**/authors/**", {
    waitUntil: "networkidle",
  });

  await expect(await page.getByTestId("author-header")).toBeInViewport();
});
