import { test, expect } from '@playwright/test';

test.describe('Filter testcases', () => {
  test('should display all filter controls', async ({ page }) => {
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByPlaceholder('Student Name')).toBeVisible();

    await expect(page.getByText('Department')).toBeVisible();
    await expect(page.getByPlaceholder('Department')).toBeVisible();

    await expect(page.getByText('Enrolment Date')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Apply Filters' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();

    await expect(page.getByText('Auto Refresh')).toBeVisible();
  });

  test('should allow entering filter values', async ({ page }) => {
    await page.getByPlaceholder('Student Name').fill('John');

    await expect(page.getByPlaceholder('Student Name')).toHaveValue('John');

    await page.getByPlaceholder('Department').fill('Computer Science');

    await expect(page.getByPlaceholder('Department')).toHaveValue('Computer Science');
  });

  test('should allow changing filter operators', async ({ page }) => {
    const selects = page.locator('select');

    await selects.nth(0).selectOption('notEquals');

    await expect(selects.nth(0)).toHaveValue('notEquals');

    await selects.nth(1).selectOption('notEquals');

    await expect(selects.nth(1)).toHaveValue('notEquals');
  });
});
