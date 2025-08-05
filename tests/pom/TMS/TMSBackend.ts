import { APIRequestContext, Page } from "@playwright/test";
import { CampañasTMS } from "./CampañasTMS";
import { Utils } from "../../utils/utils";

/**
 * Clase dedicada a operaciones backend para campañas TMS.
 * Encapsula funciones que interactúan vía API y aprovecha métodos y locators de CampañasTMS.
 */
export class TmsBackend {
  private readonly page: Page;
  private readonly request: APIRequestContext;
  private readonly campañas: CampañasTMS;

  constructor(campañas: CampañasTMS) {
    this.campañas = campañas;
    this.page = campañas['guardarCampañaButton'].page(); // Acceso indirecto al page
    this.request = campañas['request'];
  }

  async getAccessToken(): Promise<string> {
    let token = await this.page.evaluate(() => localStorage.getItem('access_token'));

    if (!token) throw new Error("No se encontró el accessToken en localStorage");
    return token;
  }

  async getJwt(): Promise<string> {
    const token = await this.getAccessToken();
    return await Utils.dToken(token);
  }

  async getCampañasActivas(): Promise<any> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });

    const jwt = await this.getJwt();

    const response = await this.request.get(
      'https://tms.eldar-solutions.com/api/api/campaign/?page=0&size=5&status=IN_PROGRESS&status=PAUSED',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
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


  // crear funcion para encontrar la campaña en los id obtenidos en getCampañasActivas segun un id de terminal pasado por parametro
  async existeTerminalEnCampaña(idTerminal: number): Promise<string | null> {
    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();

    for (const campaña of campañas.content) {
      const id = campaña.id;

      const response = await this.request.get(
        `https://tms.eldar-solutions.com/api/api/campaign/${id}/details?idCampaign=${id}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok()) {
        console.warn(`❌ No se pudo obtener detalles para campaña ID ${id}`);
        continue;
      }

      const detalles = await response.json();

      const terminalEncontrado = detalles?.merchants?.some(merchant =>
        merchant.terminals?.some(terminal => terminal.terminalNumber === idTerminal)
      );

      if (terminalEncontrado) {
        console.log(`✅ Terminal ${idTerminal} encontrada en campaña: ${detalles.name}`);
        return detalles.name || null;
      }
    }

    return null; // No se encontró la terminal en ninguna campaña
  }



  async pausarCampañaBack(nombreCampaña: string): Promise<void> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });

    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();
    const id = campañas.content.find(c => c.name.toUpperCase() === nombreCampaña.toUpperCase())?.id;

    if (!id) return;

    const response = await this.request.post(
      `https://tms.eldar-solutions.com/api/api/campaign/${id}/pause`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Accept-Language': 'es-419,es;q=0.9',
        },
      }
    );

    //await this.page.waitForTimeout(3000);
    const resultado = await response.json();
    // Podés retornar el resultado o hacer logging si querés.
  }


  async eliminarCampañaBack(nombreCampaña: string): Promise<void> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });

    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();
    const id = campañas.content.find(c => c.name.toUpperCase() === nombreCampaña.toUpperCase())?.id;

    if (!id) return;

    const response = await this.request.post(
      `https://tms.eldar-solutions.com/api/api/campaign/${id}/cancel`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Accept-Language': 'es-419,es;q=0.9',
        },
      }
    );

    const resultado = await response.json();
    // Podés retornar el resultado o hacer logging si querés.
  }

  async crearCampañaBack(nombreCampaña: string, fecha: string, terminal: number): Promise<void> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });
    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();
    const existe_campaña = campañas.content.find(c => c.name.toUpperCase() === nombreCampaña.toUpperCase());

    if (existe_campaña) throw new Error("Ya existe la campaña");

    const existe_terminal = await this.existeTerminalEnCampaña(terminal);

    if (existe_terminal) {
      await this.eliminarCampañaBack(existe_terminal);
    }

    const id_terminal = await this.getTerminalDataBack(terminal)


    const response = await this.request.post(
      'https://tms.eldar-solutions.com/api/api/campaign/new/terminals',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Accept-Language': 'es-419,es;q=0.9',
        },
        data: {
          date: fecha,
          softwareVersionId: 'a5809535-3f64-4064-9052-6d9482ee62c5',
          campaignName: nombreCampaña,
          terminalIds: ['a88b8bd8-3741-11f0-9f60-0242ac1a0002'],
        },
      }
    );

    const resultado = await response.json();
    console.log("Campaña creada:", resultado);
  }

  async getTerminalDataBack(terminal: number): Promise<string> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });
    const jwt = await this.getJwt();

    const response = await this.request.get(
      `https://tms.eldar-solutions.com/api/api/terminalParametry/${terminal}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          Referer: 'https://tms.eldar-solutions.com/campa%C3%B1as',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
          'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Accept-Language': 'es-419,es;q=0.9',
        },
      }
    );

    const body = await response.json();
    return body.id; // ✅ Devuelve el ID del terminal
  }
}
