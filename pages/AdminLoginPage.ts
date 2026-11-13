import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtUsername = page.getByLabel('Username');
        this.txtPassword = page.getByLabel('Password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Opens the admin portal login page
     * @param adminUrl - Admin portal URL
     */
    async navigateToAdminPortal(adminUrl: string): Promise<void> {
        await this.page.goto(adminUrl);
    }

    /**
     * Verifies the admin login page is displayed
     * @returns Promise<boolean> - true if the Username field is visible
     */
    async isAdminLoginPageExists(): Promise<boolean> {
        try {
            await this.txtUsername.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking admin login page: ${error}`);
            return false;
        }
    }

    /**
     * Logs in to the admin portal
     * @param username - Admin username
     * @param password - Admin password
     * @returns Promise<AdminDashboardPage> - Instance of the admin dashboard page
     */
    async login(username: string, password: string): Promise<AdminDashboardPage> {
        try {
            await this.txtUsername.fill(username);
            await this.txtPassword.fill(password);
            await this.btnLogin.click();
            return new AdminDashboardPage(this.page);
        } catch (error) {
            console.log(`Error during admin login: ${error}`);
            throw error;
        }
    }
}
