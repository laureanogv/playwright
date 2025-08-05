import { test, expect } from '@playwright/test';
import { LoginMP } from '../../pom/Login';
import { DobleFactor } from '../../pom/DobleFactor';
import { Utils } from '../../utils/utils';
import { MenuTMS } from '../../pom/TMS/MenuTMS';
import { CampañasTMS } from '../../pom/TMS/CampañasTMS';
import { TmsBackend } from '../../pom/TMS/TMSBackend';

test('crear-campaña', async ({ page, request }) => {
  test.setTimeout(90000); // 90 segundos para este test

  const login = new LoginMP(page);
  const df = new DobleFactor(page);
  const menu = new MenuTMS(page);
  const nuevaCampaña = new CampañasTMS(page, request);
  const tmsAPI = new TmsBackend(nuevaCampaña);

  const nombreCampaña = 'Campaña de prueba';

  await page.goto('https://tms.eldar-solutions.com/');
  await page.waitForSelector('h5');

  // Ingresamos las credenciales
  await login.loginWithCredentials("testtmsauto@yopmail.com", "Clave123!");


  // obtenemos el token de doble factor
  let token = await Utils.dobleFactor1("https://yopmail.com/?testtmsauto", page)

  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(token);

  //eliminamos la campaña si 
  await tmsAPI.eliminarCampañaBack(nombreCampaña)

  // ingresamos al menu campañas
  await menu.clickOnCampaña();

  // obtener la fecha actual en formato DDMMAAAA
  let fecha = await Utils.obtenerFechaActual('DDMMYYYY')
  
  // hacemos click en el boton crear campaña
  await nuevaCampaña.crearCampaña(nombreCampaña, fecha, "Eldar v0", "2");

  // leemos el mensaje de confirmación
  const snackbar = page.getByRole('alert');
  const mensaje = await snackbar.textContent();

  // obtenemos los datos de la campaña creada
  const datos = await nuevaCampaña.obtenerDatosCampaña(nombreCampaña)

  // validamos el mensaje de confirmación
  expect(mensaje).toBe('La campaña '+nombreCampaña.toUpperCase()+' se ha creado correctamente.');

  // Validamos que el titulo sea correcto
  await expect(page).toHaveTitle(/TMS/);

  // Validamos que el software sea correcto
  expect(datos.software).toBe('Eldar');

  // Validamos que la cantidad de terminales sea correcta
  expect(datos.terminales).toBe('1');

  // Validamos que la cantidad de comercios sea correcta
  expect(datos.comercios).toBe('1');



});

