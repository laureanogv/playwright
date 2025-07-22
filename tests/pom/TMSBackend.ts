import { APIRequestContext, Page } from "@playwright/test";
import { CampañasTMS } from "./CampañasTMS";
import { Utils } from "../utils/utils";

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
    const token = await this.page.evaluate(() => localStorage.getItem('access_token'));
    if (!token) throw new Error("No se encontró el accessToken en localStorage");
    return token;
  }

  async getJwt(): Promise<string> {
    const token = await this.getAccessToken();
    return await Utils.dToken(token);
  }

  async getCampañasActivas(): Promise<any> {
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

  async eliminarCampañaBack(nombreCampaña: string): Promise<void> {
    await this.page.waitForSelector('header', { state: 'visible', timeout: 10000 });

    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();
    const id = campañas.content.find(c => c.name === nombreCampaña.toUpperCase())?.id;

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

  async crearCampañaBack(nombreCampaña: string, fecha: string): Promise<void> {
    const jwt = await this.getJwt();
    const campañas = await this.getCampañasActivas();
    const existe = campañas.content.find(c => c.name === nombreCampaña.toUpperCase());

    if (existe) throw new Error("Ya existe la campaña");

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
          terminalIds: ['168edd83-34b6-11f0-8977-0242ac170002'],
        },
      }
    );

    const resultado = await response.json();
  }
}
