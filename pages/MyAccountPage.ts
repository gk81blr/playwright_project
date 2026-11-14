import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly lnkLogout: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        // h1 in OpenCart 4, h2 in OpenCart 3
        this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
        this.lnkLogout = page.getByRole('complementary').getByRole('link', { name: 'Logout' });
    }

    /**
     * Verifies the My Account page is displayed
     * @returns Promise<boolean> - true if the My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=account\/account/);
            await this.headingMyAccount.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Logout link in the account menu
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        return new LogoutPage(this.page);
    }
}
