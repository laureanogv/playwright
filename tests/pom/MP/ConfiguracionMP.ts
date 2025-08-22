import { Locator, Page } from "@playwright/test"

export class ConfiguracionMP {

    private page: Page;
    private readonly usuarioBtn: Locator;
    private readonly nuevoUsuarioBtn: Locator;
    private readonly nombreUsuarioTxt: Locator;
    private readonly apellidoUsuarioTxt: Locator;
    private readonly emailUsuarioTxt: Locator;
    private readonly telefonoUsuarioTxt: Locator;
    private readonly sucursalUsuarioSelect: Locator;
    private readonly rolUsuarioSelect: Locator;
    private readonly guardarNuevoUsuarioBtn: Locator;
    private readonly cancelarNuevoUsuarioBtn: Locator;
    private readonly confirmarAltaBtn: Locator;
    private readonly confirmarBajaBtn: Locator;
    private readonly siguientePaginaBtn: Locator;
    private readonly ventasBtn: Locator;
    private readonly ventasDiaBtn: Locator;
    private readonly ventasMesBtn: Locator;
    private readonly buscarSucursalTxt: Locator;


    constructor(page: Page) {
        this.page = page;
        this.usuarioBtn = page.locator("button:has-text('Usuario')").first();
        this.nuevoUsuarioBtn = page.locator("button:has-text('Nuevo usuario')");
        this.nombreUsuarioTxt = page.locator("input[name='firstName']");
        this.apellidoUsuarioTxt = page.locator("input[name='lastName']");
        this.emailUsuarioTxt = page.locator("input[name='username']");
        this.telefonoUsuarioTxt = page.locator("input[name='phone']");
        this.sucursalUsuarioSelect = page.locator("#mui-component-select-branchNumber");
        this.rolUsuarioSelect = page.locator("#mui-component-select-role");
        this.guardarNuevoUsuarioBtn = page.locator("button:has-text('Guardar')");
        this.cancelarNuevoUsuarioBtn = page.locator("button:has-text('Cancelar')");
        this.confirmarAltaBtn = page.locator("button:has-text('Sí, dar alta')");
        this.confirmarBajaBtn = page.locator("button:has-text('Sí, dar baja')");
        this.siguientePaginaBtn = page.locator("button[title='Ir a la página siguiente']");
        this.ventasBtn = page.locator("button:has-text('Ventas')");
        this.ventasDiaBtn = page.locator("input[value='Dia']");
        this.ventasMesBtn = page.locator("input[value='mes']");
        this.buscarSucursalTxt = page.locator("#branch-search");
    }

    async clickUsuario(){
        await this.usuarioBtn.click();
    }

     async clickNuevoUsuario(){
        await this.nuevoUsuarioBtn.click();
    }

     async enterNombreUsuario(nombre: string){
        await this.nombreUsuarioTxt.fill(nombre);
    }

    async enterApellidoUsuario(apellido: string){
        await this.apellidoUsuarioTxt.fill(apellido);
    }

    async enterEmailUsuario(email: string){
        await this.emailUsuarioTxt.fill(email);
    }

    async enterTelefonoUsuario(telefono: string){
        await this.telefonoUsuarioTxt.fill(telefono);
    }

     async selectSucursalUsuario(sucursal: string){
        await this.sucursalUsuarioSelect.click();
        await this.page.locator(`li[role='option']:has-text('${sucursal}')`).click();
    }

     async selectRolUsuario(rol: string){
        await this.rolUsuarioSelect.click();
        await this.page.locator(`li[role='option']:has-text('${rol}')`).click();
    }
    
     async clickGuardarNuevoUsuario(){
        await this.guardarNuevoUsuarioBtn.click();
    }

     async clickCancelarNuevoUsuario(){
        await this.cancelarNuevoUsuarioBtn.click();
    }

    async clickDarAlta(nombre: string){
        await this.page.locator(`tr:has-text('${nombre}') button:has-text('Dar alta')`).click();
    }

    async clickDarBaja(nombre: string){
        await this.page.locator(`tr:has-text('${nombre}') button:has-text('Dar baja')`).click();
    }

    async clickConfirmarAlta(){
        await this.confirmarAltaBtn.click();
    }

    async clickConfirmarBaja(){
        await this.confirmarBajaBtn.click();
    }

    async clickSiguientePagina(){
        await this.siguientePaginaBtn.click();
    }

    async clickVentasBtn(){
        await this.ventasBtn.click();
    }

    async clickVentasDiaBtn(){
        await this.ventasDiaBtn.click();
    }

    async clickVentasMesBtn(){
        await this.ventasMesBtn.click();
    }

     async enterSucursal(sucursal: string){
        await this.buscarSucursalTxt.fill(sucursal);
    }
}