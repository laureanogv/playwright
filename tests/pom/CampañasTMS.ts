import { Locator, Page, expect } from "@playwright/test"

export class CampañasTMS {

    private readonly campañaEnCursoButton: Locator
    private readonly campañaAsignadaButton: Locator
    private readonly campañaRealizadaButton: Locator
    private readonly crearCampañaButton: Locator
    

    constructor(page: Page) {
        this.campañaEnCursoButton = page.getByRole('tab', { name: 'En curso' });
        this.campañaAsignadaButton = page.getByRole('tab', { name: 'Asignadas' });
        this.campañaRealizadaButton = page.getByRole('tab', { name: 'Realizadas' });
        this.crearCampañaButton = page.locator('[data-testid="AddIcon"]');
    }

    async clickOnCrearCampaña() {
        await this.crearCampañaButton.click()
    }



}
