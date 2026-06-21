import { test, expect } from '@playwright/test';

test.describe('Wiley Home Dashboard E2E', () => {
  test('should load page and connect to Home Assistant', async ({ page }) => {
    // Navigate to local dev server
    await page.goto('/');

    // Since it connects to HA, it should eventually render the welcome header
    const title = page.locator('text=Wiley Home');
    await expect(title).toBeVisible({ timeout: 15000 });

    // Confirm that the digital clock is visible
    const clock = page.locator('text=AM');
    const clockPM = page.locator('text=PM');
    // It should contain either AM or PM
    const isClockVisible = (await clock.isVisible()) || (await clockPM.isVisible());
    expect(isClockVisible).toBe(true);
  });

  test('should support edit mode toggling and widget customization', async ({ page }) => {
    await page.goto('/');

    // Wait for initial connection
    await expect(page.locator('text=Wiley Home')).toBeVisible({ timeout: 15000 });

    // Click the edit dashboard button
    const editBtn = page.getByTitle('Edit Dashboard');
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Verify Edit Mode toolbar is displayed
    await expect(page.locator('text=Edit Mode')).toBeVisible();

    // Verify Add Widget button is displayed
    const addWidgetBtn = page.getByRole('button', { name: /Add Widget/i });
    await expect(addWidgetBtn).toBeVisible();

    // Click Add Widget to open modal
    await addWidgetBtn.click();

    // Verify Entity Selector Modal is open
    await expect(page.getByRole('heading', { name: 'Add Widget' })).toBeVisible();

    // Close the modal
    const closeBtn = page.getByRole('button', { name: 'Close' });
    await closeBtn.click();

    // Verify modal is closed
    await expect(page.getByRole('heading', { name: 'Add Widget' })).not.toBeVisible();

    // Click Done to exit edit mode
    await page.getByRole('button', { name: /Done/i }).click();

    // Verify Edit Mode toolbar is gone
    await expect(page.locator('text=Edit Mode')).not.toBeVisible();
  });
});
