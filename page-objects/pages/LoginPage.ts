import BasePage from './BasePage';

export class LoginPage extends BasePage {
    private readonly emailInput = this.page.getByTestId('userEmail')
    private readonly passwordInput = this.page.getByTestId('password')
    private readonly loginBtn = this.page.getByTestId('login-btn')

    /**
     * Navigates to the login page and authenticates the user.
     * If no credentials are provided, it uses default test account credentials.
     * @param {string} [userName] - Optional username/email. Defaults to "Tester".
     * @param {string} [pass] - Optional password. Defaults to "nyhZz%7x6r".
     * @returns {Promise<void>}
     */
    async login(userName?: string, pass?: string) {
        await this.page.goto('/Kaleidoo_AI');
        await this.emailInput.fill(userName || "Tester");
        await this.passwordInput.fill(pass || "nyhZz%7x6r");
        await this.loginBtn.click();
        await this.page.waitForLoadState('networkidle', { timeout: 100000 });

    }
}