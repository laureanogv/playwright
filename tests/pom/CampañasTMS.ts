import { Locator, Page, expect, APIRequestContext } from "@playwright/test";
import { Utils } from '../utils/utils';

/**
 * Clase Page Object Model para gestionar campañas dentro de la plataforma TMS.
 * Incluye acciones para crear, consultar y eliminar campañas mediante interacción UI y peticiones API.
 */
export class CampañasTMS {
    private readonly request: APIRequestContext;

    // Locators de pestañas de campañas
    private readonly campañaEnCursoButton: Locator
    private readonly campañaAsignadaButton: Locator
    private readonly campañaRealizadaButton: Locator
    private readonly crearCampañaButton: Locator

    // Locators de campos del formulario
    private readonly nombreCampañaInput: Locator
    private readonly fechaCampañaInput: Locator
    private readonly versionSoftwareList: Locator
    private readonly seleccionarTerminalesButton: Locator
    private readonly terminalCheck: Locator
    private readonly terminalSelectButton: Locator
    private readonly guardarCampañaButton: Locator
    private readonly siCrearCampañaButton: Locator

    /**
 * @param page Página actual de Playwright para interactuar con la UI.
 * @param request Contexto API para realizar peticiones HTTP autenticadas.
 */
    constructor(page: Page, request: APIRequestContext) {
        this.request = request;
        this.campañaEnCursoButton = page.getByRole('tab', { name: 'En curso' });
        this.campañaAsignadaButton = page.getByRole('tab', { name: 'Asignadas' });
        this.campañaRealizadaButton = page.getByRole('tab', { name: 'Realizadas' });
        this.crearCampañaButton = page.locator('[data-testid="AddIcon"]');
        this.nombreCampañaInput = page.locator('#outlined-basic');
        this.fechaCampañaInput = page.locator('#input-with-icon-textfield');
        this.versionSoftwareList = page.locator('#selectSoftware');
        this.seleccionarTerminalesButton = page.getByRole('button', { name: 'Seleccionar terminales' });
        this.terminalCheck = page.locator('tbody > tr');
        this.terminalSelectButton = page.getByRole('button', { name: 'Seleccionar' });
        this.guardarCampañaButton = page.getByRole('button', { name: 'Guardar' });
        this.siCrearCampañaButton = page.getByRole('button', { name: 'Si, crear' });
    }

    /**
 * Hace clic en el botón "Crear campaña".
 */
    async clickOnCrearCampaña() {
        await this.crearCampañaButton.click()
    }

    /**
 * Completa el campo de nombre de campaña.
 * @param nombre Nombre de la campaña.
 */
    async fillNombreCampaña(nombre: string) {
        await this.nombreCampañaInput.fill(nombre)
    }

    /**
 * Completa la fecha de la campaña.
 * @param fecha Fecha en formato 'DD/MM/YYYY'.
 */
    async fillFechaCampaña(fecha: string) {
        //await this.fechaCampañaInput.click(); // Limpia el campo antes de rellenarlo
        await this.fechaCampañaInput.fill('');
        await this.fechaCampañaInput.type(fecha)
    }
    /**
     * Selecciona la versión de software y avanza a terminales.
     * @param version Versión del software (texto visible en el selector).
     */
    async selectVersionSoftware(version: string) {
        await this.versionSoftwareList.click(); // Abre el desplegable
        // Espera desde la página a que las opciones aparezcan
        await this.versionSoftwareList.page().waitForSelector('role=option');
        // Selecciona la opción por el texto recibido como parámetro
        await this.versionSoftwareList.page().getByRole('option', { name: version }).click();
        // Continúa con el siguiente botón
        await this.seleccionarTerminalesButton.click();
    }

    /**
 * Hace clic en el botón "Seleccionar terminales".
 */
    async clickOnSeleccionarTerminales() {
        await this.seleccionarTerminalesButton.click()
    }

      /**
   * Flujo completo para crear una campaña desde UI.
   * @param nombre Nombre de la campaña.
   * @param fecha Fecha de ejecución.
   * @param version Versión de software.
   * @param terminal ID de terminal a seleccionar.
   */
    async crearCampaña(nombre: string, fecha: string, version: string, terminal: string) {
        await this.clickOnCrearCampaña();
        await this.fillNombreCampaña(nombre);
        await this.fillFechaCampaña(fecha);
        await this.selectVersionSoftware(version);
        await this.seleccionarTerminal(terminal);
        await this.clickOnGuardarCampaña();
        await this.clickOnSiCrearCampañaButton();
    }

      /**
   * Selecciona una terminal específica por ID dentro de la tabla.
   * @param terminalId Texto visible del terminal.
   */
    async seleccionarTerminal(terminalId: string) {
        await this.terminalCheck.first().waitFor({ state: 'visible', timeout: 5000 });
        const totalFilas = await this.terminalCheck.count();

        for (let i = 0; i < totalFilas; i++) {
            const fila = this.terminalCheck.nth(i);
            const textoTerminal = await fila.locator('td').nth(1).textContent();

            if (textoTerminal?.trim() === terminalId) {
                //await fila.locator('input[type="checkbox"]').nth(parseInt(terminalId)).click();
                await fila.locator('span.MuiCheckbox-root').click();
                break;
            }
        }

        await this.terminalSelectButton.click();
    }

      /**
   * Hace clic en el botón "Guardar campaña".
   */
    async clickOnGuardarCampaña() {
        await this.guardarCampañaButton.click()
    }

      /**
   * Confirma la creación haciendo clic en "Sí, crear".
   */
    async clickOnSiCrearCampañaButton() {
        await this.siCrearCampañaButton.click()
    }

      /**
   * Obtiene los datos de una campaña ya creada buscando por nombre.
   * @param nombreCampaña Nombre a buscar.
   * @returns Detalles de la campaña: comercios, software, terminales, actualización.
   */
      async obtenerDatosCampaña(nombreCampaña: string): Promise<{
        comercios: string;
        software: string;
        terminales: string;
        actualizacion: string;
      }> {
        const campañasLocator = this.guardarCampañaButton
          .page()
          .locator('h6');
      
        const total = await campañasLocator.count();
      
        for (let i = 0; i < total; i++) {
          const campaña = campañasLocator.nth(i);
          const texto = await campaña.textContent();
          const normalizado = texto?.replace(/\s+/g, ' ').trim().toLowerCase();
          const comparado = nombreCampaña.toLowerCase();
      
          if (normalizado?.includes(comparado)) {
            const contenedor = campaña.locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]');
            const detalles = contenedor.locator('p');
      
            const datos = await detalles.allTextContents();
      
            const extraerValor = (linea: string) => linea.split(':')[1]?.trim() || '';
      
            return {
              comercios: extraerValor(datos[0]),
              software: extraerValor(datos[1]),
              terminales: extraerValor(datos[2]),
              actualizacion: extraerValor(datos[3]),
            };
          }
        }
      
        throw new Error(`Campaña "${nombreCampaña}" no encontrada`);
      }

      /**
   * Consulta campañas activas (IN_PROGRESS o PAUSED) vía API.
   * @returns Respuesta JSON con campañas activas.
   */
    async getCampañasActivas(): Promise<any> {
        const token = await this.guardarCampañaButton.page().evaluate(() =>
            localStorage.getItem('access_token')
        );

        const jwt = await Utils.dToken(token || '');

        if (!token) {
            throw new Error('No se encontró el accessToken en localStorage');
        }

        const response = await this.request.get(
            'https://tms.eldar-solutions.com/api/api/campaign/?page=0&size=5&status=IN_PROGRESS&status=PAUSED',
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json, text/plain, */*',
                    Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                    'sec-ch-ua':
                        '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'Sec-Fetch-Site': 'same-origin',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Dest': 'empty',
                    'Accept-Language': 'es-419,es;q=0.9',
                },
            }
        );

        if (!response.ok()) {
            const body = await response.text();
            console.error('Respuesta del servidor:', body);
            throw new Error(`Error ${response.status()}: ${response.statusText()}`);
        }

        return await response.json();
    }

      /**
   * Elimina una campaña buscándola por nombre y haciendo POST a su endpoint de cancelación.
   * @param nombreCampaña Nombre exacto de la campaña.
   */
    async eliminarCampaña(nombreCampaña: string): Promise<void> {
        const token = await this.guardarCampañaButton.page().evaluate(() =>
            localStorage.getItem('access_token')
        );

        const jwt = await Utils.dToken(token || '');

        if (!token) {
            throw new Error('No se encontró el accessToken en localStorage');
        }

        const valor = await this.getCampañasActivas();
        let id = valor.content.find(c => c.name === nombreCampaña.toUpperCase())?.id;
        if (id) {
            const response = await this.request.post(
                'https://tms.eldar-solutions.com/api/api/campaign/' + id + '/cancel',
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json, text/plain, */*',
                        Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
                        'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                        'sec-ch-ua':
                            '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty',
                        'Accept-Language': 'es-419,es;q=0.9',
                    },
                }

            )
            const resultado = await response.json();

        }

    }




}