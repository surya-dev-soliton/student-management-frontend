import { test, expect } from '@playwright/test';

test.describe('Students Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the students page', async ({ page }) => {
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.locator('nimble-theme-provider')).toBeVisible();
    await expect(page.getByTestId('students-table')).toBeVisible();
  });

  test('should display the students table', async ({ page }) => {
    await expect(page.getByTestId('students-table')).toBeVisible();
  });

  test('should render all table headers', async ({ page }) => {
    await expect(page.locator('nimble-table-column-text[field-name="id"]')).toHaveText(/ID/i);

    await expect(page.locator('nimble-table-column-text[field-name="name"]')).toHaveText(/Name/i);

    await expect(page.locator('nimble-table-column-text[field-name="department"]')).toHaveText(
      /Department/i,
    );

    await expect(page.locator('nimble-table-column-text[field-name="enrolmentDate"]')).toHaveText(
      /Enrolment Date/i,
    );

    await expect(page.locator('nimble-table-column-text[field-name="status"]')).toHaveText(
      /Status/i,
    );

    await expect(page.locator('nimble-table-column-text[field-name="interests"]')).toHaveText(
      /Interests/i,
    );
  });
});
