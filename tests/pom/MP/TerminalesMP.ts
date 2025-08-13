import { Locator, Page } from "@playwright/test"

export class TerminalesMP {

    private page: Page;
    private readonly iniciarTerminalBtn: Locator;
    private readonly terminalesBtn: Locator;
    private readonly sucursalSelect: Locator;
    private readonly estadoSelect: Locator;
    private readonly detalleTerminalBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.iniciarTerminalBtn = page.locator("button:has-text('Iniciar Terminal')");
        this.terminalesBtn = page.locator("button:has-text('Terminales')");
        this.sucursalSelect = page.locator("div[role='combobox']").nth(0);
        this.estadoSelect = page.locator("div[role='combobox']").nth(1);
    }

    async clickIniciarTerminal(){
        await this.iniciarTerminalBtn.click();
    }

    async clickTerminales(){
        await this.terminalesBtn.click();
    }

    async selectSucursal(sucursal: string){
        await this.sucursalSelect.click();
        await this.page.locator(`li[role='option']:has-text('${sucursal}')`).first().click();
    }

    async selectEstado(estado: string){
        await this.sucursalSelect.click();
        await this.page.locator(`li[role='option']:has-text('${estado}')`).first().click();
    }

    async clickDetallesTerminal(numTerminal: string){
        await this.page.locator(`tr[class='MuiTableRow-root css-mzxyrw']:has-text('${numTerminal}') button`).click();
    }
}