import { Locator, Page } from "@playwright/test"

export class VentasMP {
    private page: Page;
    private readonly monthBtn: Locator;
    private readonly dayBtn: Locator;
    private readonly dateRangeBtn: Locator;
    private readonly monthSelector: Locator;
    private readonly daySelector: Locator;
    private readonly dateFromSelector: Locator;
    private readonly dateToSelector: Locator;
    private readonly sucursalSelector: Locator;
    private readonly estadoSelector: Locator;

    constructor(page: Page) {
        this.page = page;
        this.monthBtn = page.locator("input[value='Mes']");
        this.dayBtn = page.locator("input[value='Dia']");
        this.dateRangeBtn = page.locator("input[value='Rango de fecha']");
        this.monthSelector = page.locator("button svg[data-testid='CalendarTodayOutlinedIcon']");
        this.daySelector = page.locator("#date-filter-day");
        this.dateFromSelector = page.locator("#date-filter-from");
        this.dateToSelector = page.locator("#date-filter-to");
        this.sucursalSelector = page.locator("#select-sucursal");
        this.estadoSelector = page.locator("#select-estado");
    }

    async clickMonthBtn() {
        await this.monthBtn.click();
    }

    async clickDayBtn() {
        await this.dayBtn.click();
    }

     async clickDateRangeBtn() {
        await this.dateRangeBtn.click();
    }

     async selectMonth(month: String) {
        await this.monthSelector.click();
        await this.page.locator(`button:has-text('${month}')`).click();
    }

    async selectDay(day: string, month: string, year: string) {
        if (month === '1'){
            month = '01';
        }
        await this.daySelector.clear();
        await this.daySelector.type(`${day}${month}${year}`);
    }

    async selectDateFrom(day: Number, month: Number, year: Number) {
        await this.dateFromSelector.fill(`${day}${month}${year}`);
    }

    async selectDateTo(day: Number, month: Number, year: Number) {
        await this.dateToSelector.fill(`${day}${month}${year}`);
    }

    async selectSucursal(sucursal: string){
        await this.sucursalSelector.click();
        await this.page.locator(`li:has-text('${sucursal}')`).click();
    }

    async selectEstado(estado: string){
        await this.estadoSelector.click();
        await this.page.locator(`li:has-text('${estado}')`).click();
    }
}
