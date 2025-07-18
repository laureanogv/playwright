import { test, expect } from '@playwright/test';
import { LoginMP, LoginMPDF } from '../pom/Login';

test('login', async ({ page }) => {
  await page.goto('https://backoffice-eldar-sta.eldars.com.ar/');
  await page.waitForSelector('h5');


  const login = new LoginMP(page);
  const df = new LoginMPDF(page);

  await login.loginWithCredentials("testtmsauto@yopmail.com","Clave123!");

 

   // Abrir nueva pestaña
   const newTab = await page.context().newPage();
   await page.waitForTimeout(10000);
   await newTab.goto('https://yopmail.com/?testtmsauto');

   let datoExtraido;
   // Obtener el dato
   const frames = newTab.frames();
   for (const frame of frames) {
     datoExtraido = await frame.evaluate(() => {
       const b = document.querySelector('b');
       return b?.textContent?.trim() || '';
     });
   }
 
  // Cerrar pestaña secundaria
  await newTab.close();

  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(datoExtraido);

  await page.waitForTimeout(1000);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Back Office/);
  const welcome = await page.locator('h1');
  await expect(welcome).toContainText('Hola, Automation Test')

  await page.waitForTimeout(1000);

});

