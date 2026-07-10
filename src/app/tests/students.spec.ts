import { test, expect } from '@playwright/test';

test.describe('Students Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the students page', async ({ page }) => {
    await expect(page.locator('app-root')).toBeVisible();
    await expect(page.locator('nimble-theme-provider')).toBeVisible();
  });

  test('should display the students table', async ({ page }) => {
    await expect(page.locator('app-students-table')).toBeVisible();
    await expect(page.locator('nimble-table')).toBeVisible();
  });

  test('should render the table headers', async ({ page }) => {
    await expect(page.locator('nimble-table-column-text[field-name="id"]')).toContainText('Id');
    await expect(page.locator('nimble-table-column-text[field-name="name"]')).toContainText('Name');
    await expect(page.locator('nimble-table-column-text[field-name="department"]')).toContainText(
      'Department',
    );
    await expect(
      page.locator('nimble-table-column-text[field-name="enrolmentDate"]'),
    ).toContainText('Enrolment Date');
    await expect(page.locator('nimble-table-column-text[field-name="status"]')).toContainText(
      'Status',
    );
    await expect(page.locator('nimble-table-column-text[field-name="interests"]')).toContainText(
      'Interests',
    );
  });
});
