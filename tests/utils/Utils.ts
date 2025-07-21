import { Locator, Page, expect } from "@playwright/test"
import CryptoJS from 'crypto-js';

export class Utils {

    async dobleFactor1(url: string, page: Page): Promise<string> {
        const newTab = await page.context().newPage();
        await page.waitForTimeout(8000);
        await newTab.goto(url, { timeout: 60000 }); // 60 segundos

        

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

    async obtenerFechaActual(): Promise<string> {
        const hoy = new Date();
        const dd = String(hoy.getDate()).padStart(2, '0');
        const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const aaaa = hoy.getFullYear();
        return `${dd}${mm}${aaaa}`;
    }

    static async dToken(access_token: string): Promise<string> {
        const decryptToken = (encrypted: string, key: string) => {
            const bytes = CryptoJS.AES.decrypt(encrypted, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        };

        const jwt = decryptToken(access_token, '8pL7Q9fYdW2rKs5Mz7X8vR6NcZ1oH4tJ');

        return jwt;
    }

}