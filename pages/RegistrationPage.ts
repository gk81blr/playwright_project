import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly headingRegister: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtPasswordConfirm: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;
    private readonly headingConfirmation: Locator;
    private readonly lnkContinueAfterRegistration: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingRegister = page.getByRole('heading', { name: 'Register Account' });
        // Field ids are the same in OpenCart 3 and 4
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        // Telephone and Password Confirm exist only in OpenCart 3
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtPasswordConfirm = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('#content form').getByRole('button', { name: 'Continue' });
        this.headingConfirmation = page.locator('#content h1');
        this.lnkContinueAfterRegistration = page.locator('#content').getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies the registration page is displayed
     * @returns Promise<boolean> - true if the Register Account heading is visible
     */
    async isRegistrationPageExists(): Promise<boolean> {
        try {
            await this.headingRegister.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the first name
     * @param firstName - First name
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Enters the last name
     * @param lastName - Last name
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Enters the email address
     * @param email - Email address
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the telephone when the form has a Telephone field (OpenCart 3)
     * @param telephone - Telephone number
     */
    async setTelephone(telephone: string): Promise<void> {
        if (await this.txtTelephone.count() > 0) {
            await this.txtTelephone.fill(telephone);
        }
    }

    /**
     * Enters the password, and the confirmation when the form has a Password Confirm field (OpenCart 3)
     * @param password - Password
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
        if (await this.txtPasswordConfirm.count() > 0) {
            await this.txtPasswordConfirm.fill(password);
        }
    }

    /**
     * Accepts the Privacy Policy
     */
    async setPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /**
     * Clicks the Continue button to submit the registration form
     */
    async clickContinue(): Promise<void> {
        await this.btnContinue.click();
    }

    /**
     * Fills and submits the complete registration form
     * @param userData - First name, last name, email, telephone and password of the new customer
     */
    async completeRegistration(userData: { firstName: string; lastName: string; email: string; telephone: string; password: string }): Promise<void> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setPrivacyPolicy();
            await this.clickContinue();
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Gets the confirmation heading shown after registration
     * @returns Promise<string> - Confirmation message text
     */
    async getConfirmationMsg(): Promise<string> {
        await this.page.waitForURL(/route=account\/success/);
        return (await this.headingConfirmation.textContent()) ?? '';
    }

    /**
     * Clicks Continue on the account-created page
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickContinueAfterRegistration(): Promise<MyAccountPage> {
        await this.lnkContinueAfterRegistration.click();
        return new MyAccountPage(this.page);
    }
}
