import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearch: Locator;
    private readonly lnkProductNames: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSearch = page.locator('#content h1');
        this.lnkProductNames = page.locator('#content .product-thumb h4 a');
    }

    /**
     * Verifies the search results page is displayed
     * @returns Promise<boolean> - true if the Search heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.page.waitForURL(/route=product\/search/);
            await this.headingSearch.waitFor({ state: 'visible' });
            return ((await this.headingSearch.textContent()) ?? '').startsWith('Search');
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether a product with the exact name is listed in the results
     * @param productName - Product name to look for
     * @returns Promise<boolean> - true if the product is listed
     */
    async isProductExist(productName: string): Promise<boolean> {
        try {
            await this.productLink(productName).waitFor({ state: 'visible' });
            return true;
        } catch (error) {
            console.log(`Error checking product in results: ${error}`);
            return false;
        }
    }

    /**
     * Gets the names of all products in the results
     * @returns Promise<string[]> - Product names
     */
    async getProductNames(): Promise<string[]> {
        return await this.lnkProductNames.allTextContents();
    }

    /**
     * Opens the product details page for the given product
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async selectProduct(productName: string): Promise<ProductPage> {
        await this.productLink(productName).click();
        return new ProductPage(this.page);
    }

    private productLink(productName: string): Locator {
        return this.page.locator('#content .product-thumb').getByRole('heading', { name: productName, exact: true }).getByRole('link');
    }
}
