import { Locator, Page } from "@playwright/test"

export class HomeMP {

    private readonly saludo: Locator;
   
    

    constructor(page: Page) {
        this.saludo = page.locator("h1");
       
    }

    async getSaludo() {
        return await this.saludo.textContent();
    }

    
}
