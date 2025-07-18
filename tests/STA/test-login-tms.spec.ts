import { test, expect } from '@playwright/test';
import { LoginMP } from '../pom/Login';
import { DobleFactor } from '../pom/DobleFactor';
import { Utils } from '../utils/utils';

test('login', async ({ page }) => {
  await page.goto('https://tms-eldar-sta.eldars.com.ar/');
  await page.waitForSelector('h5');


  const login = new LoginMP(page);
  const df = new DobleFactor(page);
  const util = new Utils();

  await login.loginWithCredentials("testtmsauto@yopmail.com","Clave123!");

  let token = await util.dobleFactor1("https://yopmail.com/?testtmsauto", page)
  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(token);

  await page.waitForTimeout(1000);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TMS/);
  const welcome = await page.locator('h1');
  await expect(welcome).toContainText('Hola, Automation Test')

  await page.waitForTimeout(1000);

});

