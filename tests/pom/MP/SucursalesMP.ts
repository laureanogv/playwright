import { Locator, Page } from "@playwright/test"

export class SucursalesMP {

    private page: Page;
    private readonly buscarSucursalTxt: Locator;
    private readonly agregarSucursalBtn: Locator;
    private readonly nombreNuevaSucursalTxt: Locator;
    private readonly direccionNuevaSucursalTxt: Locator;
    private readonly emailNuevaSucursalTxt: Locator;
    private readonly cierreLoteNuevaSucursalSelect: Locator;
    private readonly tieneCuotasNuevaSucursalSelect: Locator;
    private readonly guardarNuevaSucursalBtn: Locator;


    constructor(page: Page) {
        this.page = page;
        this.buscarSucursalTxt = page.locator("#branch-search");
        this.agregarSucursalBtn = page.locator("button:has-text('Agregar Sucursal')");
        this.nombreNuevaSucursalTxt = page.locator("#name");
        this.direccionNuevaSucursalTxt = page.locator("#address");
        this.emailNuevaSucursalTxt = page.locator("#supervisor");
        this.cierreLoteNuevaSucursalSelect = page.locator("#mui-component-select-batchConfigurationId");
        this.tieneCuotasNuevaSucursalSelect = page.locator("#mui-component-select-supportsInstallments");
        this.guardarNuevaSucursalBtn = page.locator("button:has-text('Guardar')");
    }

    async enterSucursal(sucursal: string){
        await this.buscarSucursalTxt.fill(sucursal);
    }

    async clickAgregarSucursal(){
        await this.agregarSucursalBtn.click();
    }
    
    async enterNombreNuevaSucursal(sucursal: string){
        await this.nombreNuevaSucursalTxt.fill(sucursal);
    }

    async enterDireccionNuevaSucursal(direccion: string){
        await this.direccionNuevaSucursalTxt.fill(direccion);
    }

    async enterEmailNuevaSucursal(direccion: string){
        await this.emailNuevaSucursalTxt.fill(direccion);
    }

    async selectCierreLoteNuevaSucursal(hora: string){
        await this.cierreLoteNuevaSucursalSelect.click();
        await this.page.locator(`li[role='option']:has-text('${hora}')`).click();
    }

    async selectTieneCuotasNuevaSucursal(cuotas: string){
        await this.tieneCuotasNuevaSucursalSelect.click();
        await this.page.locator(`li[role='option']:has-text('${cuotas}')`).click();
    }

     async clickGuardarNuevaSucursal(){
        await this.agregarSucursalBtn.click();
    }
}