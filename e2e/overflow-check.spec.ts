import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Dashboard Card Overflow Inspector', () => {
  test('should detect layout overflow on all views and write report', async ({ page }) => {
    // Navigate to local dev server
    await page.goto('/');
    await expect(page.locator('text=Wiley Home')).toBeVisible({ timeout: 15000 });

    const views = [
      { id: 'home', label: 'Home' },
      { id: 'security', label: 'Security' },
      { id: 'climate', label: 'Climate' },
      { id: 'media', label: 'Media' },
      { id: 'cameras', label: 'Cameras' },
      { id: 'car', label: 'Car Status' },
      { id: 'server', label: 'Server Monitor' },
      { id: 'network', label: 'Network' },
    ];

    const overflowResults: Array<{
      view: string;
      cardId: string;
      cardType: string;
      title: string;
      clientHeight: number;
      scrollHeight: number;
      overflowY: number;
      clientWidth: number;
      scrollWidth: number;
      overflowX: number;
      isCutOff: boolean;
    }> = [];

    for (const view of views) {
      console.log(`Checking view: ${view.label}`);
      
      // Click the sidebar navigation item
      const navButton = page.locator(`aside button:has-text("${view.label}")`);
      if (await navButton.isVisible()) {
        await navButton.click();
        // Settle layout rendering
        await page.waitForTimeout(1000);
      } else {
        console.warn(`Navigation button for ${view.label} not found, skipping.`);
        continue;
      }

      // Find all grid item containers
      const gridItems = page.locator('.react-grid-item');
      const count = await gridItems.count();
      console.log(`Found ${count} grid items in view ${view.label}`);

      if (count > 0) {
        const firstItem = gridItems.first();
        const styles = await firstItem.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          const parentComputed = window.getComputedStyle(el.parentElement!);
          return {
            element: el.tagName,
            classes: el.className,
            inlineStyle: el.getAttribute('style'),
            computedHeight: computed.height,
            computedWidth: computed.width,
            computedPosition: computed.position,
            parentHeight: parentComputed.height,
            parentWidth: parentComputed.width,
          };
        });
        console.log('Grid Item Diagnostics:', styles);
      }

      for (let i = 0; i < count; i++) {
        const item = gridItems.nth(i);
        const cardId = (await item.getAttribute('key')) || `item-${i}`;
        
        // Find the inner card content element
        const cardContent = item.locator('> div > div');
        if (await cardContent.count() === 0) continue;

        const measurements = await cardContent.evaluate((el) => {
          const targetEl = el as HTMLElement;
          const cardRect = targetEl.getBoundingClientRect();
          
          // Find the maximum bottom and right coordinates among all child elements
          const children = Array.from(targetEl.querySelectorAll('*'));
          let maxBottom = cardRect.bottom;
          let maxRight = cardRect.right;
          
          for (const child of children) {
            const rect = child.getBoundingClientRect();
            // Only check elements that are visible and have size
            if (rect.height > 0 && rect.width > 0) {
              if (rect.bottom > maxBottom) {
                maxBottom = rect.bottom;
              }
              if (rect.right > maxRight) {
                maxRight = rect.right;
              }
            }
          }
          
          const computedScrollHeight = cardRect.height + (maxBottom - cardRect.bottom);
          const computedScrollWidth = cardRect.width + (maxRight - cardRect.right);
          
          return {
            clientHeight: cardRect.height,
            scrollHeight: Math.round(computedScrollHeight),
            clientWidth: cardRect.width,
            scrollWidth: Math.round(computedScrollWidth),
            title: targetEl.querySelector('h3, h2, span')?.textContent || 'Unknown Title',
          };
        });

        const overflowY = measurements.scrollHeight - measurements.clientHeight;
        const overflowX = measurements.scrollWidth - measurements.clientWidth;
        
        // Ignore tiny rounding differences (e.g. 1px or 2px)
        const isCutOff = overflowY > 2 || overflowX > 2;

        overflowResults.push({
          view: view.label,
          cardId,
          cardType: cardId.split('-')[1] || 'general',
          title: measurements.title,
          clientHeight: measurements.clientHeight,
          scrollHeight: measurements.scrollHeight,
          overflowY: Math.max(0, overflowY),
          clientWidth: measurements.clientWidth,
          scrollWidth: measurements.scrollWidth,
          overflowX: Math.max(0, overflowX),
          isCutOff,
        });
      }
    }

    // Generate markdown report content
    const reportPath = '/home/steve/.gemini/antigravity-cli/brain/b63da702-6572-4116-9b1a-ecf29507091e/visual_overflow_report.md';
    let md = `# Visual Overflow & Cut-off Diagnostic Report\n\n`;
    md += `Generated on: ${new Date().toLocaleString()}\n\n`;
    md += `This report outlines all widget cards checked across your dashboard views and measures whether any card components are vertically or horizontally cut off within their grid layout containers.\n\n`;

    const cutOffCards = overflowResults.filter(r => r.isCutOff);

    if (cutOffCards.length === 0) {
      md += `## 🎉 No Visual Overflow Detected!\n\nAll widgets fit cleanly inside their grid items with no content cut off.\n\n`;
    } else {
      md += `## ⚠️ Visual Overflows Detected (${cutOffCards.length} cards)\n\n`;
      md += `The following cards contain content that is larger than their grid cells and are currently cut off in the UI:\n\n`;
      
      md += `| View | Card Title | ID / Type | Visible Height | Scroll Height | Cut-off Pixels (Y) | Cut-off Pixels (X) |\n`;
      md += `| :--- | :--- | :--- | :---: | :---: | :---: | :---: |\n`;
      
      for (const card of cutOffCards) {
        md += `| **${card.view}** | ${card.title} | \`${card.cardId}\` (${card.cardType}) | ${card.clientHeight}px | ${card.scrollHeight}px | **${card.overflowY}px** | ${card.overflowX > 0 ? `**${card.overflowX}px**` : '0px'} |\n`;
      }
      md += `\n\n### Recommendation Action Plan:\n`;
      md += `1. **Increase grid item height (h)**: Adjust default \`h\` heights in \`useLayoutManager.ts\` to accommodate the required pixels.\n`;
      md += `2. **Compact styles**: Adjust paddings and margins for the affected widgets so they naturally fit smaller bounds.\n\n`;
    }

    md += `## Full Diagnostic Details (All Cards)\n\n`;
    md += `| View | Card Title | ID / Type | Visible Dimensions | Scroll Dimensions | Status |\n`;
    md += `| :--- | :--- | :--- | :---: | :---: | :--- |\n`;
    for (const card of overflowResults) {
      const statusStr = card.isCutOff ? '❌ Cut off' : '✅ Fits';
      md += `| ${card.view} | ${card.title} | \`${card.cardId}\` | ${card.clientWidth}x${card.clientHeight} | ${card.scrollWidth}x${card.scrollHeight} | ${statusStr} |\n`;
    }

    fs.writeFileSync(reportPath, md);
    console.log(`Report successfully written to ${reportPath}`);
  });
});
