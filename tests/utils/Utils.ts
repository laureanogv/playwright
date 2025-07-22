import { Locator, Page, expect } from "@playwright/test"
import CryptoJS from 'crypto-js';

/**
 * Clase utilitaria para funciones auxiliares en test automatizados,
 * incluyendo extracción de datos por doble factor, fecha actual y desencriptado de tokens.
 */
export class Utils {

    /**
 * Abre una nueva pestaña y navega a una URL donde se espera recibir un mensaje de doble factor.
 * Extrae texto desde elementos <b> o <h2> de los frames disponibles.
 *
 * @param url - Dirección a la que se navega (por ejemplo, correo temporal).
 * @param page - Instancia principal de la página proporcionada por Playwright.
 * @returns Texto extraído que representa el código o mensaje esperado.
 */
    static async dobleFactor1(url: string, page: Page): Promise<string> {
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

    /**
 * Retorna la fecha actual en formato DDMMAAAA.
 *
 * @returns Fecha como string (ejemplo: '21072025').
 */
    static async obtenerFechaActual(formato: string): Promise<string> {
        if (formato == 'DDMMYYYY') {
            const hoy = new Date();
            const dd = String(hoy.getDate()).padStart(2, '0');
            const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
            const aaaa = hoy.getFullYear();
            return `${dd}${mm}${aaaa}`;
        }

        if (formato == 'AAAA-MM-DD') {
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
            const dd = String(hoy.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
        else{
            return 'error, formato invalido: los formatos validos son DDMMAAAA o AAAA-MM-DD';
        }
    }

    /**
 * Desencripta un token cifrado con AES usando una clave estática.
 * Utiliza CryptoJS para procesar tokens tipo OpenSSL o base AES.
 *
 * @param access_token - Cadena encriptada a descifrar.
 * @returns Token JWT descifrado como string plano.
 */
    static async dToken(access_token: string): Promise<string> {
        const decryptToken = (encrypted: string, key: string) => {
            const bytes = CryptoJS.AES.decrypt(encrypted, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        };

        const jwt = decryptToken(access_token, '8pL7Q9fYdW2rKs5Mz7X8vR6NcZ1oH4tJ');

        return jwt;
    }

}