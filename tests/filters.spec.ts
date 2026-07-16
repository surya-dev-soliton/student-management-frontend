import { test, expect } from '@playwright/test';

test.describe('Student Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all filter controls', async ({ page }) => {
    await expect(page.locator('#nameOperator')).toBeVisible();

    await expect(page.locator('#studentName')).toBeVisible();

    await expect(page.locator('#departmentOperator')).toBeVisible();

    await expect(page.locator('#department')).toBeVisible();

    await expect(page.locator('#enrolmentOperator')).toBeVisible();

    await expect(page.locator('#enrolmentDate')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Apply Filters' })).toBeVisible();

    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();

    await expect(page.locator('nimble-select').last()).toBeVisible();
  });

  test('should allow entering filter values', async ({ page }) => {
    await page.locator('#studentName').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'John');

    await expect(page.locator('#studentName')).toHaveAttribute('current-value', 'John');

    await page.locator('#department').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'Computer Science');

    await expect(page.locator('#department')).toHaveAttribute('current-value', 'Computer Science');
  });

  test('should allow changing filter operators', async ({ page }) => {
    await page.locator('#nameOperator').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'notEquals');

    await expect(page.locator('#nameOperator')).toHaveAttribute('current-value', 'notEquals');

    await page.locator('#departmentOperator').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'notEquals');

    await expect(page.locator('#departmentOperator')).toHaveAttribute('current-value', 'notEquals');

    await page.locator('#enrolmentOperator').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'before');

    await expect(page.locator('#enrolmentOperator')).toHaveAttribute('current-value', 'before');
  });

  test('should allow selecting enrolment date', async ({ page }) => {
    const dateInput = page.locator('#enrolmentDate');

    await dateInput.fill('2024-01-01');

    await expect(dateInput).toHaveValue('2024-01-01');
  });

  test('should clear all filter values', async ({ page }) => {
    await page.locator('#studentName').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'John');

    await page.locator('#department').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'IT');

    await page.locator('#enrolmentDate').fill('2024-01-01');

    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(page.locator('#studentName')).toHaveAttribute('current-value', '');

    await expect(page.locator('#department')).toHaveAttribute('current-value', '');

    await expect(page.locator('#enrolmentDate')).toHaveValue('');
  });

  test('should send name filter to the API', async ({ page }) => {

    const requestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/students') &&
        request.method() === 'GET' &&
        request.url().includes('name=John'),
    );

    await page.locator('#studentName').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'John');
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

    await page.locator('#studentName').evaluate((element, value) => {
      const customElement = element as HTMLElement & { value: string };
      customElement.value = value;
      customElement.dispatchEvent(new Event('input', { bubbles: true }));
      customElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'John');

    await page.getByRole('button', { name: 'Apply Filters' }).click();

    await expect(page.locator('nimble-table')).toContainText('John');

    await expect(page.locator('nimble-table')).toContainText('CSE');

    await expect(page.locator('nimble-table')).toContainText('Cricket, Coding');
  });
});
