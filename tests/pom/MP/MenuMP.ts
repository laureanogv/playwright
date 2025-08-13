import { Locator, Page } from "@playwright/test"

export class MenuMP {
    
    private readonly home: Locator;
    private readonly ventas: Locator;
    private readonly terminales: Locator;
    private readonly configuracion: Locator;
    private readonly sucursales: Locator;
    private readonly cuenta: Locator;
    private readonly salir: Locator;
    

    constructor(page: Page) {
        this.home = page.locator("a[href='/inicio']");
        this.ventas = page.locator("a[href='/ventas']");
        this.terminales = page.locator("a[href='/terminales']");
        this.configuracion = page.locator("a[href='/configuracion']");
        this.sucursales = page.locator("a[href='/sucursales']");
        this.cuenta = page.locator("a[href='/mi-cuenta']");
        this.salir = page.locator("p:has-text('Salir')");
    }

    async clickOnHome() {
        await this.home.click();
    }

    async clickOnVentas() {
        await this.ventas.click();
    }

    async clickOnTerminales() {
        await this.terminales.click();
    }

    async clickOnConfiguracion() {
        await this.configuracion.click();
    }

    async clickOnSucursales() {
        await this.sucursales.click();
    }

    async clickOnCuenta() {
        await this.cuenta.click();
    }

    async clickOnSalir() {
        await this.salir.click();
    }
}
