import { Page, Locator } from '@playwright/test';
import { AdminCustomerEditPage } from './AdminCustomerEditPage';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly headingCustomers: Locator;
    private readonly txtFilterEmail: Locator;
    private readonly btnFilter: Locator;
    private readonly rowsCustomers: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingCustomers = page.getByRole('heading', { name: 'Customers', level: 1 });
        this.txtFilterEmail = page.getByRole('textbox', { name: 'E-Mail' });
        this.btnFilter = page.getByRole('button', { name: 'Filter' });
        this.rowsCustomers = page.locator('#customer tbody tr');
    }

    /**
     * Verifies the customer list page is displayed
     * @returns Promise<boolean> - true if the Customers heading is visible
     */
    async isCustomersPageExists(): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=customer\/customer/);
            await this.headingCustomers.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking customers page: ${error}`);
            return false;
        }
    }

    /**
     * Filters the customer list by email
     * @param email - Customer email
     */
    async filterByEmail(email: string): Promise<void> {
        await this.txtFilterEmail.fill(email);
        // The filter reloads the list with AJAX (route=customer/customer.list); wait for that response
        const listResponse = this.page.waitForResponse(
            (response) => response.url().includes('route=customer/customer.list') && response.url().includes('filter_email='),
        );
        await this.btnFilter.click();
        await listResponse;
        // Wait until rows for other customers are gone from the reloaded list
        await this.rowsCustomers.filter({ hasNotText: email }).first().waitFor({ state: 'detached' });
    }

    /**
     * Checks whether a customer with the given email is listed
     * @param email - Customer email
     * @returns Promise<boolean> - true if the customer row is visible
     */
    async isCustomerExists(email: string): Promise<boolean> {
        try {
            await this.customerRow(email).waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking customer in list: ${error}`);
            return false;
        }
    }

    /**
     * Gets the number of customers listed after filtering
     * @returns Promise<number> - Row count
     */
    async getCustomerCount(): Promise<number> {
        return await this.rowsCustomers.count();
    }

    /**
     * Gets the customer name shown in the list for the given email
     * @param email - Customer email
     * @returns Promise<string> - Customer name, e.g. "John Doe"
     */
    async getCustomerName(email: string): Promise<string> {
        return ((await this.customerRow(email).getByRole('cell').nth(1).textContent()) ?? '').trim();
    }

    /**
     * Opens the edit form of the customer with the given email
     * @param email - Customer email
     * @returns Promise<AdminCustomerEditPage> - Instance of the customer edit page
     */
    async clickEditCustomer(email: string): Promise<AdminCustomerEditPage> {
        await this.customerRow(email).getByRole('link', { name: 'Edit' }).click();
        return new AdminCustomerEditPage(this.page);
    }

    private customerRow(email: string): Locator {
        return this.rowsCustomers.filter({ has: this.page.getByRole('cell', { name: email, exact: true }) });
    }
}
