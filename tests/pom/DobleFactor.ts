import { Locator, Page, expect } from "@playwright/test"

export class DobleFactor {

    private readonly code_df0: Locator
    private readonly code_df1: Locator
    private readonly code_df2: Locator
    private readonly code_df3: Locator
    private readonly code_df4: Locator
    private readonly code_df5: Locator
    private readonly aceptarButton: Locator
    

    constructor(page: Page) {
        this.code_df0 = page.locator("input#code-input-0");
        this.code_df1 = page.locator("input#code-input-1");
        this.code_df2 = page.locator("input#code-input-2");
        this.code_df3 = page.locator("input#code-input-3");
        this.code_df4 = page.locator("input#code-input-4");
        this.code_df5 = page.locator("input#code-input-5");
        this.aceptarButton = page.getByRole('button', { name: 'Aceptar' })
    }

    async fillPassword(code: string) {
        await this.code_df0.waitFor({ state: 'visible' })
        await this.code_df0.fill(code[0])
        await this.code_df1.fill(code[1])
        await this.code_df2.fill(code[2])
        await this.code_df3.fill(code[3])
        await this.code_df4.fill(code[4])
        await this.code_df5.fill(code[5])
    }

    async clickOnAceptar() {
        await this.aceptarButton.click()
    }

    async loginWithCredentials(code: string) {
        await this.code_df0.fill(code[0])
        await this.code_df1.fill(code[1])
        await this.code_df2.fill(code[2])
        await this.code_df3.fill(code[3])
        await this.code_df4.fill(code[4])
        await this.code_df5.fill(code[5])
        await this.clickOnAceptar()
    }
    
}