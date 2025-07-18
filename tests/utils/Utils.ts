import { Locator, Page, expect } from "@playwright/test"

export class Utils {

    async dobleFactor1(url: string, page: Page): Promise<string> {
        const newTab = await page.context().newPage();
        await page.waitForTimeout(8000);
        await newTab.goto(url);

        let datoExtraido = '';
        const frames = newTab.frames();

        for (const frame of frames) {
            datoExtraido = await frame.evaluate(() => {
            const b = document.querySelector('b');
            if (b?.textContent?.trim()) {
                return b.textContent.trim();
            }

            const h2 = document.querySelector('h2');
            return h2?.textContent?.trim() || '';
            });

            if (datoExtraido) break;
        }

        await newTab.close();
        return datoExtraido;
    }

}