import { test, expect } from "@playwright/test";

const routes = [
  { path: "/login", name: "Authentication Portal" },
  { path: "/dashboard", name: "Tactical Dashboard" },
  { path: "/users", name: "Personnel Registry" },
  { path: "/products", name: "Ordnance Inventory" },
  { path: "/orders", name: "Dispatch Manifests" },
];

for (const { path, name } of routes) {
  test(`[${name}] ${path} has zero horizontal overflow`, async ({ page }, testInfo) => {
    await page.goto(path);
    await page.waitForLoadState("domcontentloaded");

    const dimensions = await page.evaluate(() => ({
      innerWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));

    // Zero horizontal overflow rule
    expect(
      dimensions.docScrollWidth,
      `Horizontal overflow detected on ${path}: docScrollWidth (${dimensions.docScrollWidth}px) exceeds innerWidth (${dimensions.innerWidth}px)`
    ).toBeLessThanOrEqual(dimensions.innerWidth);

    expect(
      dimensions.bodyScrollWidth,
      `Body overflow detected on ${path}: bodyScrollWidth (${dimensions.bodyScrollWidth}px) exceeds innerWidth (${dimensions.innerWidth}px)`
    ).toBeLessThanOrEqual(dimensions.innerWidth);

    // On mobile devices, verify form inputs do not trigger iOS Safari canvas auto-zoom
    if (testInfo.project.name.includes("Mobile")) {
      const inputFontSizes = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll("input, select, textarea"));
        return inputs.map((input) => parseFloat(window.getComputedStyle(input).fontSize));
      });

      for (const size of inputFontSizes) {
        if (!isNaN(size)) {
          expect(
            size,
            `Mobile form input font size ${size}px is smaller than 16px (triggers iOS Safari auto-zoom)`
          ).toBeGreaterThanOrEqual(16);
        }
      }
    }
  });
}
