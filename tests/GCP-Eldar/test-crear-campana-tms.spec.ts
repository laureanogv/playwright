import { test, expect } from '@playwright/test';
import { LoginMP } from '../pom/Login';
import { DobleFactor } from '../pom/DobleFactor';
import { Utils } from '../utils/utils';
import { MenuTMS } from '../pom/MenuTMS';
import { CampañasTMS } from '../pom/CampañasTMS';

test('crear-campaña', async ({ page, request }) => {
  test.setTimeout(90000); // 90 segundos para este test
  
  const util = new Utils();
  const login = new LoginMP(page);
  const df = new DobleFactor(page);
  const menu = new MenuTMS(page);
  const nuevaCampaña = new CampañasTMS(page, request);

  const nombreCampaña = 'Campaña de prueba';

  await page.goto('https://tms.eldar-solutions.com/');
  await page.waitForSelector('h5');
 

  // Ingresamos las credenciales
  await login.loginWithCredentials("testtmsauto@yopmail.com","Clave123!");
  
  
  // obtenemos el token de doble factor
  let token = await util.dobleFactor1("https://yopmail.com/?testtmsauto", page)

  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(token);

  // ingresamos al menu campañas
  await menu.clickOnCampaña();

  //eliminamos la campaña si 
  await nuevaCampaña.eliminarCampaña(nombreCampaña)

  // hacemos click en el boton crear campaña
  let fecha = await util.obtenerFechaActual()
  await nuevaCampaña.crearCampaña(nombreCampaña, fecha, "Eldar v0", "2");

  const snackbar = page.getByRole('alert');
  const mensaje = await snackbar.textContent();


  const datos = await nuevaCampaña.obtenerDatosCampaña(nombreCampaña)

  // validamos el mensaje de confirmación
  expect(mensaje).toBe('La campaña CAMPAÑA DE PRUEBA se ha creado correctamente.');

  // Validamos que el titulo sea correcto
  await expect(page).toHaveTitle(/TMS/);

  // Validamos que el software sea correcto
  expect(datos.software).toBe('Eldar');

  // Validamos que la cantidad de terminales sea correcta
  expect(datos.terminales).toBe('1');

  // Validamos que la cantidad de comercios sea correcta
  expect(datos.comercios).toBe('1');



});

