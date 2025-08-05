import { Locator, Page, expect } from "@playwright/test"

export class MenuTMS {

    private readonly home: Locator
    private readonly software: Locator
    private readonly campaña: Locator
    private readonly terminales: Locator
    private readonly usuario: Locator
    private readonly auditorias: Locator
    private readonly salir: Locator
    

    constructor(page: Page) {
        this.home = page.locator('span', { hasText: 'Home' })
        this.software = page.locator('span', { hasText: 'Software' })
        this.campaña = page.locator('span', { hasText: 'Campaña' })
        this.terminales = page.locator('span', { hasText: 'Terminales' })
        this.usuario = page.locator('span', { hasText: 'Usuarios' })
        this.auditorias = page.locator('span', { hasText: 'Auditorias' })
        this.salir = page.locator('span', { hasText: 'Salir' })
    }

    async clickOnHome() {
        await this.home.click()
    }

    async clickOnSoftware() {
        await this.software.click()
    }

    async clickOnCampaña() {
        await this.campaña.click()
    }

    async clickOnTerminales() {
        await this.terminales.click()
    }

    async clickOnUsuarios() {
        await this.usuario.click()
    }

    async clickOnAuditorias() {
        await this.auditorias.click()
    }

    async clickOnSalir() {
        await this.salir.click()
    }

}
