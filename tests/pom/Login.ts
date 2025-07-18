import { Locator, Page, expect } from "@playwright/test"

export class LoginMP {

    private readonly usernameTextbox: Locator
    private readonly passwordTextbox: Locator
    private readonly loginButton: Locator
    

    constructor(page: Page) {
        this.usernameTextbox = page.getByRole('textbox', { name: 'email' })
        this.passwordTextbox = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    }

    async fillUsername(username: string) {
        await this.usernameTextbox.waitFor({ state: 'visible' })
        await this.usernameTextbox.fill(username);
    }

    async fillPassword(password: string) {
       // await this.passwordTextbox.waitFor({ state: 'visible' })
        await this.passwordTextbox.fill(password)
    }

    async clickOnLogin() {
        await this.loginButton.click()
    }

    async loginWithCredentials(username: string, password: string) {
        await this.fillUsername(username)
        await this.fillPassword(password)
        await this.clickOnLogin()
    }

}
