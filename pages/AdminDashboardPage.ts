import { Page, Locator } from '@playwright/test';
import { AdminCustomersPage } from './AdminCustomersPage';

export class AdminDashboardPage {
    private readonly page: Page;

    // Locators
    private readonly headingDashboard: Locator;
    private readonly modalSecurity: Locator;
    private readonly btnCloseSecurityModal: Locator;
    private readonly lnkCustomersMenu: Locator;
    private readonly lnkCustomersSubMenu: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingDashboard = page.getByRole('heading', { name: 'Dashboard', level: 1 });
        this.modalSecurity = page.locator('#modal-security');
        this.btnCloseSecurityModal = page.locator('#modal-security .btn-close');
        // Menu link names include icon characters: the parent ends with one, the sub-menu link starts with one
        this.lnkCustomersMenu = page.locator('#menu').getByRole('link', { name: /^Customers/ }).first();
        this.lnkCustomersSubMenu = page.locator('#menu').getByRole('link', { name: /Customers$/ });
    }

    /**
     * Verifies the admin dashboard is displayed
     * @returns Promise<boolean> - true if the Dashboard heading is visible
     */
    async isDashboardPageExists(): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=common\/dashboard/);
            await this.headingDashboard.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking admin dashboard: ${error}`);
            return false;
        }
    }

    /**
     * Closes the "Important Security Notification!" popup when OpenCart shows it
     */
    async closeSecurityNotificationIfPresent(): Promise<void> {
        try {
            await this.modalSecurity.waitFor({ state: 'visible', timeout: 5000 });
            await this.btnCloseSecurityModal.click();
            await this.modalSecurity.waitFor({ state: 'hidden' });
        } catch (error) {
            console.log('Security notification not shown');
        }
    }

    /**
     * Opens Customers → Customers from the left menu
     * @returns Promise<AdminCustomersPage> - Instance of the admin customers page
     */
    async navigateToCustomers(): Promise<AdminCustomersPage> {
        await this.lnkCustomersMenu.click();
        await this.lnkCustomersSubMenu.click();
        return new AdminCustomersPage(this.page);
    }
}
