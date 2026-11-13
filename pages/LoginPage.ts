import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly headingReturningCustomer: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly msgAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingReturningCustomer = page.getByRole('heading', { name: 'Returning Customer' });
        this.txtEmail = page.getByLabel('E-Mail Address');
        this.txtPassword = page.getByLabel('Password');
        this.btnLogin = page.locator('#form-login').getByRole('button', { name: 'Login' });
        this.msgAlert = page.locator('#alert .alert');
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the Returning Customer section is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.headingReturningCustomer.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the email address
     * @param email - Email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the password
     * @param password - Password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Clicks the Login button
     */
    async clickLogin(): Promise<void> {
        await this.btnLogin.click();
    }

    /**
     * Logs in with the given credentials
     * @param email - Email address
     * @param password - Password
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            await this.clickLogin();
            return new MyAccountPage(this.page);
        } catch (error) {
            console.log(`Error during login: ${error}`);
            throw error;
        }
    }

    /**
     * Gets the warning message shown after a failed login
     * @returns Promise<string> - Warning message text
     */
    async getLoginErrorMessage(): Promise<string> {
        await this.msgAlert.waitFor({ state: 'visible' });
        return ((await this.msgAlert.textContent()) ?? '').trim();
    }
}
