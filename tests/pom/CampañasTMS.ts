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

    // Locators detalle campaña
    private readonly cancelarCampañaButton: Locator
    private readonly siCancelarCampañaButton: Locator
    private readonly pausarCampañaButton: Locator
    private readonly siPausarCampañaButton: Locator
    private readonly reanudarCampañaButton: Locator
    private readonly siReanudarCampañaButton: Locator

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
        this.cancelarCampañaButton = page.getByRole('button', { name: 'Cancelar' });
        this.siCancelarCampañaButton = page.getByRole('button', { name: 'Si, cancelar campaña' });
        this.pausarCampañaButton = page.getByRole('button', { name: 'Pausar' });
        this.siPausarCampañaButton = page.getByRole('button', { name: 'Si, pausar' });
        this.reanudarCampañaButton = page.getByRole('button', { name: 'Reanudar' });
        this.siReanudarCampañaButton = page.getByRole('button', { name: 'Si, reanudar' });
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
        const page = this.guardarCampañaButton.page();

        // Espera 1 segundo para dar tiempo a que se renderice la campaña recién creada
        await page.waitForTimeout(1000);

        const campañasLocator = page.locator('h6');

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

        await page.screenshot({ path: 'campaña_no_encontrada.png' });
        throw new Error(`Campaña "${nombreCampaña}" no encontrada.`);
    }



    /**
 * Busca el botón de acción asociado a una campaña por nombre.
 * Retorna el Locator del botón que contiene el ícono ArrowRight dentro del bloque de campaña.
 *
 * @param nombreCampaña - Nombre de la campaña a buscar.
 * @returns Locator del botón correspondiente.
 */
    async clickDetalleCampañaEnCurso(nombreCampaña: string) {
        const page = this.guardarCampañaButton.page();

        // Espera 1 segundo para dar tiempo a que se renderice la campaña recién creada
        await page.waitForTimeout(1500);

        const campañasLocator = page.locator('h6');

        const total = await campañasLocator.count();

        for (let i = 0; i < total; i++) {
            const campaña = campañasLocator.nth(i);
            const texto = await campaña.textContent();
            const normalizado = texto?.replace(/\s+/g, ' ').trim().toLowerCase();
            const comparado = nombreCampaña.toLowerCase();


            if (normalizado?.includes(comparado)) {
                // Accede al contenedor raíz de la campaña
                const contenedor = await campaña.locator('xpath=ancestor::div[contains(@class, "MuiPaper-root")]');
                console.log('Contenedor encontrado:', contenedor);
                // Localiza el botón asociado al ícono de flecha (ArrowRight)
                const boton = contenedor.getByLabel('next');
                await boton.waitFor({ state: 'visible', timeout: 5000 });
                await boton.click();
                return;
            }
        }

        throw new Error(`No se encontró el botón para la campaña "${nombreCampaña}"`);
    }

    async clickOnCancelarCampaña() {
        await this.cancelarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.cancelarCampañaButton.click()
    }

    async clickOnSiCancelarCampaña() {
        await this.siCancelarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.siCancelarCampañaButton.click()
    }

    async clickOnPausarCampaña() {
        await this.pausarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.pausarCampañaButton.click()
    }

    async clickOnSiPausarCampaña() {
        await this.siPausarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.siPausarCampañaButton.click()
    }

    async clickOnReanudarCampaña() {
        await this.reanudarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.reanudarCampañaButton.click()
    }

    async clickOnSiReanudarCampaña() {
        await this.siReanudarCampañaButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.siReanudarCampañaButton.click()
    }

}