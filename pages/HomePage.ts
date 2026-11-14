import { Page, Locator } from '@playwright/test';
import { RegistrationPage } from './RegistrationPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ShoppingCartPage } from './ShoppingCartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkFeaturedHeading: Locator;
    private readonly btnMyAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkLogout: Locator;
    private readonly lnkShoppingCart: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkFeaturedHeading = page.getByRole('heading', { name: 'Featured' });
        // OpenCart 4 uses a "My Account" button, OpenCart 3 a "My Account" link
        this.btnMyAccount = page.locator('#top').getByRole('button', { name: 'My Account' })
            .or(page.locator('#top').getByRole('link', { name: /My Account/ })).first();
        this.lnkRegister = page.locator('#top').getByRole('link', { name: 'Register' });
        this.lnkLogin = page.locator('#top').getByRole('link', { name: 'Login' });
        this.lnkLogout = page.locator('#top').getByRole('link', { name: 'Logout' });
        this.lnkShoppingCart = page.locator('#top').getByRole('link', { name: 'Shopping Cart' });
        this.txtSearch = page.getByRole('banner').getByPlaceholder('Search');
        // OpenCart 3: button inside #search; OpenCart 4: submit button of the header search form
        this.btnSearch = page.locator('#search button')
            .or(page.getByRole('banner').locator('form button[type="submit"]'));
    }

    /**
     * Verifies the home page is displayed
     * @returns Promise<boolean> - true if the Featured section is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.lnkFeaturedHeading.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }

    /**
     * Opens the My Account dropdown in the top navigation
     */
    async clickMyAccount(): Promise<void> {
        await this.btnMyAccount.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     * @returns Promise<RegistrationPage> - Instance of the registration page
     */
    async clickRegister(): Promise<RegistrationPage> {
        await this.lnkRegister.click();
        return new RegistrationPage(this.page);
    }

    /**
     * Clicks the Login link in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.lnkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Clicks the Logout link in the My Account dropdown
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Checks whether the Logout link is shown in the opened My Account dropdown
     * @returns Promise<boolean> - true if the Logout link is visible
     */
    async isLogoutLinkExists(): Promise<boolean> {
        return await this.lnkLogout.isVisible();
    }

    /**
     * Checks whether the Login link is shown in the opened My Account dropdown
     * @returns Promise<boolean> - true if the Login link is visible
     */
    async isLoginLinkExists(): Promise<boolean> {
        try {
            await this.lnkLogin.waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking Login link: ${error}`);
            return false;
        }
    }

    /**
     * Enters a product name in the header search box
     * @param productName - Product name to search for
     */
    async enterProductName(productName: string): Promise<void> {
        await this.txtSearch.fill(productName);
    }

    /**
     * Clicks the header search button
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async clickSearch(): Promise<SearchResultsPage> {
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }

    /**
     * Clicks the Shopping Cart link in the top navigation
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.lnkShoppingCart.click();
        return new ShoppingCartPage(this.page);
    }
}
