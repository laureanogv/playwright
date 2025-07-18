import { test, expect } from '@playwright/test';
import { LoginMP } from '../pom/Login';
import { DobleFactor } from '../pom/DobleFactor';
import { Utils } from '../utils/utils';
import { MenuTMS } from '../pom/MenuTMS';
import { CampañasTMS } from '../pom/CampañasTMS';

test('crear-campaña', async ({ page }) => {
  const util = new Utils();
  const login = new LoginMP(page);
  const df = new DobleFactor(page);
  const menu = new MenuTMS(page);
  const tms = new CampañasTMS(page);

  await page.goto('https://tms-eldar-sta.eldars.com.ar/');
  await page.waitForSelector('h5');

  // Ingresamos las credenciales
  await login.loginWithCredentials("testtmsauto@yopmail.com","Clave123!");

  // obtenemos el token de doble factor
  let token = await util.dobleFactor1("https://yopmail.com/?testtmsauto", page)

  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(token);
  await page.waitForTimeout(2000);

  // ingresamos al menu campañas
  menu.clickOnCampaña();

  // hacemos click en el boton crear campaña
  tms.clickOnCrearCampaña();


  await page.waitForTimeout(2000);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TMS/);

});

