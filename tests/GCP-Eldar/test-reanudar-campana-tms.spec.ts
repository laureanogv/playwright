import { test, expect } from '@playwright/test';
import { LoginMP } from '../pom/Login';
import { DobleFactor } from '../pom/DobleFactor';
import { Utils } from '../utils/utils';
import { MenuTMS } from '../pom/MenuTMS';
import { CampañasTMS } from '../pom/CampañasTMS';
import { TmsBackend } from '../pom/TMSBackend';

test('reanudar-campaña', async ({ page, request }) => {
  test.setTimeout(90000); // 90 segundos para este test

  const login = new LoginMP(page);
  const df = new DobleFactor(page);
  const menu = new MenuTMS(page);
  const nuevaCampaña = new CampañasTMS(page, request);
  const tmsAPI = new TmsBackend(nuevaCampaña);

  const nombreCampaña = 'Autom reanudar campaña';

  await page.goto('https://tms.eldar-solutions.com/');
  await page.waitForSelector('h5');


  // Ingresamos las credenciales
  await login.loginWithCredentials("testtmsauto@yopmail.com", "Clave123!");


  // obtenemos el token de doble factor
  let token = await Utils.dobleFactor1("https://yopmail.com/?testtmsauto", page)

  // ingresamos el codigo de doble factor
  await df.loginWithCredentials(token);

    // obtener la fecha actual en formato DDMMAAAA
    let fecha = await Utils.obtenerFechaActual('AAAA-MM-DD')

    //eliminamos la campaña si 
    await tmsAPI.eliminarCampañaBack(nombreCampaña)
  
    //creamos la campaña
    await tmsAPI.crearCampañaBack(nombreCampaña, fecha, 1)
  
    // pausamos la campaña
    await tmsAPI.pausarCampañaBack(nombreCampaña);

  // ingresamos al menu campañas
  await menu.clickOnCampaña();

  
  //seleccionamos el detalle de la campaña
  await nuevaCampaña.clickDetalleCampañaEnCurso(nombreCampaña)



  //reanudamos la campaña
  await nuevaCampaña.clickOnReanudarCampaña()
  await nuevaCampaña.clickOnSiReanudarCampaña()

  const snackbar = page.getByRole('alert');
  const mensaje = await snackbar.textContent();


  let errorCapturado: Error | null = null;
  try {
    await nuevaCampaña.obtenerDatosCampaña(nombreCampaña);
  } catch (error) {
    errorCapturado = error as Error;
  }

  // validamos el mensaje de confirmación
  expect(mensaje).toBe('Campaña  reanudada con éxito');

  // Validamos que el titulo sea correcto
  await expect(page).toHaveTitle(/TMS/);

  // Validamos que el software sea correcto
  //expect(errorCapturado).toBe(`Campaña "${nombreCampaña}" no encontrada.`);

});

