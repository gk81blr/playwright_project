import { Page, Locator } from '@playwright/test';

export class AdminCustomerEditPage {
    private readonly page: Page;

    // Locators
    private readonly lblEditCustomer: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly chkStatus: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lblEditCustomer = page.getByText('Edit Customer', { exact: true });
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.chkStatus = page.locator('#input-status');
    }

    /**
     * Verifies the customer edit form is displayed
     * @returns Promise<boolean> - true if the Edit Customer form is visible
     */
    async isEditCustomerPageExists(): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=customer\/customer\.form/);
            await this.lblEditCustomer.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking customer edit page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the first name shown in the form
     * @returns Promise<string> - First name
     */
    async getFirstName(): Promise<string> {
        return await this.txtFirstName.inputValue();
    }

    /**
     * Gets the last name shown in the form
     * @returns Promise<string> - Last name
     */
    async getLastName(): Promise<string> {
        return await this.txtLastName.inputValue();
    }

    /**
     * Gets the email shown in the form
     * @returns Promise<string> - Email
     */
    async getEmail(): Promise<string> {
        return await this.txtEmail.inputValue();
    }

    /**
     * Checks whether the customer Status switch is enabled
     * @returns Promise<boolean> - true if Status is enabled
     */
    async isStatusEnabled(): Promise<boolean> {
        return await this.chkStatus.isChecked();
    }
}
