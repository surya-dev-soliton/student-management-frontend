import { test, expect } from '@playwright/test';

test.describe('Student Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all filter controls', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'Name Operator' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Student Name' })).toBeVisible();

    await expect(page.getByRole('combobox', { name: 'Department Operator' })).toBeVisible();

    await expect(page.getByRole('textbox', { name: 'Department' })).toBeVisible();

    await expect(page.getByRole('combobox', { name: 'Enrolment Date Operator' })).toBeVisible();

    await expect(page.locator('#enrolmentDate')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Apply Filters' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Clear Filters' })).toBeVisible();

    await expect(page.getByRole('combobox', { name: 'Auto Refresh' })).toBeVisible();
  });

  test('should allow entering filter values', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Student Name' }).fill('John');

    await expect(page.getByRole('textbox', { name: 'Student Name' })).toHaveValue('John');

    await page.getByRole('textbox', { name: 'Department' }).fill('Computer Science');

    await expect(page.getByRole('textbox', { name: 'Department' })).toHaveValue('Computer Science');
  });

  test('should allow changing filter operators', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Name Operator' }).selectOption('notEquals');

    await expect(page.getByRole('combobox', { name: 'Name Operator' })).toHaveValue('notEquals');

    await page.getByRole('combobox', { name: 'Department Operator' }).selectOption('notEquals');

    await expect(page.getByRole('combobox', { name: 'Department Operator' })).toHaveValue(
      'notEquals',
    );

    await page.getByRole('combobox', { name: 'Enrolment Date Operator' }).selectOption('before');

    await expect(page.getByRole('combobox', { name: 'Enrolment Date Operator' })).toHaveValue(
      'before',
    );
  });

  test('should allow selecting enrolment date', async ({ page }) => {
    const dateInput = page.locator('#enrolmentDate');

    await dateInput.fill('2024-01-01');

    await expect(dateInput).toHaveValue('2024-01-01');
  });

  test('should clear all filter values', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Student Name' }).fill('John');

    await page.getByRole('textbox', { name: 'Department' }).fill('IT');

    await page.locator('#enrolmentDate').fill('2024-01-01');

    await page.getByRole('button', { name: 'Clear Filters' }).click();

    await expect(page.getByRole('textbox', { name: 'Student Name' })).toHaveValue('');

    await expect(page.getByRole('textbox', { name: 'Department' })).toHaveValue('');

    await expect(page.locator('#enrolmentDate')).toHaveValue('');
  });

  test('should send name filter to the API', async ({ page }) => {
    await page.goto('/');

    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/students') &&
        request.method() === 'GET' &&
        request.url().includes('name=John'),
    );

    await page.getByRole('textbox', { name: 'Student Name' }).fill('John');
    await page.getByRole('button', { name: 'Apply Filters' }).click();

    const request = await requestPromise;

    expect(request.url()).toContain('name=John');
    expect(request.url()).toContain('nameOperator=equals');
  });

  test('should filter students by name', async ({ page }) => {
    await page.route('**/students**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'John',
            department: 'CSE',
            enrolmentDate: '2022-01-01',
          },
        ]),
      });
    });

    await page.route('**/interests**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            studentId: '1',
            interests: ['Cricket', 'Coding'],
          },
        ]),
      });
    });

    await page.goto('/');

    await page.getByRole('textbox', { name: 'Student Name' }).fill('John');

    await page.getByRole('button', { name: 'Apply Filters' }).click();

    await expect(page.locator('nimble-table')).toContainText('John');

    await expect(page.locator('nimble-table')).toContainText('CSE');

    await expect(page.locator('nimble-table')).toContainText('Cricket, Coding');
  });
});
